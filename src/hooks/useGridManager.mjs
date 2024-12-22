import React, { useContext, useMemo } from 'react'
import { ethers } from 'ethers';
import UserContext from '../context/UserContext';
import config from '../../config.mjs';
import GridManagerABI from '../abi/GridManagerABI.json';
import { createContract } from '../utilities/web3Handler.mjs';

const useGridManager = () => {
    const { signer } = useContext(UserContext);
    const { address } = config.contracts.gridManager;

    const gridManagerContract = useMemo(() => {
        if (!signer) {
            console.error("Signer is not available");
            return null;
        }

        if (!address || !GridManagerABI) {
            console.error("Contract address or ABI missing in config");
            return null;
        }

        try {
            return createContract(address, GridManagerABI, signer);
        } catch (error) {
            console.error("Error creating contract:", error);
            return null;
        }
    }, [signer, address]);

    return { gridManagerContract };
}

export default useGridManager;
