export default {
    api: {
        infura: {
            url: import.meta.env.VITE_INFURA_RPC_URL
        }
    },
    contracts: {
        gridManager: {
            address: "0xE3Ea3B0926bb8D47379993867B2E673779464F2a"
        },
        trading: {
            address: "0xe7C2EcF0c416836A43Ca40771168EfdA2F292559"
        },
        energyStorage: {
            address: "0x288f2Ca93B04E14086E0DDe9f5E6e03E6e0776b7"
        }
    }
}