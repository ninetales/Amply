import { ethers } from 'ethers';

export const createContract = (address, abi, signer) => {
    if (!signer) throw new Error("Signer is not available");
    if (!address || !abi) throw new Error("Contract address or ABI missing");
    return new ethers.Contract(address, abi, signer);
};
