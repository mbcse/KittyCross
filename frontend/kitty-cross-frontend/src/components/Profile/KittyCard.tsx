"use client";

import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Badge,
  Button,
  HStack,
  Divider,
  Avatar,
  Wrap,
  WrapItem,
  VStack,
} from "@chakra-ui/react";
import { FaCat } from "react-icons/fa";
import Brand from "../Brand";
import Cat from "../../lib/Types";
import { GetKittyDetails } from "../../utils/types";

const IMAGE =
  "https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80";

const imgcat =
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
export default function KittyCard({
  kitty,
  kittyId,
}: {
  kitty: GetKittyDetails;
  kittyId: string;
}) {
  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"230px"}
        w={"full"}
        bg={useColorModeValue("white", "teal.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${imgcat})`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            rounded={"lg"}
            height={230}
            width={282}
            objectFit={"cover"}
            src={imgcat}
            alt="#"
          />
        </Box>
        <Stack pt={10} align={"center"}>
          <Text color={"teal.500"} fontSize={"sm"} textTransform={"uppercase"}>
            Kitty: {kittyId}
          </Text>
          <Brand m={2} />

          <VStack direction={"row"} align={"center"}>
            <Text fontWeight={500} fontSize={"l"}>
              Generation: {kitty.generation.toString()}
            </Text>
            <Badge fontWeight={500} color={"teal.600"}>
              Status: {kitty.isGestating? "Gestating": kitty.isReady ? "Ready": kitty.cooldownIndex}
            </Badge>
          </VStack>
        </Stack>
      </Box>
    </Center>
  );
}
