// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Center,
    Flex,
    StackProps,
    Text,
    useBreakpointValue,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import Footer, { FooterContract, FooterLink } from './Footer';
import Header from './Header';
import { HeaderLink } from './header/NavBar';

interface ComponentProps {
    children: React.ReactNode;
}

export const ResponsiveDebug: FC = () => {
    const color = useBreakpointValue(['yellow', 'red', 'green', 'blue']);
    const size = useBreakpointValue(['sm', 'md', 'lg', 'xl']);
    const index = useBreakpointValue([0, 1, 2, 3]);
    return (
        <Center w="100%" minH={50} bg={color}>
            <Text>
                {size} [{index}]
            </Text>
        </Center>
    );
};

export const PageHeader: FC<ComponentProps> = ({ children }) => (
    <Box w="100%" bg="gray.900" color="white" px="6vw" py={5}>
        {children}
    </Box>
);

export interface PagePanelProps extends ComponentProps {
    darkModeColor?: string;
}

export const PagePanel: FC<PagePanelProps> = ({
    children,
    darkModeColor = 'gray.700',
    ...restProps
}) => {
    const bg = useColorModeValue('white', darkModeColor);
    const bgHeader = useColorModeValue('white', 'gray.800');
    return (
        <Center
            bgGradient={`linear(to-b, gray.900 0%, gray.900 50%, ${bgHeader} 50%, ${bgHeader} 100%)`}
            {...restProps}
        >
            <Box bg={bg} w="100%" shadow="md">
                {children}
            </Box>
        </Center>
    );
};

export const PageBody: FC<StackProps> = ({ children, ...restProps }) => (
    <VStack px="6vw" py={5} align="stretch" {...restProps}>
        {children}
    </VStack>
);

export type LayoutProps = {
    headerLinks: HeaderLink[];
    footerLinks: FooterLink[];
    footerContracts: FooterContract[];
    children: React.ReactNode;
};

const Layout: FC<LayoutProps> = ({
    children,
    headerLinks,
    footerLinks,
    footerContracts,
}) => {
    return (
        <Flex direction="column" align="center" m="0 auto" minHeight="100vh">
            <Header links={headerLinks} />
            <Box width="100%" paddingTop="100px">
                {children}
            </Box>
            <Footer contracts={footerContracts} links={footerLinks} />
        </Flex>
    );
};

export default Layout;
