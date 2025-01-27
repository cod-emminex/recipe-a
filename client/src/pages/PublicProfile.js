// client/src/pages/PublicProfile.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  Avatar,
  Text,
  Heading,
  SimpleGrid,
  Button,
  useToast,
  Spinner,
  Center,
  Flex,
  Icon,
  Divider,
  useColorModeValue,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import {
  FaUser,
  FaUtensils,
  FaHeart,
  FaUserFriends,
  FaBook,
  FaGlobe,
} from "react-icons/fa";
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const StatBox = ({ icon, label, value, color }) => {
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <MotionBox
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      p={6}
      bg={bgColor}
      rounded="xl"
      shadow="lg"
      borderWidth="1px"
      borderColor={`${color}.100`}
      _hover={{ shadow: "2xl" }}
    >
      <VStack spacing={2}>
        <Icon as={icon} w={6} h={6} color={`${color}.500`} />
        <Text
          fontFamily="Montserrat"
          fontSize="2xl"
          fontWeight="bold"
          color={`${color}.500`}
        >
          {value}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {label}
        </Text>
      </VStack>
    </MotionBox>
  );
};

const PublicProfile = () => {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const gradientBg = useColorModeValue(
    "linear(to-r, teal.400, blue.500)",
    "linear(to-r, teal.600, blue.700)"
  );

  const fetchProfile = useCallback(async () => {
    try {
      if (currentUser?.username === username) {
        navigate("/profile");
        return;
      }

      const response = await userAPI.getPublicProfile(username);
      const userData = response.data;

      console.log("Fetched Profile Data:", {
        username: userData.username,
        currentUserId: currentUser?._id,
        isFollowing: userData.isFollowing,
        followers: userData.followers,
      });

      setProfileData(userData);
      setIsFollowing(userData.isFollowing);
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load profile",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [username, currentUser, navigate, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFollowAction = async () => {
    if (!isAuthenticated || !currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please login to follow/unfollow users",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (isFollowing) {
        await userAPI.unfollow(profileData._id);
        setIsFollowing(false);
        setProfileData((prev) => ({
          ...prev,
          followersCount: Math.max((prev.followersCount || 0) - 1, 0),
          isFollowing: false,
        }));

        toast({
          title: "Success",
          description: `You have unfollowed ${username}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await userAPI.follow(profileData._id);
        setIsFollowing(true);
        setProfileData((prev) => ({
          ...prev,
          followersCount: (prev.followersCount || 0) + 1,
          isFollowing: true,
        }));

        toast({
          title: "Success",
          description: `You are now following ${username}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      // Refresh profile data to ensure everything is in sync
      await fetchProfile();
    } catch (error) {
      console.error("Follow/Unfollow error:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          `Failed to ${isFollowing ? "unfollow" : "follow"} user`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  if (loading) {
    return (
      <Center h="calc(100vh - 60px)">
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="teal.500"
            size="xl"
          />
          <Text>Loading profile...</Text>
        </VStack>
      </Center>
    );
  }

  if (!profileData) {
    return (
      <Center h="calc(100vh - 60px)">
        <VStack spacing={4}>
          <Icon as={FaUser} w={12} h={12} color="gray.400" />
          <Text fontSize="xl">User not found</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box minH="calc(100vh - 60px)" pt={0} fontFamily="Montserrat">
      {/* Hero Section with Gradient Background */}
      <Box
        bgGradient={gradientBg}
        h="300px"
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl" h="full">
          <MotionFlex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="center"
            h="full"
            pt="60px"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar
              size="2xl"
              name={profileData.username}
              src={profileData.avatarUrl}
              border="4px solid white"
              shadow="xl"
            />
            <Box
              ml={{ base: 0, md: 8 }}
              mt={{ base: 4, md: 0 }}
              textAlign={{ base: "center", md: "left" }}
            >
              <Heading color="white" size="2xl" fontFamily="Montserrat">
                {profileData.name || profileData.username}
              </Heading>
              <Text color="whiteAlpha.900" fontSize="lg" mt={2}>
                @{profileData.username}
              </Text>
            </Box>
          </MotionFlex>
        </Container>
      </Box>

      <Container maxW="container.xl" mt="-60px">
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
          {/* Left Column - Profile Info */}
          <Box gridColumn={{ base: "span 1", lg: "span 1" }}>
            <MotionBox
              bg={bgColor}
              rounded="xl"
              shadow="xl"
              overflow="hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VStack spacing={6} p={6}>
                {currentUser &&
                  currentUser.username !== profileData.username && (
                    <Button
                      colorScheme={isFollowing ? "red" : "teal"}
                      onClick={handleFollowAction}
                      size="lg"
                      width="full"
                      rounded="full"
                      leftIcon={
                        <Icon as={isFollowing ? FaHeart : FaUserFriends} />
                      }
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}

                <Divider />

                {profileData.bio && (
                  <VStack align="start" width="full">
                    <Text fontWeight="bold">About</Text>
                    <Text color={textColor}>{profileData.bio}</Text>
                  </VStack>
                )}

                {profileData.country && (
                  <HStack width="full">
                    <Icon as={FaGlobe} color="teal.500" />
                    <Text>{profileData.country.name}</Text>
                  </HStack>
                )}

                {profileData.favoriteCuisine && (
                  <HStack width="full">
                    <Icon as={FaUtensils} color="teal.500" />
                    <Text>{profileData.favoriteCuisine}</Text>
                  </HStack>
                )}
              </VStack>
            </MotionBox>
          </Box>

          {/* Right Column - Stats and Content */}
          <Box gridColumn={{ base: "span 1", lg: "span 2" }}>
            <VStack spacing={8} width="full">
              {/* Stats Grid */}
              <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} width="full">
                <StatBox
                  icon={FaBook}
                  label="Recipes"
                  value={profileData?.recipesCount}
                  color="teal"
                />
                <StatBox
                  icon={FaUserFriends}
                  label="Followers"
                  value={profileData?.followersCount}
                  color="blue"
                />
                <StatBox
                  icon={FaHeart}
                  label="Following"
                  value={profileData?.followingCount}
                  color="purple"
                />
              </SimpleGrid>

              {/* Tabs for Content */}
              <Box bg={bgColor} rounded="xl" shadow="xl" width="full" p={4}>
                <Tabs isFitted variant="soft-rounded" colorScheme="teal">
                  <TabList mb={4}>
                    <Tab>Recipes</Tab>
                    <Tab>Favorites</Tab>
                    <Tab>About</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      {profileData.recipes && profileData.recipes.length > 0 ? (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                          {profileData.recipes.map((recipe) => (
                            <RecipeCard
                              key={recipe.recipeNumber}
                              recipe={recipe}
                            />
                          ))}
                        </SimpleGrid>
                      ) : (
                        <Center py={8}>
                          <Text color={textColor}>No recipes shared yet</Text>
                        </Center>
                      )}
                    </TabPanel>

                    <TabPanel>
                      <Center py={8}>
                        <Text color={textColor}>
                          Favorite recipes coming soon!
                        </Text>
                      </Center>
                    </TabPanel>

                    <TabPanel>
                      <VStack spacing={4} align="start">
                        {profileData.bestRecipe && (
                          <Box>
                            <Text fontWeight="bold">Best Recipe</Text>
                            <Text color={textColor}>
                              {profileData.bestRecipe}
                            </Text>
                          </Box>
                        )}
                        {/* Add more profile information here */}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default PublicProfile;
