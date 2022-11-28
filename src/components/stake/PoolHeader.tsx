// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ArrowBackIcon, EditIcon } from '@chakra-ui/icons';
import { Box, VStack, Stack, Button, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useFlag } from '@unleash/proxy-client-react';
import { isString } from 'lodash';
import { useWallet } from '../../contexts/wallet';
import AddressText from '../AddressText';
import { StakingTabNavigation } from './StakingTabNavigation';

export interface PoolHeaderProps {
    from?: string;
    isManager?: boolean;
}

export const PoolHeader = ({ from, isManager = false }: PoolHeaderProps) => {
    const router = useRouter();
    const address = router.query.pool as string;
    const { chainId } = useWallet();
    const newPoolListPageEnabled = useFlag('newPoolListPageEnabled');

    return (
        <Box
            bg="header"
            color="white"
            px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
            pt={5}
        >
            <Stack
                justify="space-between"
                alignItems={{ base: 'flex-start', lg: 'flex-end' }}
                direction={{ base: 'column', lg: 'row' }}
            >
                <VStack alignItems="flex-start" pb="5">
                    <HStack alignItems="flex-start">
                        <NextLink
                            href={newPoolListPageEnabled ? '/stake' : '/pools'}
                            passHref
                        >
                            <Button
                                as="a"
                                leftIcon={<ArrowBackIcon />}
                                variant="text"
                                size="sm"
                                px="0"
                            >
                                Staking pool
                            </Button>
                        </NextLink>

                        {isManager && (
                            <NextLink
                                href={`/pools/${address}/manage${
                                    isString(from) ? `?from=${from}` : ''
                                }`}
                                passHref
                                data-testid="pool-management-link"
                            >
                                <Button as="a" variant="text" size="sm" pl={0}>
                                    <EditIcon />
                                </Button>
                            </NextLink>
                        )}
                    </HStack>

                    <AddressText
                        address={address}
                        chainId={chainId}
                        fontSize={['xl', '2xl']}
                    />
                </VStack>

                <StakingTabNavigation />
            </Stack>
        </Box>
    );
};
