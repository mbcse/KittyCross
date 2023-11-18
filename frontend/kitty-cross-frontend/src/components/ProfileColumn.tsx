import { Flex, GridItem, Image, Text } from "@chakra-ui/react";
import { useGetKitty } from "../utils/useGetKitty";
import { getChainIdForNetworkName } from "../utils/constants";
import { useGetAllKittiesData } from "../utils/useGetAllKittiesData";
import KittyCard from "./Profile/KittyCard";

export default function ProfileGrid({ chainName, networkName, imageSource, kitties }) {
  const chainId = getChainIdForNetworkName(networkName)
  const kittiesData = useGetAllKittiesData(chainId,kitties)

  return (
    <>
      <GridItem w="100%">
        <Flex justifyContent="center" alignItems="center">
          <Image src={imageSource} alt="Logo" boxSize="40px" borderRadius='50%'/>
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <Text fontSize="2xl">{chainName}</Text>
        </Flex>

        {kitties && kitties.map((kitty) => (
          <Flex key={kitty} justifyContent="center" alignItems="center">
            <KittyCard kittyId={kitty} />
          </Flex>
        ))}
      </GridItem>
    </>
  );
}
