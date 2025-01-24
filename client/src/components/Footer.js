// client/src/components/Footer.js
import React from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { FaGithub, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <Box bg="teal.600" color="white" mt="auto" py={6}>
      <Container maxW="container.xl">
        <Stack spacing={8}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Stack spacing={2} align={{ base: "center", md: "flex-start" }}>
              <Text fontSize="3xl" fontFamily="Montserrat" fontWeight="bold">
                Recipe Haven
              </Text>
              <Text fontSize="m" fontFamily="Montserrat">
                Created by {process.env.REACT_APP_USERNAME || "cod-emminex"}
              </Text>
            </Stack>

            <Stack direction="row" spacing={6}>
              <Text fontSize="l" fontFamily="Montserrat">
                Follow on Social Media:
              </Text>
              <Link href="https://www.linkedin.com/in/cod-emminex/" isExternal>
                <Icon as={FaLinkedin} w={6} h={6} />
              </Link>
              <Link href="https://github.com/cod-emminex" isExternal>
                <Icon as={FaGithub} w={6} h={6} />
              </Link>
              <Link href="https://x.com/cod_emminex" isExternal>
                <Icon as={FaTwitter} w={6} h={6} />
              </Link>
              <Link href="https://www.instagram.com/king_emminex" isExternal>
                <Icon as={FaInstagram} w={6} h={6} />
              </Link>
            </Stack>
          </Flex>

          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            fontSize="sm"
            borderTop="1px"
            borderColor="teal.500"
            fontFamily={"Montserrat"}
            pt={4}
          >
            <Text>
              © {new Date().getFullYear()} Recipe Haven. All rights reserved.
            </Text>
            <Text>Last updated: {currentDate}</Text>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
