// client/src/pages/ProfilePage.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  Heading,
  Text,
  Button,
  useToast,
  Skeleton,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserFriends, FaBookOpen, FaHeart, FaStar } from "react-icons/fa";
import { RecipeGrid } from "../components/recipe/RecipeGrid";
import { CollectionsList } from "../components/profile/CollectionsList";
import { ActivityFeed } from "../components/profile/ActivityFeed";
import { ReviewsList } from "../components/review/ReviewsList";
import { apiClient } from "../services/api/apiClient";
import { useAuth } from "../hooks/useAuth";
import { logger } from "../services/logging/logger";

export const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get(`/users/${username}`);
      setProfile(data);
      setIsFollowing(data.isFollowedByCurrentUser);
    } catch (error) {
      logger.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await apiClient.delete(`/users/${username}/follow`);
      } else {
        await apiClient.post(`/users/${username}/follow`);
      }
      setIsFollowing(!isFollowing);
      setProfile((prev) => ({
        ...prev,
        followersCount: prev.followersCount + (isFollowing ? -1 : 1),
      }));
    } catch (error) {
      logger.error("Error following user:", error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        status: "error",
      });
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Profile Header */}
        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={8}>
          <VStack spacing={4}>
            <Avatar size="2xl" src={profile.avatarUrl} name={profile.name} />
            {!isOwnProfile && (
              <Button
                colorScheme={isFollowing ? "gray" : "teal"}
                onClick={handleFollow}
                w="full"
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </VStack>

          <Box>
            <Heading size="lg" mb={2}>
              {profile.name}
            </Heading>
            <Text color="gray.600" mb={4}>
              {profile.bio}
            </Text>

            <StatGroup>
              <Stat>
                <StatLabel>Recipes</StatLabel>
                <StatNumber>{profile.recipeCount}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Followers</StatLabel>
                <StatNumber>{profile.followersCount}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Following</StatLabel>
                <StatNumber>{profile.followingCount}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Average Rating</StatLabel>
                <StatNumber>
                  <HStack>
                    <Text>{profile.averageRating}</Text>
                    <Icon as={FaStar} color="yellow.400" />
                  </HStack>
                </StatNumber>
              </Stat>
            </StatGroup>
          </Box>
        </Grid>

        <Divider />

        {/* Profile Content */}
        <Tabs
          index={activeTab}
          onChange={setActiveTab}
          isLazy
          variant="enclosed"
        >
          <TabList>
            <Tab>Recipes</Tab>
            <Tab>Collections</Tab>
            <Tab>Activity</Tab>
            <Tab>Reviews</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <RecipeGrid
                recipes={profile.recipes}
                isLoading={false}
                emptyMessage="No recipes yet"
              />
            </TabPanel>

            <TabPanel>
              <CollectionsList
                collections={profile.collections}
                isOwnProfile={isOwnProfile}
                onCollectionClick={(id) => navigate(`/collections/${id}`)}
              />
            </TabPanel>

            <TabPanel>
              <ActivityFeed
                activities={profile.activities}
                username={username}
              />
            </TabPanel>

            <TabPanel>
              <ReviewsList reviews={profile.reviews} username={username} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

const ProfileSkeleton = () => (
  <Container maxW="container.xl" py={8}>
    <VStack spacing={8} align="stretch">
      <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={8}>
        <VStack spacing={4}>
          <Skeleton boxSize="200px" borderRadius="full" />
          <Skeleton height="40px" width="100%" />
        </VStack>

        <Box>
          <Skeleton height="40px" width="200px" mb={4} />
          <Skeleton height="20px" width="100%" mb={4} />
          <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height="60px" />
            ))}
          </Grid>
        </Box>
      </Grid>

      <Skeleton height="40px" />
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} height="200px" />
        ))}
      </Grid>
    </VStack>
  </Container>
);
