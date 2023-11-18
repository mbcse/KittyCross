import { useContractRead } from "wagmi";
import { contractABI, contractAddresses, supportedChains } from "./constants";
import { GetKittyDetails } from "./types";
import { ethers } from "ethers";

export function useGetKitty(chainId, kittyId) {
  const getNetworkNameForChainId = (chainId) => {
    const chain = supportedChains.find((c) => c.id === chainId);
    return chain ? chain.network : undefined;
  };

  console.log(getNetworkNameForChainId(chainId));

  const loadKitty = async (chainId, kittyId) => {
  const rpcUrl = supportedChains.find(chain => chain.id === chainId).rpcUrls.default.http[0];
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contractAddress = contractAddresses[getNetworkNameForChainId(chainId)];
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const data = await contract.getKitty(kittyId);
  return data;
  }
  const data = loadKitty;


  // const { data , isError, isLoading } = useContractRead({
  //   address: contractAddresses[getNetworkNameForChainId(chainId)],
  //   abi: contractABI,
  //   functionName: "getKitty",
  //   args: [kittyId], // Assuming the smart contract function takes kittyId as an argument
  //   chainId: chainId,
  // });
  // console.log(data);

  // const kittyDetails = {
  //   data
  // };

  // Handle errors
  // const error = isError ? "Error fetching kitty data" : null;

  return { data, isLoading, error };
}
