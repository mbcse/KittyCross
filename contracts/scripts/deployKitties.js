const { artifacts, ethers, upgrades } = require('hardhat')
const getNamedSigners = require('../utils/getNamedSigners')
const saveToConfig = require('../utils/saveToConfig')
const readFromConfig = require('../utils/readFromConfig')
const deploySettings = require('./deploySettings')

async function main () {

  const chainId = await hre.getChainId()
  console.log("STARTING DEPLOYMENT ON ", chainId)

  const CHAIN_NAME = deploySettings[chainId].CHAIN_NAME
 

}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
