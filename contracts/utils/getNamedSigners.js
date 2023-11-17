const { getNamedAccounts } = require('hardhat');

const getNamedSigners = async () => {
  const accounts = await getNamedAccounts();
  for (let i = 0; i < Object.keys(accounts).length; i++) {
    const key = Object.keys(accounts)[i];
    accounts[key] = await ethers.getSigner(accounts[key]);
  }
  return accounts;
};

module.exports = getNamedSigners;
