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

const IMAGE =
  "https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80";

const imgcat =
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
export default function KittyDetailed({
  kittyId,
  catImageURL,
  cattributes,
  status,
  generation,
}) {
  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"530px"}
        w={"full"}
        bg={useColorModeValue("white", "teal.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-10}
          pos={"relative"}
          height={"330px"}
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
            height={340}
            width={480}
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
              Generation:
            </Text>
            <Text fontWeight={500} color={"teal.600"}>
              Status:
            </Text>
          </VStack>
        </Stack>
        <HStack mt={8} direction={"row"} spacing={4}>
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"full"}
            _focus={{
              bg: "teal.200",
            }}
          >
            Breed
          </Button>
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"full"}
            _focus={{
              bg: "teal.200",
            }}
          >
            Give Birth
          </Button>
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"full"}
            bg={"teal.400"}
            color={"white"}
            boxShadow={
              "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
            }
            _hover={{
              bg: "teal.500",
            }}
            _focus={{
              bg: "teal.500",
            }}
          >
            Auction
          </Button>
        </HStack>

        <Divider mt={10} />
        <HStack>
          <Heading fontSize={"l"} fontFamily={"body"} fontWeight={500}>
            Parents
          </Heading>

          <Wrap>
            <WrapItem>
              <Avatar
                name="Dan Abrahmov"
                src="https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                mt={2}
              />
            </WrapItem>
            <WrapItem>
              <Avatar
                name="Kola Tioluwani"
                src="https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                mt={2}
              />
            </WrapItem>
          </Wrap>
        </HStack>

        <Divider  mt={5}/>
        <Stack align={"center"} justify={"center"} direction={"row"} mt={6}>
          <Heading fontSize={"sm"} fontFamily={"body"} fontWeight={500}>
            Cattributes:
          </Heading>
          <Badge
            px={2}
            py={1}
            bg={useColorModeValue("teal.50", "teal.800")}
            fontWeight={"400"}
          >
            #art
          </Badge>
          <Badge
            px={2}
            py={1}
            bg={useColorModeValue("teal.50", "teal.800")}
            fontWeight={"400"}
          >
            #photography
          </Badge>
          <Badge
            px={2}
            py={1}
            bg={useColorModeValue("teal.50", "teal.800")}
            fontWeight={"400"}
          >
            #music
          </Badge>
        </Stack>
      </Box>
    </Center>
  );
}
