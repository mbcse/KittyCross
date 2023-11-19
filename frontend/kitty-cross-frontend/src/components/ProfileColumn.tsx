import { Flex, GridItem, Image, Text } from "@chakra-ui/react";
import { getKitty } from "../utils/getKitty";
import { getChainIdForNetworkName } from "../utils/constants";
import { useGetAllKittiesData } from "../utils/useGetAllKittiesData";
import KittyCard from "./Profile/KittyCard";
import { use, useEffect, useState } from "react";
import { getAllKittiesData } from "../utils/getAllKittiesData";
import { GetKittyDetails } from "../utils/types";

export default function ProfileGrid({
  chainName,
  networkName,
  imageSource,
  kitties,
}) {
  const chainId = getChainIdForNetworkName(networkName);
  useEffect(() => {
    console.log("3");
    console.log(kitties);
    console.log("4");
  }, [kitties]);

  const [kittyData, setKittyData] = useState<GetKittyDetails[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch data logic here
        const data = await getAllKittiesData(chainId, kitties);
        setKittyData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (chainId && kitties && kitties.length > 0) {
      fetchData();
    }
  }, [chainId, kitties]); 

  useEffect(() => {
    console.log(kittyData);
  }, [kittyData]);

  return (
    <>
      <GridItem w="100%">
        <Flex justifyContent="center" alignItems="center">
          <Image
            src={imageSource}
            alt="Logo"
            boxSize="40px"
            borderRadius="50%"
          />
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <Text fontSize="2xl">{chainName}</Text>
        </Flex>

        {kitties && kittyData && kittyData.map((kitty,i) => (
          <Flex key={i} justifyContent="center" alignItems="center">
            <KittyCard clickable={true} chainId={chainId} kittyId={String(kitties[i])} kitty={kitty} />
          </Flex>
        ))}
      </GridItem>
    </>
  );
}
