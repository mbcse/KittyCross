import { useContractRead } from "wagmi";
import { contractABI, supportedChains } from "../utils/constants";
import { readContract } from "@wagmi/core";
const ethers = require('ethers');


export default function testHooks() {

  const fetchTokensOfOwner = async () => {
  const provider = new ethers.JsonRpcProvider("https://eth-pokt.nodies.app");
  const contractAddress = "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d";
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  const tokens = await contract.tokensOfOwner("0x61a4575D63C63F9F05447395760dba3Ed602c48c");
    return tokens;
  }

  const data = fetchTokensOfOwner();
  console.log(data);

  return (
    <>
      <p>hi</p>
    </>
  );
}
