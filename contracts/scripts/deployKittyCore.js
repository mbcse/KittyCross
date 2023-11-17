const { artifacts, ethers, upgrades } = require('hardhat')
const getNamedSigners = require('../utils/getNamedSigners')
const saveToConfig = require('../utils/saveToConfig')
const readFromConfig = require('../utils/readFromConfig')
const deploySettings = require('./deploySettings')

async function main () {

  const chainId = await hre.getChainId()
  console.log("STARTING DEPLOYMENT OF KITTY CORE ON ", chainId)
  const CHAIN_NAME = deploySettings[chainId].CHAIN_NAME

  const {payDeployer} =  await getNamedSigners();
  const KittyCoreContract = await ethers.getContractFactory('KittyCore')
  KittyCoreContract.connect(payDeployer)


  const ABI = (await artifacts.readArtifact('KittyCore')).abi
  await saveToConfig(`KITTYCORE_${CHAIN_NAME}`, 'ABI', ABI)

  const kittyCoreDeployer = await KittyCoreContract.deploy()
  await kittyCoreDeployer.deployed()

  await saveToConfig(`KITTYCORE_${CHAIN_NAME}`, 'ADDRESS', kittyCoreDeployer.address)
  console.log('Kitty Core contract deployed to:', kittyCoreDeployer.address, ` on ${CHAIN_NAME}`)

  await new Promise((resolve) => setTimeout(resolve, 40 * 1000));
  console.log('Verifying Contract...')

  try {
    await run('verify:verify', {
      address: kittyCoreDeployer.address || "",
      contract: 'contracts/KittyCore.sol:KittyCore', // Filename.sol:ClassName
      constructorArguments: [
      ],
      network: deploySettings[chainId].NETWORK_NAME
    })
  } catch (error) {
    console.log(error)
  }

}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
