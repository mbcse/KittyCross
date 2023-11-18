import { Flex, GridItem, Image, Text } from "@chakra-ui/react";

export default function ProfileGrid({ chainName, imageSource }) {
  return (
    <>
      <GridItem w="100%">
        <Flex justifyContent="center" alignItems="center">
          <Image src={imageSource} alt="Logo" boxSize="40px" />
        </Flex>
        <Flex justifyContent="center" alignItems="center" h="100%">
          <Text fontSize="2xl">{chainName}</Text>
        </Flex>
      </GridItem>
    </>
  );
}
