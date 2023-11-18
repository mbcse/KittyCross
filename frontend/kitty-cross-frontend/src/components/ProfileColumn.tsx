import { Flex, GridItem } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

export default function ProfileGrid({ chainName }) {
  return (
    <>
      <GridItem w="100%" h="10" bg="blue.500">
        <Flex justifyContent="center" alignItems="center" h="100%">
          <Text fontSize="2xl">{chainName}</Text>
        </Flex>
      </GridItem>
    </>
  );
}
