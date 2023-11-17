import { useEffect, useState } from "react";
import { KittesPerChain, contractABI, contractAddresses } from "./constants";
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
        polygonZkEVM: [],
        scroll: [],
        arbitrum: [],
        base: [],
      };

      for (const chain in contractAddresses) {
        if (contractAddresses.hasOwnProperty(chain)) {
          const address = contractAddresses[chain];
          const { data, isError, isLoading } = await useContractRead({
            address,
            abi: contractABI,
            functionName: "kittyIndexToOwner",
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
