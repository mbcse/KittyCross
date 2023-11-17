import { useContractRead } from "wagmi";
import { contractABI, contractAddresses, supportedChains } from "./constants";
import { GetKittyDetails } from "./types";

function useGetKitty(chainId, kittyId) {
  const getNetworkNameForChainId = (chainId) => {
    const chain = supportedChains.find((c) => c.id === chainId);
    return chain ? chain.network : undefined;
  };

  const { data , isError, isLoading } = useContractRead({
    address: contractAddresses[getNetworkNameForChainId(chainId)],
    abi: contractABI,
    functionName: "getKitty",
    args: [kittyId], // Assuming the smart contract function takes kittyId as an argument
    chainId: chainId,
  });

  const kittyDetails: GetKittyDetails[] = data;

  // Handle errors
  const error = isError ? "Error fetching kitty data" : null;

  return { kittyDetails, isLoading, error };
}
