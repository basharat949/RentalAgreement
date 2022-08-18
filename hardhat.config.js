require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
const { API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;
module.exports = {
        solidity: "0.8.0",
        defaultNetwork: "hardhat",
        networks: {
            hardhat: {},
            rinkeby: {
               url: API_URL,
               accounts: [process.env.PRIVATE_KEY],
               gasPrice: 100000000000,
             },
             bsctestnet: {
               url: "https://data-seed-prebsc-1-s1.binance.org:8545",
               chainId: 97,
               accounts: [process.env.PRIVATE_KEY],
               gasPrice: 100000000000,
             }
        },
        etherscan: {
            apiKey: ETHERSCAN_API_KEY,
          //  apiKey: BSC_SMART_CHAIN,
        }
};