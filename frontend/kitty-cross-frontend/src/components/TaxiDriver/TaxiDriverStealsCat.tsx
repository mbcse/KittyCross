import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { FaTaxi } from "react-icons/fa";


export default function TaxiDriverStealsCatFailAlert() {
  return (
    <>
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="20px" mr={0} />
        <FaTaxi size={"120px"}/>
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Ohhh no! You got scammed! 
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          You can't cross breed you cat
          anymore. Try again please.
        </AlertDescription>
      </Alert>
    </>
  );
}
