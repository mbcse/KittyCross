import { useEffect, useState } from 'react';
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { contractABI, contractAddresses, getNetworkNameForChainId } from "./constants";
import { ethers } from 'ethers';

export async function useApproveSiring(originChainId,originKittyId,destinationChainId,destinationAddress, setTxHash) {

  const ethereum = (window as any).ethereum;
  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  const provider = new ethers.providers.Web3Provider(ethereum)
  const walletAddress = accounts[0]    // first account in MetaMask
  const signer = provider.getSigner(walletAddress)

  const contractAddress = contractAddresses[getNetworkNameForChainId(originChainId)]
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  const tx = await contract.approveSiring(destinationAddress, originKittyId, destinationChainId);
  setTxHash(tx.hash);
  console.log(tx);
  return tx;
}
