import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractABI, contractAddresses, getNetworkNameForChainId } from "./constants";

async function giveBirth(
  chainIdOrigin,
  chainIdDestination,
  sireId,
  matronId
) {
  const { config } = usePrepareContractWrite({
    address: contractAddresses[getNetworkNameForChainId(chainIdOrigin)]
    // TODO: adapt abi
    abi: contractABI,
    // TODO: will be called give Birth something
    functionName: "giveBirth",
    // TODO: adapt args
    args: [matronId],
    chainId: chainIdOrigin,
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  // Check if the request was successful
  if (!isSuccess) {
    throw new Error(`Error approving siring`);
  }

  return data;
  if (!isSuccess) {
    throw new Error(`error approving siring`);
  }
  return data;
}
