import { useState, useEffect } from "react";
import {
  Box,
  Image,
  Flex,
  Button,
  Card,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";

const images = [
  "1.webp",
  "2.webp",
  "3.webp",
  "4.webp",
  "5.webp",
  "6.webp",
  "7.webp",
  "8.webp",
  "9.webp",
  "10.webp",
];
const basePath = "/slideshow/";

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 1500); 
    return () => clearInterval(interval);
  }, []);

  return (
    <Box position="relative">
      <Center py={2}>
        <Box
          maxW={"320px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"md"}
          overflow={"hidden"}
          p={2}
        >
          <Image
            src={basePath + images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            width="310px"
            height="350px"
          />
        </Box>
      </Center>

      <Flex
        position="absolute"
        top="50%"
        left="0"
        right="0"
        justifyContent="space-between"
        alignItems="center"
      >
    
      </Flex>
    </Box>
  );
};

export default Slideshow;
