const privateKeys = require('./privateKeys.json');

module.exports = {
  NETWORKS: {
    ETHEREUM: {
      RPC_URL: process.env.ETHEREUM_RPC_URL,
      CHAIN_ID: 1,
    },
    KOVAN: {
      RPC_URL: process.env.KOVAN_RPC_URL,
      CHAIN_ID: 42,
    },
    RINKEBY: {
      RPC_URL: process.env.RINKEBY_RPC_URL,
      CHAIN_ID: 4,
    },
    ROPSTEN: {
      RPC_URL: process.env.ROPSTEN_RPC_URL,
      CHAIN_ID: 3,
    },
    GOERLI: {
      RPC_URL: process.env.GOERLI_RPC_URL,
      CHAIN_ID: 5,
    },
    BINANCE_CHAIN: {
      RPC_URL: process.env.BINANCE_CHAIN_MAINNET_RPC_URL,
      CHAIN_ID: 56,
    },
    BINANCE_CHAIN_TESTNET: {
      RPC_URL: process.env.BINANCE_CHAIN_TESTNET_RPC_URL,
      CHAIN_ID: 97,
    },
    POLYGON_MAINNET: {
      RPC_URL: process.env.POLYGON_MAINNET_RPC_URL,
      CHAIN_ID: 137,
    },
    POLYGON_TESTNET: {
      RPC_URL: process.env.POLYGON_TESTNET_RPC_URL,
      CHAIN_ID: 80001,
    },
    CUSTOM: {
      RPC_URL: process.env.CUSTOM_RPC_URL,
      CHAIN_ID: process.env.CUSTOM_CHAIN_ID,
    },
    BTTC_TESTNET: {
      RPC_URL: 'https://api.shasta.trongrid.io/jsonrpc',
      CHAIN_ID: 1028,
    },
    XDC_TESTNET: {
      RPC_URL: 'https://rpc.apothem.network',
      CHAIN_ID: 51,
    },
    GNOSIS_MAINNET: {
      RPC_URL: 'https://rpc.gnosischain.com/',
      CHAIN_ID: 64,
    },
    CRONOS_TESTNET: {
      RPC_URL: 'https://evm-t3.cronos.org',
      CHAIN_ID: 338,
    },
    SEPOLIA: {
      RPC_URL: process.env.SEPOLIA_RPC_URL,
      CHAIN_ID: 11155111,
    },

    MCH_VERSE: {
      RPC_URL: 'https://rpc.oasys.mycryptoheroes.net/',
      CHAIN_ID: 29548,
    },

    OPTIMISM_GOERLI: {
      RPC_URL: process.env.OPTIMISM_GOERLI_RPC_URL,
      CHAIN_ID: 420,
    },

    CALDERA_POLYGON: {
      RPC_URL: process.env.CALDERA_POLYGON_RPC_URL,
      CHAIN_ID: 10009,
    },
    CALDERA_GOERLI: {
      RPC_URL: process.env.CALDERA_GOERLI_RPC_URL,
      CHAIN_ID: 9981,
    },
    CONDUIT: {
      RPC_URL: process.env.CONDUIT_RPC_URL,
      CHAIN_ID: 222,
    },
    CELO_TESTNET: {
      RPC_URL: process.env.CELO_TESTNET_RPC_URL,
      CHAIN_ID: 44787,
    },
    CELO_MAINNET: {
      RPC_URL: process.env.CELO_MAINNET_RPC_URL,
      CHAIN_ID: 42220,
    },
    LINEA_GOERLI: {
      RPC_URL: process.env.LINEA_GOERLI_RPC_URL,
      CHAIN_ID: 59140,
    },
    LINEA_MAINNET: {
      RPC_URL: process.env.LINEA_MAINNET_RPC_URL,
      CHAIN_ID: 59144,
    },
    BASE_GOERLI: {
      RPC_URL: process.env.BASE_GOERLI_RPC_URL,
      CHAIN_ID: 84531,
    },
    OP_BNB_TESTNET: {
      RPC_URL: process.env.OP_BNB_TESTNET_RPC_URL,
      CHAIN_ID: 5611,
    }
  },

  PRIVATE_KEYS: privateKeys,

  REPORT_GAS: process.env.REPORT_GAS || true,

  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  POLYGONSCAN_API_KEY: process.env.POLYGONSCAN_API_KEY,
  OPTIMISM_API_KEY: process.env.OPTIMISM_API_KEY,
  CELOSCAN_API_KEY: process.env.CELOSCAN_API_KEY,
  LINEASCAN_API_KEY: process.env.LINEASCAN_API_KEY,
  BASESCAN_API_KEY: process.env.BASESCAN_API_KEY
};
