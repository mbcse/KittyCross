import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractABI, contractAddresses, getNetworkNameForChainId } from "./constants";

export async function useBreedWithAutoCrossChain(
    matronChainId,
    sireChainId,
    sireId,
    matronId,
  ) {
    const { config } = usePrepareContractWrite({
      address: contractAddresses[getNetworkNameForChainId(matronChainId)],
      // TODO: adapt ABI
      abi: contractABI,
      // TODO: will be called crosschain something xD
      functionName: "breedWithAutoCrossChain",
      // TODO: adapt args
      args: [matronId, matronChainId, sireId ,sireChainId],
      // TODO: to what chains is the TX sent?
      chainId: matronChainId,
    });
    const { data, isLoading, isSuccess, write } = useContractWrite(config);
  
    // Check if the request was successful
    if (!isSuccess) {
      throw new Error(`Error approving siring`);
    }
  
    return data;
  }
