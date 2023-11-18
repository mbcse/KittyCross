import { useContractRead } from "wagmi";
import {
  contractABI,
  contractAddresses,
  getNetworkNameForChainId,
  getRpcForChainId,
  supportedChains,
} from "./constants";
import { GetKittyDetails } from "./types";
import { ethers } from "ethers";

export async function getKitty(
  chainId,
  kittyId,
  setIsLoading,
  setKittyData,
  setError
) {
  try {
    setIsLoading(true);
    const rpcUrl = getRpcForChainId(chainId);
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contractAddress =
      contractAddresses[getNetworkNameForChainId(chainId)];
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    const kittyData = await contract.getKitty(kittyId);
    setKittyData(kittyData);
  } catch (err) {
    console.error("Error fetching kitty data:", err);
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}

export async function getSingleKitty(
  chainId,
  kittyId,
) {
  try {
    const rpcUrl = getRpcForChainId(chainId);
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contractAddress =
      contractAddresses[getNetworkNameForChainId(chainId)];
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    const kittyData = await contract.getKitty(kittyId);
    return kittyData;
  } catch (err) {
    console.error("Error fetching kitty data:", err);
  } 
}
