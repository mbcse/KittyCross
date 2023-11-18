import { useContractWrite, usePrepareContractWrite } from "wagmi";
import {
  contractABI,
  contractAddresses,
  getNetworkNameForChainId,
} from "./constants";

export async function useApproveSiring(
  originChainId,
  originKittyId,
  desintationChainId,
  destinationAddress
) {
  const { config } = usePrepareContractWrite({
    address: contractAddresses[getNetworkNameForChainId(originChainId)],
    // TODO: adapt ABI
    abi: contractABI,
    // TODO: will be called crosschain something xD
    functionName: "approveSiring",
    // TODO: adapt args
    args: [destinationAddress, originKittyId, desintationChainId],
    // TODO: to what chains is the TX sent?
    chainId: originChainId,
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  // Check if the request was successful
  if (!isSuccess) {
    throw new Error(`Error approving siring`);
  }

  return data;
}
