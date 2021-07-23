// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
    Button,
    Center,
    Heading,
    HStack,
    Spinner,
    StackProps,
    Tag,
    TagLabel,
    TagCloseButton,
    VStack,
} from '@chakra-ui/react';
import { FaEllipsisH } from 'react-icons/fa';

import Layout from '../../components/Layout';
import useBlocks, {
    useNodeBlocks,
    useProducerBlocks,
} from '../../graphql/hooks/useBlocks';
import { BlocksData, BlocksVars } from '../../graphql/models';
import { QueryResult } from '@apollo/client';
import BlocksChart from '../../components/BlocksChart';
import BlockCard from '../../components/block/BlockCard';
import SearchInput from '../../components/SearchInput';
import PageHeader from '../../components/PageHeader';

interface FilterProps {
    label: string;
    value: string;
    onDelete?: () => void;
}

const Filter: FunctionComponent<FilterProps> = ({ label, value, onDelete }) => (
    <HStack spacing={4} justify="flex-start">
        <Tag borderRadius="full" variant="solid">
            <TagLabel>
                {label}: {value}
            </TagLabel>
            <TagCloseButton onClick={onDelete} />
        </Tag>
    </HStack>
);

interface BlockListProps extends StackProps {
    result: QueryResult<BlocksData, BlocksVars>;
    filterField?: 'node' | 'producer' | 'id';
    filterValue?: string;
}

const BlockList = (props: BlockListProps) => {
    const { result, filterField, filterValue, ...stackProps } = props;
    const { data, loading, fetchMore } = result;
    const blocks = data?.blocks || [];

    // handler for the "load more" button
    const loadMore = () => {
        if (blocks.length > 0 && fetchMore) {
            const variables = { ...result.variables };

            fetchMore({
                variables: {
                    ...variables,
                    skip: blocks.length,
                },
            });
        }
    };

    // if this is a filtered list and there are no blocks, just don't render anything
    if (filterField && blocks.length == 0) {
        return <div />;
    }

    return (
        <VStack spacing={5} {...stackProps}>
            {filterField && <Filter label={filterField} value={filterValue} />}
            {blocks.map((block) => {
                return (
                    <BlockCard
                        key={block.id}
                        block={block}
                        highlight={filterField}
                        width="100%"
                    />
                );
            })}
            <Center>
                <Button onClick={loadMore} disabled={loading}>
                    {loading ? <Spinner /> : <FaEllipsisH />}
                </Button>
            </Center>
        </VStack>
    );
};

const Blocks = () => {
    const router = useRouter();

    let { block: blockId } = router.query;
    // TODO: use blockId
    blockId = blockId && blockId.length > 0 ? (blockId[0] as string) : '';

    const [searchKey, setSearchKey] = useState<string>(blockId);

    // list of all blocks, unfiltered
    const all = useBlocks();

    // list of blocks filtered by producer
    const byProducer = useProducerBlocks(searchKey);

    // list of blocks filtered by node
    const byNode = useNodeBlocks(searchKey);

    return (
        <Layout>
            <Head>
                <title>Cartesi - Blocks</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PageHeader title="Blocks">
                <SearchInput
                    w={[100, 200, 400, 400]}
                    bg="gray.200"
                    onSearchChange={(e) => setSearchKey(e.target.value)}
                />
            </PageHeader>

            <Heading w="100%" px="6vw" py="5">
                Difficulty per Chain
            </Heading>
            <BlocksChart result={all} />

            {!searchKey && <BlockList result={all} w="100%" px="6vw" py="5" />}
            <BlockList
                result={byProducer}
                filterField="producer"
                filterValue={searchKey}
                w="100%"
                px="6vw"
                py="5"
            />
            <BlockList
                result={byNode}
                filterField="node"
                filterValue={searchKey}
                w="100%"
                px="6vw"
                py="5"
            />
        </Layout>
    );
};

export default Blocks;
