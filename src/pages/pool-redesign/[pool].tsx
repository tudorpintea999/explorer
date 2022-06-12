// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { constants } from 'ethers';
import { PoolHeader } from '../../components/poolRedesign/PoolHeader';
import { PoolBreadcrumbs } from '../../components/poolRedesign/PoolBreadcrumbs';

import {
    Collapse,
    useDisclosure,
    VStack,
    useColorModeValue,
    HStack,
    Heading,
    Box,
} from '@chakra-ui/react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { QueryResult } from '@apollo/client';
import { useBlockNumber } from '../../services/eth';
import { useCartesiToken } from '../../services/token';
import { useStaking } from '../../services/staking';
import { useStakingPool } from '../../services/pool';
import { useWallet } from '../../contexts/wallet';
import useStakingPoolQuery from '../../graphql/hooks/useStakingPool';
import PoolStatsPanel from '../../components/poolRedesign/PoolStatsPanel';
import { PoolActivity } from '../../components/poolRedesign/PoolActivity';
import useBlocks from '../../graphql/hooks/useBlocks';
import { BlocksData, BlocksVars } from '../../graphql/models';

const blockAverageInterval = (
    result: QueryResult<BlocksData, BlocksVars>
): number => {
    const count = result.data?.blocks?.length;
    if (count > 0) {
        const last = result.data.blocks[count - 1];
        const now = Date.now();
        return (now - last.timestamp * 1000) / count;
    }
    return 0;
};

const poolRedesign = () => {
    const { account, chainId } = useWallet();

    // get pool address from path
    const router = useRouter();
    const address = router.query.pool as string;

    // query block number (continuouly)
    const blockNumber = useBlockNumber();

    // query pool data
    const { amount, amounts, rebalance } = useStakingPool(address, account);

    // query pool contract ERC20 balance
    const { balance: poolBalance } = useCartesiToken(
        address,
        null,
        blockNumber
    );

    // query staking contract with pool address
    const staking = useStaking(address);

    // query thegraph pool data
    const stakingPool = useStakingPoolQuery(address);

    // query 10 latest blocks for average interval
    const productionInterval = blockAverageInterval(
        useBlocks({ producer: address }, 10)
    );

    const bgPageDevider = useColorModeValue('gray.100', 'gray.900');
    const titleLeftBorder = useColorModeValue('gray.900', 'white');

    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: true,
    });

    return (
        <Layout>
            <Head>
                <title>Cartesi - Pool Info</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PoolHeader />
            <PoolBreadcrumbs currentPage="Overview" />
            <Box
                px={{ base: '6vw', xl: '12vw' }}
                py={{ base: 8, sm: 12, lg: 16 }}
            >
                <HStack
                    spacing={4}
                    align="center"
                    justify="space-between"
                    mb={2}
                    display={{
                        base: 'flex',
                        lg: 'none',
                    }}
                    onClick={onToggle}
                >
                    <Heading
                        size="lg"
                        borderLeftWidth={2}
                        borderLeftColor={titleLeftBorder}
                        pl={4}
                    >
                        Overview
                    </Heading>

                    <Box transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}>
                        <ChevronDownIcon w={6} h={6} />
                    </Box>
                </HStack>

                <Collapse in={isOpen}>
                    <VStack spacing={8}>
                        <PoolStatsPanel
                            address={address}
                            productionInterval={productionInterval}
                            stakedBalance={amount}
                            totalBlocks={stakingPool?.user?.totalBlocks}
                            totalReward={stakingPool?.user?.totalReward}
                            totalUsers={stakingPool?.totalUsers}
                            commissionPercentage={
                                stakingPool?.commissionPercentage
                            }
                            fee={stakingPool?.fee}
                            amount={amount}
                            pool={poolBalance}
                            stake={amounts?.stake}
                            unstake={amounts?.unstake}
                            withdraw={amounts?.withdraw}
                            stakingMature={staking?.stakedBalance}
                            stakingMaturing={staking?.maturingBalance}
                            stakingReleasing={
                                staking?.releasingTimestamp?.getTime() >
                                Date.now()
                                    ? staking.releasingBalance
                                    : constants.Zero
                            }
                            stakingReleased={
                                staking?.releasingTimestamp?.getTime() <=
                                Date.now()
                                    ? staking.releasingBalance
                                    : constants.Zero
                            }
                            stakingMaturingTimestamp={
                                staking?.maturingTimestamp
                            }
                            stakingReleasingTimestamp={
                                staking?.releasingTimestamp
                            }
                            hideZeros={true}
                            onRebalance={rebalance}
                        />
                    </VStack>
                </Collapse>
            </Box>
            <Box
                bg={bgPageDevider}
                as="hr"
                border={0}
                shadow="inner"
                h={6}
                w="full"
            />
            <Box
                px={{ base: '6vw', xl: '12vw' }}
                py={{ base: 8, sm: 12, lg: 16 }}
            >
                <Heading as="h2" size="lg" mb={4}>
                    Pool Activity
                </Heading>

                <PoolActivity poolAddress={address} />
            </Box>
        </Layout>
    );
};

export default poolRedesign;
