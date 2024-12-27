export default {
    api: {
        infura: {
            url: import.meta.env.VITE_INFURA_RPC_URL
        }
    },
    contracts: {
        gridManager: {
            address: import.meta.env.VITE_CONTRACT_GRID_MANAGER_ADDRESS
        },
        trading: {
            address: import.meta.env.VITE_CONTRACT_TRADING_ADDRESS
        },
        energyStorage: {
            address: import.meta.env.VITE_CONTRACT_ENERGY_STORAGE_ADDRESS
        }
    }
}