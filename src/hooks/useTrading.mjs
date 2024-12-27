import React, { useContext, useMemo } from 'react'
import { ethers } from 'ethers';
import UserContext from '../context/UserContext';
import config from '../../config.mjs';
import TradingABI from '../abi/TradingABI.json';
import { createContract } from '../utilities/web3Handler.mjs';

const useTrading = () => {
    const { signer } = useContext(UserContext);
    const { address } = config.contracts.trading;

    const tradingContract = useMemo(() => {
        if (!signer) {
            console.error("Signer is not available");
            return null;
        }

        if (!address || !TradingABI) {
            console.error("Contract address or ABI missing in config");
            return null;
        }

        try {
            return createContract(address, TradingABI, signer);
        } catch (error) {
            console.error("Error creating contract:", error);
            return null;
        }
    }, [signer, address]);

    return { tradingContract };
}

export default useTrading;
