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
  const CrossGeneScienceContract = await ethers.getContractFactory('CrossGeneScience')
  CrossGeneScienceContract.connect(payDeployer)


  const ABI = (await artifacts.readArtifact('CrossGeneScience')).abi
  await saveToConfig(`CROSSGENESCIENCE_${CHAIN_NAME}`, 'ABI', ABI)

  const kittyCoreContractAddress = await readFromConfig(`KITTYCORE_${CHAIN_NAME}`, 'ADDRESS')

  const crossGeneScienceDeployer = await CrossGeneScienceContract.deploy("0x0000000000000000000000000000000000000000", kittyCoreContractAddress)
  await crossGeneScienceDeployer.deployed()

  await saveToConfig(`CROSSGENESCIENCE_${CHAIN_NAME}`, 'ADDRESS', crossGeneScienceDeployer.address)
  console.log('Cross Gene Science contract deployed to:', crossGeneScienceDeployer.address, ` on ${CHAIN_NAME}`)


    const KittyCoreContract = await ethers.getContractFactory('KittyCore')
    const kittyCoreContract = KittyCoreContract.attach(kittyCoreContractAddress)
    kittyCoreContract.connect(payDeployer)

    const tx = await kittyCoreContract.setGeneScienceAddress(crossGeneScienceDeployer.address);
    await tx.wait()
    console.log("Tx Hash: "+ tx.hash)


  await new Promise((resolve) => setTimeout(resolve, 40 * 1000));
  console.log('Verifying Contract...')

  try {
    await run('verify:verify', {
      address: crossGeneScienceDeployer.address || "",
      contract: 'contracts/CrossGeneScience.sol:CrossGeneScience', // Filename.sol:ClassName
      constructorArguments: [
        "0x0000000000000000000000000000000000000000", kittyCoreContractAddress
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
