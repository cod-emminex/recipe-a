// client/src/components/UserCard.js
import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserCard = ({ user, onFollow, onUnfollow }) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleFollowAction = async () => {
    try {
      if (user.isFollowing) {
        await onUnfollow(user._id);
      } else {
        await onFollow(user._id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleViewProfile = () => {
    navigate(`/profile/${user._id}`);
  };

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      _hover={{ shadow: "lg" }}
      transition="all 0.3s"
    >
      <VStack spacing={4} align="center">
        <Avatar
          size="xl"
          name={user.username}
          src={user.avatar}
          cursor="pointer"
          onClick={handleViewProfile}
        />

        <VStack spacing={2} align="center">
          <Text
            fontSize="xl"
            fontWeight="bold"
            cursor="pointer"
            onClick={handleViewProfile}
          >
            {user.username}
          </Text>

          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {user.bio || "No bio available"}
          </Text>
        </VStack>

        <HStack spacing={4} justify="center">
          <Stat align="center" size="sm">
            <StatLabel>Recipes</StatLabel>
            <StatNumber>{user.recipesCount}</StatNumber>
          </Stat>
          <Stat align="center" size="sm">
            <StatLabel>Followers</StatLabel>
            <StatNumber>{user.followersCount}</StatNumber>
          </Stat>
          <Stat align="center" size="sm">
            <StatLabel>Following</StatLabel>
            <StatNumber>{user.followingCount}</StatNumber>
          </Stat>
        </HStack>

        {!user.isSelf && (
          <Button
            colorScheme={user.isFollowing ? "red" : "teal"}
            onClick={handleFollowAction}
            size="sm"
            width="full"
          >
            {user.isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}

        <Button
          variant="outline"
          colorScheme="teal"
          size="sm"
          width="full"
          onClick={handleViewProfile}
        >
          View Profile
        </Button>
      </VStack>
    </Box>
  );
};

export default UserCard;
