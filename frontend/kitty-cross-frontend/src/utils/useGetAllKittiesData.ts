import { useState, useEffect } from 'react';
import { useContractRead } from "wagmi";
import { contractABI, contractAddresses, supportedChains } from "./constants";
import { GetKittyDetails } from "./types";

export function useGetAllKittiesData(chainId, kitties) {
    const [allKittiesData, setAllKittiesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        async function fetchKittyData(kittyId) {
            const getNetworkNameForChainId = (chainId) => {
                const chain = supportedChains.find((c) => c.id === chainId);
                return chain ? chain.network : undefined;
            };

            const { data, error } = useContractRead({
                address: contractAddresses[getNetworkNameForChainId(chainId)],
                abi: contractABI,
                functionName: "getKitty",
                args: [kittyId],
                chainId: chainId,
            });

            if (error) {
                setIsError(true);
                return null;
            }

            return data;
        }

        setIsLoading(true);
        Promise.all(kitties.map(kittyId => fetchKittyData(kittyId)))
            .then(results => {
                setAllKittiesData(results.filter(result => result !== null));
                setIsLoading(false);
            })
            .catch(() => {
                setIsError(true);
                setIsLoading(false);
            });
    }, [chainId, kitties]);

    return { allKittiesData, isLoading, isError };
}
