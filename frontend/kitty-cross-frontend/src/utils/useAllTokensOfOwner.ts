import { useEffect, useState } from "react";
import {
  KittesPerChain,
  contractABI,
  contractAddresses,
  getChainIdForNetworkName,
  getNetworkNameForChainId,
  getRpcForChainId,
  supportedChains,
} from "./constants";
import { Address, useContractRead } from "wagmi";
import { ethers } from "ethers";

export function useAllTokensOfOwner(ownerAddress: Address) {
  const [kittiesPerChain, setKittiesPerChain] = useState<KittesPerChain>({
    "polygon-zkevm-testnet": [],
    "scroll-sepolia": [],
    "arbitrum-goerli": [],
    "base-goerli": [],
  });

  useEffect(() => {
    const fetchKitties = async () => {
      const result = {
        "polygon-zkevm": [],
        scroll: [],
        arbitrum: [],
        base: [],
      };

      for (const chain in contractAddresses) {
        // const chain = "homestead";
        if (contractAddresses.hasOwnProperty(chain)) {
          const fetchTokensOfOwner = async () => {
            try {
              const rpcUrl = getRpcForChainId(getChainIdForNetworkName(chain));
              const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
              const contractAddress = contractAddresses[chain];
              const contract = new ethers.Contract(
                contractAddress,
                contractABI,
                provider
              );
              const tokensOfOwner = await contract.tokensOfOwner(ownerAddress);
              return tokensOfOwner;
            } catch (err) {
              console.error("Error fetching kitty data:", err);
            }
          };
          const data = await fetchTokensOfOwner();
          let newState = {...kittiesPerChain}
          newState[chain] = data;
          setKittiesPerChain(newState);
        }
      }
    };

    fetchKitties();
  }, [ownerAddress]);

  return kittiesPerChain;
}
