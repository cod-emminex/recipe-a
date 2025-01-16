// client/src/components/Navbar.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  Stack,
  useToast,
  Badge,
  HStack,
  IconButton,
  useDisclosure,
  VStack,
  Collapse,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationCenter from "./NotificationCenter";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

// Import icons
import {
  FaUtensils,
  FaPlus,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaClock,
} from "react-icons/fa";

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [currentDateTime, setCurrentDateTime] = useState();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now
        .toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$2-$1");
      setCurrentDateTime(formattedDate);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/");
  };

  const NavLinks = () => (
    <>
      <Button
        colorScheme="white"
        variant="solid"
        px={10}
        py={1}
        borderRadius="full"
      ></Button>

      <Button
        as={RouterLink}
        to="/recipes"
        colorScheme="teal"
        variant="ghost"
        color="white"
        px={5}
        leftIcon={<FaUtensils />}
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
            px={5}
            leftIcon={<FaPlus />}
          >
            Create Recipe
          </Button>

          <Button
            as={RouterLink}
            to="/profile"
            colorScheme="teal"
            variant="ghost"
            color="white"
            px={5}
            leftIcon={<FaUser />}
          >
            Profile
          </Button>
          <Button
            onClick={handleLogout}
            colorScheme="teal"
            variant="solid"
            px={5}
            leftIcon={<FaSignOutAlt />}
          >
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
            leftIcon={<FaSignInAlt />}
          >
            Login
          </Button>
          <Button
            as={RouterLink}
            to="/register"
            colorScheme="teal"
            variant="solid"
            leftIcon={<FaUserPlus />}
          >
            Register
          </Button>
        </>
      )}
    </>
  );

  return (
    <Box bg="teal.500" px={4} py={3}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        maxW="1200px"
        mx="auto"
        fontFamily="Montserrat"
      >
        {/* Logo and DateTime Section */}
        <HStack spacing={4}>
          <Logo />
          <Badge
            display={{ base: "none", md: "flex" }}
            colorScheme="white"
            variant="subtle"
            px={2}
            py={1}
            borderRadius="full"
            color="white"
            fontSize="s"
            fontFamily="Montserrat"
          >
            <HStack spacing={2}>
              <FaClock />
              <Text>{currentDateTime}</Text>
              <ThemeToggle />
            </HStack>
          </Badge>
        </HStack>

        {/* Desktop Navigation */}
        <Stack
          direction="row"
          spacing={4}
          align="center"
          display={{ base: "none", md: "flex" }}
        >
          <NavLinks />
        </Stack>

        {/* Mobile Navigation Button */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onToggle}
          icon={
            isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
          }
          variant="ghost"
          color="white"
          aria-label="Toggle Navigation"
        />

        {/* Notifications (Desktop) */}
        {user && (
          <HStack spacing={4} display={{ base: "none", md: "flex" }}>
            <NotificationCenter />
          </HStack>
        )}
      </Flex>

      {/* Mobile Navigation Menu */}
      <Collapse in={isOpen} animateOpacity>
        <Box pb={4} display={{ base: "block", md: "none" }}>
          <VStack spacing={4} align="stretch">
            <NavLinks />
            {user && <NotificationCenter />}
            <Badge
              colorScheme="white"
              variant="subtle"
              px={2}
              py={1}
              borderRadius="full"
              color="white"
              fontSize="xs"
              fontFamily="Montserrat"
              textAlign="center"
            >
              <HStack spacing={2} justify="center">
                <FaClock />
                <Text>{currentDateTime}</Text>
              </HStack>
            </Badge>
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Navbar;
