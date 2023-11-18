import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractABI } from "./constants";

async function writeApproveSiring(
  chainIdOrigin,
  chainIdDestination,
  sireId,
  matronId
) {
  const { config } = usePrepareContractWrite({
    // TODO: adapt addr
    address: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
    // TODO: adapt abi
    abi: contractABI,
    // TODO: will be called crosschain something xD
    functionName: "breedWithAutoCrossChain",
    // TODO: adapt args
    args: [matronId, chainIdDestination, sireId, chainIdOrigin],
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
