import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractABI, contractAddresses, getNetworkNameForChainId } from "./constants";
import { ethers } from "ethers";

export async function useBreedWithAutoCrossChain(
    matronChainId,
    sireChainId,
    sireId,
    matronId,
    setTxHash,
  ) {
    console.log("HIHIHIHIH");
    console.log(matronChainId);
    console.log(sireChainId);
    console.log(sireId);
    console.log(matronId);
    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
  
    const provider = new ethers.providers.Web3Provider(ethereum)
    const walletAddress = accounts[0]    // first account in MetaMask
    const signer = provider.getSigner(walletAddress)
  
    const contractAddress = contractAddresses[getNetworkNameForChainId(matronChainId)]
    console.log(contractAddress);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
    const tx = await contract.breedWithAutoCrossChain(matronId, matronChainId, sireId, sireChainId);
    setTxHash(tx.hash);
    console.log(tx);
    return tx;    

  }
