// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
    PoolActivityList,
    IPoolActivityListProps,
} from '../../../src/components/stake/PoolActivityList';
import { useWallet } from '@explorer/wallet';
import { withChakraTheme } from '../../test-utilities';
import usePoolActivities, {
    Activity,
} from '../../../src/graphql/hooks/usePoolActivities';

jest.mock('../../../src/graphql/hooks/usePoolActivities');
const mockUsePoolActivities = usePoolActivities as jest.MockedFunction<
    typeof usePoolActivities
>;
const POOL_ADDRESS = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';
const defaultTimestamp = 1643576268000;
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';

const defaultProps = {
    poolAddress: POOL_ADDRESS,
};

jest.mock('@explorer/wallet');
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

const EPoolActivityList =
    withChakraTheme<IPoolActivityListProps>(PoolActivityList);

describe('Pool Activity List', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EPoolActivityList {...defaultProps} />);

    beforeEach(() => {
        mockUseWallet.mockReturnValue({
            account,
            active: true,
            activate: jest.fn(),
            deactivate: jest.fn(),
            chainId: 3,
        });

        // default mock return
        mockUsePoolActivities.mockReturnValue({
            loading: false,
            activities: [
                {
                    amount: '150000000000000000000',
                    id: '0x5316176a7262ab6cd401a212c6cd892662ea43b67537c4af22bcbc4e8cd996de',
                    timestamp: defaultTimestamp,
                    type: 'Deposit',
                    user: {
                        id: 123123,
                    },
                } as unknown as Activity,
            ],
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('Should display load more text', () => {
        renderComponent();
        expect(screen.getByText('Load more...')).toBeInTheDocument();
    });

    it('Should invoke all activities loaded text', () => {
        renderComponent();

        fireEvent.click(screen.getByText('Load more...').closest('button'));

        expect(
            screen.getByText('All pool activities loaded')
        ).toBeInTheDocument();
    });
});
