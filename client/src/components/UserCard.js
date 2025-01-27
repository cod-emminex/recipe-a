// client/src/components/UserCard.js
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const UserCard = ({ user, onFollow, onUnfollow, isAuthenticated }) => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const { user: currentUser } = useAuth();

  const handleProfileClick = () => {
    if (currentUser?.username === user.username) {
      navigate("/profile"); // Go to personal profile
    } else {
      navigate(`/profile/${user.username}`); // Go to public profile
    }
  };
  return (
    <Box
      p={6}
      bg={cardBg}
      borderRadius="lg"
      borderWidth="1px"
      shadow="sm"
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
      position="relative"
      fontFamily="Montserrat"
    >
      <VStack spacing={4}>
        {/* Avatar and Username */}
        <Avatar
          size="xl"
          name={user.username}
          src={user.avatarUrl}
          cursor="pointer"
          onClick={handleProfileClick}
          mb={2}
        />
        <Text
          fontSize="xl"
          fontWeight="bold"
          cursor="pointer"
          onClick={handleProfileClick}
        >
          {user.username}
        </Text>

        {/* Bio */}
        {user.bio && (
          <Text
            color={textColor}
            fontSize="sm"
            textAlign="center"
            noOfLines={2}
            mb={2}
          >
            {user.bio}
          </Text>
        )}

        {/* User Stats */}
        <HStack spacing={8} justify="center" w="full">
          <Stat align="center" size="sm">
            <StatLabel fontSize="xs">Recipes</StatLabel>
            <StatNumber fontSize="md">{user.recipesCount}</StatNumber>
          </Stat>
          <Stat align="center" size="sm">
            <StatLabel fontSize="xs">Followers</StatLabel>
            <StatNumber fontSize="md">{user.followersCount}</StatNumber>
          </Stat>
          <Stat align="center" size="sm">
            <StatLabel fontSize="xs">Following</StatLabel>
            <StatNumber fontSize="md">{user.followingCount}</StatNumber>
          </Stat>
        </HStack>

        {/* Country */}
        {user.country && (
          <Text fontSize="sm" color={textColor}>
            {user.country.flag} {user.country.name}
          </Text>
        )}

        {/* Best Recipe */}
        {user.bestRecipe && (
          <Text fontSize="sm" color={textColor}>
            Best Recipe: {user.bestRecipe}
          </Text>
        )}

        {/* Action Buttons */}
        <VStack w="full" spacing={2}>
          {!user.isSelf && isAuthenticated && (
            <Button
              colorScheme={user.isFollowing ? "red" : "teal"}
              size="sm"
              w="full"
              onClick={() => {
                if (user.isFollowing) {
                  onUnfollow(user._id);
                } else {
                  onFollow(user._id);
                }
              }}
            >
              {user.isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
          <Button
            variant="outline"
            colorScheme="teal"
            size="sm"
            w="full"
            onClick={handleProfileClick}
          >
            View Profile
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default UserCard;
