import { useState, useEffect } from 'react';
import { useGetKitty } from './useGetKitty';

export function useGetAllKittiesData(chainId, kitties) {
    const [allKittiesData, setAllKittiesData] = useState([]);

    useEffect(() => {
        async function fetchKittyData() {
            const dataPromises = kitties.map(kittyId => {
                // Assuming useGetKitty is an async function
                return useGetKitty(chainId, kittyId);
            });

            try {
                const results = await Promise.all(dataPromises);
                setAllKittiesData(results);
            } catch (error) {
                console.error('Error fetching kitty data:', error);
                // Handle error as needed
            }
        }

        if (kitties && kitties.length > 0) {
            fetchKittyData();
        }
    }, [chainId, kitties]); // Dependencies for useEffect

    return allKittiesData;
}
