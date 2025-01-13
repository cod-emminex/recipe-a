// client/src/components/Navbar.js
import { Box, Flex, Button, Heading, Stack, useToast } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

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
        <Heading
          as={RouterLink}
          to="/"
          size="lg"
          color="white"
          cursor="pointer"
        >
          Recipe-A
        </Heading>

        <Stack direction="row" spacing={4}>
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
      </Flex>
    </Box>
  );
};

export default Navbar;
