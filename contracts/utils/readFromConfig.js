const path = '../contractData.json'
const { constants } = require('fs')
const fs = require('fs').promises

async function checkFileExists (file) {
  return fs.access(file, constants.F_OK)
    .then(() => true)
    .catch(() => false)
}

async function readFromConfig (contractName, fieldType) {
  try {
    if (!await checkFileExists(path)) {
      await fs.writeFile(path, JSON.stringify({}, null, 4))
    }
    const contractConfig = JSON.parse(await fs.readFile(path))
    return contractConfig[contractName + '_' + fieldType]
  } catch (err) {
    console.log(err)
    console.log(`Couldn't Read ${fieldType} for contract ${contractName} from config`)
    throw err
  }
}

module.exports = readFromConfig
