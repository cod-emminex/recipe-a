// src/pages/Dashboard.js
import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg">Welcome, {user?.username}!</Heading>
          <Button colorScheme="teal" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Text>Dashboard content will go here</Text>
      </VStack>
    </Container>
  );
};

export default Dashboard;
