const { artifacts, ethers, upgrades } = require('hardhat')
const getNamedSigners = require('../utils/getNamedSigners')
const saveToConfig = require('../utils/saveToConfig')
const readFromConfig = require('../utils/readFromConfig')
const deploySettings = require('./deploySettings')

async function main () {

    const crosskittyCoreAddress = await readFromConfig(`CHAINID`, 'ADDRESSES')
 
  const chainId = await hre.getChainId()

  const CHAIN_NAME = deploySettings[chainId].CHAIN_NAME

  console.log("STARTING CONTRACT ADDRESS SETTER on  ", CHAIN_NAME)


  console.log(`Executing Adding of addreses on chainId ${chainId}`)
  const {payDeployer} =  await getNamedSigners();

  const kittyCoreAddress = await readFromConfig(`KITTYCORE_${CHAIN_NAME}`, 'ADDRESS')

  const KittyCoreContract = await ethers.getContractFactory('KittyCore')
  const kittyCoreContract = KittyCoreContract.attach(kittyCoreAddress)
  kittyCoreContract.connect(payDeployer)

  for(let i=0; i< crosskittyCoreAddress.length; i++){
    console.log(`Adding Address ${JSON.stringify(crosskittyCoreAddress[i])}`)
    const tx = await kittyCoreContract.setAddress(crosskittyCoreAddress[i].chainId, crosskittyCoreAddress[i].kittyCoreAddress);
    await tx.wait()
    console.log("Tx Hash: "+ tx.hash)
  }

  console.log('ALL ADDRESSES ADDED')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
