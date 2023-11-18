import { Heading, Text } from "@chakra-ui/react";
import { FaCat } from "react-icons/fa";

export default function Brand ({m}){
    return(
        <Heading
        fontWeight={600}
        fontSize={{ base: "m", sm: "m", md: "m" }}
        lineHeight={"110%"}
        m={m}
      >
        <FaCat/>
        Kitty{" "}
        <Text as={"span"} color={"teal.400"}>
          Cross
        </Text>
      </Heading>
    )
}