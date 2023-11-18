"use client";

import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Icon,
  IconProps,
  Center,
  HStack,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { FaCat } from "react-icons/fa";


export default function LandingPageComponent() {
  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          <FaCat/>
          Kitty{" "}
          <Text as={"span"} color={"teal.400"}>
            Cross
          </Text>
        </Heading>
      
        <Text color={"gray.500"} maxW={"3xl"}>
          Cross-Chain Crypto Kitties let you trade and breed your virtual cats
          across different blockchains, making the game more flexible and fun
          for everyone.
        </Text>
        <Stack spacing={6} direction={"row"}>
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"teal"}
            bg={"teal.400"}
            _hover={{ bg: "teal.500" }}
          >
            Get started
          </Button>
          <Button rounded={"full"} px={6}>
            Learn more
          </Button>
        </Stack>
        <HStack>
          {/* <Image
            src="logo.png"
            width={500}
            height={500}
            alt="Picture of the author"
          /> */}
        </HStack>
       
      </Stack>
    </Container>
  );
}
