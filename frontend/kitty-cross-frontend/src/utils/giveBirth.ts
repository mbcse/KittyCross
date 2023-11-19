import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractABI, contractAddresses, getNetworkNameForChainId } from "./constants";
import { ethers } from "ethers";

export async function giveBirth(
  chainIdOrigin,
  matronId
) {
<<<<<<< HEAD
  const { config } = usePrepareContractWrite({
    address: contractAddresses[getNetworkNameForChainId(chainIdOrigin)],
    abi: contractABI,
    functionName: "giveBirth",
    args: [matronId],
    chainId: chainIdOrigin,
=======
  const ethereum = (window as any).ethereum;
  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
>>>>>>> 0220b1fc047346f3ec88cbf3795c06f9c89eb630
  });

  const provider = new ethers.providers.Web3Provider(ethereum)
  const walletAddress = accounts[0]    // first account in MetaMask
  const signer = provider.getSigner(walletAddress)

  const contractAddress = contractAddresses[getNetworkNameForChainId(chainIdOrigin)]
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  const tx = await contract.giveBirth(matronId);
  console.log(tx);
  tx.wait();
  return tx;
}
