import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractABI, contractAddresses, getNetworkNameForChainId } from "./constants";
import { ethers } from "ethers";

export async function giveBirth(
  chainIdOrigin,
  matronId
) {
  const ethereum = (window as any).ethereum;
  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  const provider = new ethers.providers.Web3Provider(ethereum)
  const walletAddress = accounts[0]    // first account in MetaMask
  const signer = provider.getSigner(walletAddress)

  const contractAddress = contractAddresses[getNetworkNameForChainId(chainIdOrigin)]
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  const tx = await contract.giveBirth(matronId);
  console.log(tx);
  return tx;
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
