const { artifacts, ethers, upgrades } = require('hardhat')
const getNamedSigners = require('../utils/getNamedSigners')
const saveToConfig = require('../utils/saveToConfig')
const readFromConfig = require('../utils/readFromConfig')
const deploySettings = require('./deploySettings')

async function main () {

  const chainId = await hre.getChainId()
  console.log("STARTING DEPLOYMENT OF KITTY CORE ON ", chainId)
  const CHAIN_NAME = deploySettings[chainId].CHAIN_NAME
  const CHAIN_SETTER_DATA = deploySettings.COMMON.CHAIN_SETTER_DATA
  const HYPERLANE_MAILBOX_ADDRESS = deploySettings[chainId].HYPERLANE_MAILBOX_ADDRESS

  const {payDeployer} =  await getNamedSigners();
  const KittyCoreContract = await ethers.getContractFactory('KittyCore')
  KittyCoreContract.connect(payDeployer)


  const ABI = (await artifacts.readArtifact('KittyCore')).abi
  await saveToConfig(`KITTYCORE_${CHAIN_NAME}`, 'ABI', ABI)

  const kittyCoreDeployer = await KittyCoreContract.deploy(HYPERLANE_MAILBOX_ADDRESS)
  await kittyCoreDeployer.deployed()

  await saveToConfig(`KITTYCORE_${CHAIN_NAME}`, 'ADDRESS', kittyCoreDeployer.address)
  console.log('Kitty Core contract deployed to:', kittyCoreDeployer.address, ` on ${CHAIN_NAME}`)

  let CHAINID_ADDRESSES = await readFromConfig(`CHAINID`, 'ADDRESSES')
    if(!CHAINID_ADDRESSES){
      CHAINID_ADDRESSES = []
    }
    CHAINID_ADDRESSES.push({chainId: chainId, kittyCoreAddress: kittyCoreDeployer.address})
    await saveToConfig(`CHAINID`, 'ADDRESSES', CHAINID_ADDRESSES)


  console.log('Setting Chain Setter Data...')
  const tx = await kittyCoreDeployer.addChainIdsAndDomain(CHAIN_SETTER_DATA[0], CHAIN_SETTER_DATA[1]);
  await tx.wait()
  console.log("Tx Hash: "+ tx.hash)

  await new Promise((resolve) => setTimeout(resolve, 40 * 1000));
  console.log('Verifying Contract...')

  try {
    await run('verify:verify', {
      address:   kittyCoreDeployer.address || "0x0344dbaf786945198ad6abf0b5e73060751d0eb3",
      contract: 'contracts/KittyCore.sol:KittyCore', // Filename.sol:ClassName
      constructorArguments: [
        HYPERLANE_MAILBOX_ADDRESS
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
