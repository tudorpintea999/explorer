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
    Button,
    FormControl,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    Text,
    FormHelperText,
    FormLabel,
    UseDisclosureProps,
    NumberInputField,
    NumberInput,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import React, { FC, useRef, useState } from 'react';

interface IStakingStakeModalProps {
    balance: BigNumber;
    userBalance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (amount: string) => void;
}

export const StakingStakeModal: FC<IStakingStakeModalProps> = ({
    userBalance,
    disclosure,
    isOpen: isOpen,
    onClose: onClose,
    onSave: onSave,
}) => {
    const [amount, setAmount] = useState('');

    const inputFocusRef = useRef();
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                initialFocusRef={inputFocusRef}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Start staking by moving your tokens from the pool
                        balance to your staked balance.
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                Your staked tokens contribute to the pool's
                                staking power, which in turn will automatically
                                generate rewards.
                            </Text>
                            <FormControl id="stakeAmount">
                                <FormLabel fontWeight="bold">Amount</FormLabel>
                                <NumberInput
                                    defaultValue={1}
                                    in={1}
                                    min={1}
                                    max={userBalance.toNumber()}
                                    ref={inputFocusRef}
                                    onChange={(value) => {
                                        setAmount(value);
                                    }}
                                >
                                    <NumberInputField />
                                    <InputRightElement
                                        color="gray.300"
                                        size="lg"
                                        pointerEvents="none"
                                        w={24}
                                        h="100%"
                                        children={<Box>CTSI</Box>}
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormHelperText>
                                    Max. available: {userBalance.toNumber()}{' '}
                                    CTSI
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    isFullWidth
                                    colorScheme="darkGray"
                                    onClick={() => {
                                        onSave(amount);
                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    Stake
                                </Button>
                                <Button
                                    isFullWidth
                                    variant="outline"
                                    colorScheme="darkGray"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                            </VStack>
                        </ModalFooter>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
