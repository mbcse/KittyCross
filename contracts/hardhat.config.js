require('dotenv').config();

require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-web3');
require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades');

require('hardhat-gas-reporter');
require('solidity-coverage');
require('hardhat-contract-sizer');

require('hardhat-interface-generator');
require('hardhat-deploy');
const ethers = require('ethers');

require('./tasks');
const config = require('./config');

/**
 *
 */
function getPrivateKeys() {
  const privateKeys = config.PRIVATE_KEYS;
  // if(Object.keys(privateKeys).length === 0){
  //   throw new Error("Please provide private keys in privateKeys.json file for setup")
  // }
  const privateKeysArray = [];

  for (const [, value] of Object.entries(privateKeys)) {
    privateKeysArray.push(value);
  }
  return privateKeysArray;
}

/**
 *
 */
function getNamedAccounts() {
  const privateKeys = config.PRIVATE_KEYS;
  // if(Object.keys(privateKeys).length === 0){
  //   throw new Error("Please provide private keys in privateKeys.json file for setup")
  // }
  const privateKeysObject = {};

  for (const [name, value] of Object.entries(privateKeys)) {
    privateKeysObject[name] = { default: new ethers.Wallet(value).address };
  }
  return privateKeysObject;
}

console.log(config.CELOSCAN_API_KEY);

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },

      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
    ],
  },
  networks: {
    local_ganache: {
      url: 'http://127.0.0.1:8545',
      accounts: getPrivateKeys(),
    },

    ethereum: {
      url: config.NETWORKS.ETHEREUM.RPC_URL || '',
      accounts: getPrivateKeys(),
    },

    rinkeyby: {
      url: config.NETWORKS.RINKEBY.RPC_URL || '',
      accounts: getPrivateKeys(),
    },

    ropsten: {
      url: config.NETWORKS.ROPSTEN.RPC_URL || '',
      accounts: getPrivateKeys(),
    },

    goerli: {
      url: config.NETWORKS.GOERLI.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 0,
    },

    kovan: {
      url: config.NETWORKS.KOVAN.RPC_URL || '',
      accounts: getPrivateKeys(),
    },

    binance_mainnet: {
      url: config.NETWORKS.BINANCE_CHAIN.RPC_URL || '',
      accounts: getPrivateKeys(),
    },

    binance_testnet: {
      url: config.NETWORKS.BINANCE_CHAIN_TESTNET.RPC_URL || '',
      accounts: getPrivateKeys(),
    },

    opBnbTestnet: {
      url: config.NETWORKS.OP_BNB_TESTNET.RPC_URL || '',
      accounts: getPrivateKeys(),
      gasPrice: 12485362,

    },

    polygon_mainnet: {
      url: config.NETWORKS.POLYGON_MAINNET.RPC_URL || '',
      accounts: getPrivateKeys(),
      gasPrice: 200000000000,
      timeout: 0,
    },

    polygon_testnet: {
      url: config.NETWORKS.POLYGON_TESTNET.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 0,
    },
    bttc_testnet: {
      url: config.NETWORKS.BTTC_TESTNET.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 50000,
    },
    xdc_testnet: {
      url: config.NETWORKS.XDC_TESTNET.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 50000,
    },
    cronos_testnet: {
      url: config.NETWORKS.CRONOS_TESTNET.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 50000,
    },

    gnosis_mainnet: {
      url: config.NETWORKS.GNOSIS_MAINNET.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 500000,
    },

    sepolia: {
      url: config.NETWORKS.SEPOLIA.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 0,
    },

    mch_verse: {
      url: config.NETWORKS.MCH_VERSE.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 0,
    },

    optimism_goerli: {
      url: config.NETWORKS.OPTIMISM_GOERLI.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 0,
    },

    celo_testnet: {
      url: config.NETWORKS.CELO_TESTNET.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 0,
    },

    celo_mainnet: {
      url: config.NETWORKS.CELO_MAINNET.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 0,
    },

    linea_goerli: {
      url: config.NETWORKS.LINEA_GOERLI.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 0,
    },
    linea_mainnet: {
      url: config.NETWORKS.LINEA_MAINNET.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 0,
    },

    base_goerli: {
      url: config.NETWORKS.BASE_GOERLI.RPC_URL || '',
      accounts: getPrivateKeys(),
      timeout: 0,
      gasPrice: 2000000000
    },

    custom: {
      url: config.NETWORKS.CUSTOM.RPC_URL || '',
      accounts: getPrivateKeys(),
    },
  },
  gasReporter: {
    enabled: config.REPORT_GAS,
    currency: 'USD',
  },

  etherscan: {
    apiKey: {
      polygonMumbai: config.POLYGONSCAN_API_KEY,
      sepolia: config.ETHERSCAN_API_KEY,
      goerli: config.ETHERSCAN_API_KEY,
      polygon: config.POLYGONSCAN_API_KEY,
      optimistic_goerli: config.OPTIMISM_API_KEY,
      celo_testnet: config.CELOSCAN_API_KEY,
      celo_mainnet: config.CELOSCAN_API_KEY,
      linea_goerli: config.LINEASCAN_API_KEY,
      linea_mainnet: config.LINEASCAN_API_KEY,
      base_goerli: config.BASESCAN_API_KEY
    },
    customChains: [
      {
        network: 'optimistic_goerli',
        chainId: 420,
        urls: {
          apiURL: 'https://api-goerli-optimistic.etherscan.io/api',
          browserURL: 'https://goerli-optimism.etherscan.io',
        },
      },
      {
        network: 'celo_testnet',
        chainId: 44787,
        urls: {
          apiURL: 'https://api-alfajores.celoscan.com/api',
          browserURL: 'https://alfajores.celoscan.io/',
        },
      },
      {
        network: 'celo_mainnet',
        chainId: 42220,
        urls: {
          apiURL: 'https://api.celoscan.com/api',
          browserURL: 'https://celoscan.com',
        },
      },
      {
        network: 'linea_goerli',
        chainId: 59140,
        urls: {
          apiURL: 'https://api-testnet.lineascan.build/api',
          browserURL: 'https://goerli.lineascan.build/',
        },
      },
      {
        network: 'linea_mainnet',
        chainId: 59144,
        urls: {
          apiURL: 'https://api.lineascan.build/api',
          browserURL: 'https://lineascan.build/',
        },
      },
      {
        network: 'base_goerli',
        chainId: 84531,
        urls: {
          apiURL: 'https://api-goerli.basescan.org/api',
          browserURL: 'https://goerli.basescan.org/',
        },
      },
      
    ],
  },

  namedAccounts: getNamedAccounts(),

  mocha: {
    timeout: 500000,
  },
};
