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
<<<<<<< HEAD
=======
    // TODO: adapt abi
>>>>>>> 98b5b75b7504bd5df580faa8629427d69529ca22
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
