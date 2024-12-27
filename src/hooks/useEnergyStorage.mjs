import React, { useContext, useMemo } from 'react'
import { ethers } from 'ethers';
import UserContext from '../context/UserContext';
import config from '../../config.mjs';
import EnergyStorageABI from '../abi/EnergyStorageABI.json';
import { createContract } from '../utilities/web3Handler.mjs';

const useEnergyStorage = () => {
    const { signer } = useContext(UserContext);
    const { address } = config.contracts.energyStorage;

    const energyStorageContract = useMemo(() => {
        if (!signer) {
            console.error("Signer is not available");
            return null;
        }

        if (!address || !EnergyStorageABI) {
            console.error("Contract address or ABI missing in config");
            return null;
        }

        try {
            return createContract(address, EnergyStorageABI, signer);
        } catch (error) {
            console.error("Error creating contract:", error);
            return null;
        }
    }, [signer, address]);

    return { energyStorageContract };
}

export default useEnergyStorage;
