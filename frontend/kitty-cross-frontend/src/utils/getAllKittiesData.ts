import { ethers } from "ethers";
import { contractABI, contractAddresses, getNetworkNameForChainId, getRpcForChainId } from "./constants";

export async function getAllKittiesData(chainId, kittyIds) {
  console.log("chainId:", chainId);
  console.log("kittyIds:", kittyIds);
    try {
      const rpcUrl = getRpcForChainId(chainId);
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const contractAddress = contractAddresses[getNetworkNameForChainId(chainId)];
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
  
      // Create a promise for each kittyId
      const kittyDataPromises = kittyIds.map(kittyId => {
        return contract.getKitty(kittyId);
      });
  
      // Wait for all promises to resolve
      const kittiesData = await Promise.all(kittyDataPromises);
      console.log("kittiesData:", kittiesData);
      return kittiesData;
    //   setKittiesData(kittiesData);
    } catch (err) {
      console.error("Error fetching kitties data:", err);
    } 
  }