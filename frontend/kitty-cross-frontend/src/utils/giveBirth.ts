import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractABI, contractAddresses, getNetworkNameForChainId } from "./constants";

async function giveBirth(
  chainIdOrigin,
  chainIdDestination,
  sireId,
  matronId
) {
  const { config } = usePrepareContractWrite({
    address: contractAddresses[getNetworkNameForChainId(chainIdOrigin)],
    // TODO: adapt abi
    abi: contractABI,
    functionName: "giveBirth",
    args: [matronId],
    chainId: chainIdOrigin,
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  // Check if the request was successful
  if (!isSuccess) {
    throw new Error(`Error approving siring`);
  }

  return data;
}
