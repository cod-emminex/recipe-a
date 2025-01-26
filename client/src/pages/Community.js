// client/src/pages/Community.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Image,
  Button,
  Input,
  VStack,
  HStack,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import ReactFlagSelect from "react-flag-select";

const UserCard = ({ user, onFollow, isFollowing }) => {
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      position="relative"
    >
      <VStack spacing={4} align="center">
        <Avatar size="xl" name={user.username} src={user.avatar} />
        <Box textAlign="center">
          <Heading size="md">{user.username}</Heading>
          <Text mt={2}>{user.bio}</Text>
          <HStack mt={2} justify="center">
            <ReactFlagSelect
              selected={user.country}
              disabled
              showSelectedLabel={false}
            />
            <Text>{user.recipesCount} Recipes</Text>
          </HStack>
        </Box>
        <Button
          colorScheme={isFollowing ? "red" : "teal"}
          onClick={() => onFollow(user._id)}
          size="sm"
          width="full"
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </VStack>
    </Box>
  );
};

const Community = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/community");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error fetching users",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const response = await fetch(`/api/users/follow/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to follow user");

      // Update local state
      setUsers(
        users.map((user) =>
          user._id === userId
            ? {
                ...user,
                isFollowing: true,
                followersCount: user.followersCount + 1,
              }
            : user
        )
      );

      toast({
        title: "Success",
        description: "User followed successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const response = await fetch(`/api/users/unfollow/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to unfollow user");

      // Update local state
      setUsers(
        users.map((user) =>
          user._id === userId
            ? {
                ...user,
                isFollowing: false,
                followersCount: user.followersCount - 1,
              }
            : user
        )
      );

      toast({
        title: "Success",
        description: "User unfollowed successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Heading>Recipe Community</Heading>

        <Box width="full">
          <HStack>
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="lg"
            />
            <Button leftIcon={<SearchIcon />} colorScheme="teal" size="lg">
              Search
            </Button>
          </HStack>
        </Box>

        <Grid
          templateColumns={[
            "1fr",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
            "repeat(4, 1fr)",
          ]}
          gap={6}
          width="full"
        >
          {filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onFollow={handleFollow}
              isFollowing={user.followers?.includes(currentUser?.id)}
            />
          ))}
        </Grid>
      </VStack>
    </Container>
  );
};

export default Community;
