// client/src/pages/Community.js
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Text,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import UserCard from "../components/UserCard";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";

const Community = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user: currentUser, isAuthenticated } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await userAPI.getCommunityUsers();
      // Map through users and add isFollowing status
      const usersWithFollowStatus = response.data.map((u) => ({
        ...u,
        isFollowing:
          u.followers?.some((follower) => follower._id === currentUser?._id) ||
          false,
      }));
      setUsers(usersWithFollowStatus);
    } catch (error) {
      console.error("Community fetch error:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "Failed to load community members",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast, currentUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFollow = async (userId) => {
    if (!isAuthenticated || !currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please login to follow other users",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await userAPI.follow(userId);

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId
            ? {
                ...u,
                isFollowing: true,
                followersCount: (u.followersCount || 0) + 1,
                followers: [...(u.followers || []), currentUser._id],
              }
            : u
        )
      );

      toast({
        title: "Success",
        description: "Successfully followed user",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Follow error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to follow user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUnfollow = async (userId) => {
    if (!isAuthenticated || !currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please login to unfollow users",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await userAPI.unfollow(userId);

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId
            ? {
                ...u,
                isFollowing: false,
                followersCount: Math.max((u.followersCount || 0) - 1, 0),
                followers: (u.followers || []).filter(
                  (id) => id !== currentUser._id
                ),
              }
            : u
        )
      );

      toast({
        title: "Success",
        description: "Successfully unfollowed user",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Unfollow error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to unfollow user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Center h="calc(100vh - 60px)">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Box py={8}>
      <Container maxW="container.xl" fontFamily="Montserrat">
        <VStack spacing={8}>
          <PageTitle title="Recipe Community" />

          <InputGroup maxW="600px" fontFamily="Montserrat">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              name="search"
              id="search"
              placeholder="Search community members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="lg"
              borderRadius="full"
            />
          </InputGroup>

          {filteredUsers.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={6}
              w="full"
            >
              {filteredUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                  isAuthenticated={isAuthenticated}
                  currentUser={currentUser}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Text>No users found matching your search.</Text>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Community;
