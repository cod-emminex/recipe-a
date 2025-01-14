// client/src/components/Navbar.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  Heading,
  Stack,
  useToast,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationCenter from "./NotificationCenter";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // State for date/time and username
  const [currentDateTime, setCurrentDateTime] = useState();
  const [username, setUsername] = useState("cod-emminex");

  // Update time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now.toString().slice(0, 29);
      setCurrentDateTime(formattedDate);
    };

    // Update immediately
    updateDateTime();

    // Set up interval
    const timer = setInterval(updateDateTime, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);

  // Update username when user changes
  useEffect(() => {
    if (user) {
      setUsername(user.username || "cod-emminex"); // Use actual user data from your auth context
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/login");
  };

  return (
    <Box bg="teal.500" px={4} py={3}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        maxW="1200px"
        mx="auto"
      >
        <HStack spacing={4}>
          <Heading
            as={RouterLink}
            to="/"
            size="lg"
            color="white"
            cursor="pointer"
            fontFamily="Poppins"
          >
            Recipe Haven
          </Heading>
          <Badge
            colorScheme="white"
            variant="subtle"
            px={2}
            py={1}
            borderRadius="full"
            color="white"
            fontSize="xs"
            fontFamily="mono"
          >
            {currentDateTime} UTC
          </Badge>
        </HStack>

        <Stack direction="row" spacing={4} align="center">
          <Button
            as={RouterLink}
            to="/recipes"
            colorScheme="teal"
            variant="ghost"
            color="white"
          >
            Recipes
          </Button>

          {user ? (
            <>
              <Button
                as={RouterLink}
                to="/recipes/create"
                colorScheme="teal"
                variant="ghost"
                color="white"
              >
                Create Recipe
              </Button>
              <Button
                as={RouterLink}
                to="/profile"
                colorScheme="teal"
                variant="ghost"
                color="white"
              >
                Profile
              </Button>
              <Badge
                colorScheme="white"
                variant="solid"
                px={2}
                py={1}
                borderRadius="full"
              >
                {username}
              </Badge>
              <Button onClick={handleLogout} colorScheme="teal" variant="solid">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/login"
                colorScheme="teal"
                variant="ghost"
                color="white"
              >
                Login
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="teal"
                variant="solid"
              >
                Register
              </Button>
            </>
          )}
        </Stack>
        {user && (
          <HStack spacing={4}>
            <NotificationCenter />
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
