import { useEffect, useState } from "react";
import { KittesPerChain, contractABI, contractAddresses, supportedChains } from "./constants";
import { Address, useContractRead } from "wagmi";

async function useAllTokensOfOwner(ownerAddress) {
  const [kittiesPerChain, setKittiesPerChain] = useState<KittesPerChain>({
    polygonZkEVM: [],
    scroll: [],
    arbitrum: [],
    base: [],
  });

  useEffect(() => {
    const fetchKitties = async () => {
      const result = {
        "polygon-zkevm": [],
        "scroll": [],
        "arbitrum": [],
        "base": [],
      };

      for (const chain in contractAddresses) {
        if (contractAddresses.hasOwnProperty(chain)) {
          const address = contractAddresses[chain];
          const { data, isError, isLoading } = useContractRead({
            address,
            abi: contractABI,
            functionName: "kittyIndexToOwner",
            chainId: supportedChains.find((c) => c.network === chain).id,
          });

          const kittesToAddressMapping: { kittyId: number; owner: Address }[] =
            data;

          if (!isError && kittesToAddressMapping) {
            result[chain] = kittesToAddressMapping
              .filter((kitty) => kitty.owner === ownerAddress)
              .map((kitty) => kitty.kittyId);
          }
        }
      }
      setKittiesPerChain(result);
    };

    fetchKitties();
  }, [ownerAddress]);

  return kittiesPerChain;

}
