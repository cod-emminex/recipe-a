// client/src/components/Logo.js
import { Image, HStack, Heading } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import LogoImage from "../assets/logo.png"; // Add your logo image to assets folder

const Logo = () => {
  return (
    <HStack spacing={3}>
      <Image
        src={LogoImage}
        alt="Recipe Haven Logo"
        h="70px"
        w="auto"
        objectFit="contain"
      />
      <Heading
        as={RouterLink}
        to="/"
        size="lg"
        color="white"
        cursor="pointer"
        fontFamily="Montserrat"
      >
        Recipe Haven
      </Heading>
    </HStack>
  );
};

export default Logo;
