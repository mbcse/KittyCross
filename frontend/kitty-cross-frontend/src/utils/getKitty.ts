import { useContractRead } from "wagmi";
import {
  contractABI,
  contractAddresses,
  getNetworkNameForChainId,
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
    const rpcUrl = supportedChains[0].rpcUrls.default.http[0];
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