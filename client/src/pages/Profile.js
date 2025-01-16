// client/src/pages/Profile.js
import { useState, useEffect, useCallback } from "react";

import {
  Container,
  VStack,
  Box,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Avatar,
  Grid,
  Text,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { userAPI, recipeAPI } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EditableField from "../components/EditableField";
import { Divider } from "@chakra-ui/react";
import PageTitle from "../components/PageTitle";

const Profile = () => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [profileResponse, recipesResponse] = await Promise.all([
        userAPI.getProfile(),
        recipeAPI.getAll({ author: user.id }),
      ]);

      // Update profile data with the response
      setProfileData(profileResponse.data);
      setUserRecipes(recipesResponse.data);
    } catch (error) {
      toast({
        title: "Error fetching profile data",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user.id, toast]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]); // Add dependency on user.id

  const handleProfileUpdate = async (fieldUpdate) => {
    try {
      // Merge the current profile data with the update
      const updatedData = {
        ...profileData,
        ...fieldUpdate,
      };

      const response = await userAPI.updateProfile(updatedData);

      // Update local state with the response data
      setProfileData(response.data);

      // Update auth context if needed
      updateUser(response.data);

      toast({
        title: "Profile updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error updating profile",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleRecipeDelete = async (deletedId) => {
    try {
      await recipeAPI.delete(deletedId);
      setUserRecipes((prev) =>
        prev.filter((recipe) => recipe._id !== deletedId)
      );
      toast({
        title: "Recipe deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting recipe",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container maxW="container.xl" py={8}>
      <PageTitle title="Profile" />
      <VStack spacing={8} align="stretch">
        {/* Profile Header */}
        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={8}>
          <VStack spacing={4}>
            <Avatar
              size="2xl"
              src={profileData?.avatarUrl}
              name={profileData?.name || user.username}
            />
            <VStack spacing={1}>
              <Text
                fontSize="sm"
                color="gray.600"
                textAlign="center"
                wordBreak="break-all"
              >
                {profileData?.email || user.email}
              </Text>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                @{profileData?.username || user.username}
              </Text>
            </VStack>
          </VStack>

          <Box>
            <Heading size="lg" mb={2}>
              {profileData?.name || user.username}
            </Heading>
            <Text color="gray.600" mb={4}>
              {profileData?.bio || "No bio yet"}
            </Text>

            <StatGroup>
              <Stat>
                <StatLabel>Recipes</StatLabel>
                <StatNumber>{userRecipes.length}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Followers</StatLabel>
                <StatNumber>{profileData?.followersCount || 0}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Following</StatLabel>
                <StatNumber>{profileData?.followingCount || 0}</StatNumber>
              </Stat>
            </StatGroup>
          </Box>
        </Grid>

        <Tabs>
          <TabList>
            <Tab>Profile</Tab>
            <Tab>My Recipes</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <EditableField
                  label="Name"
                  name="name"
                  value={profileData?.name}
                  onSave={handleProfileUpdate}
                  placeholder="Add your name"
                />
                <Divider />
                <EditableField
                  label="Username"
                  name="username"
                  value={profileData?.username}
                  onSave={handleProfileUpdate}
                  placeholder="Add username"
                />
                <Divider />
                <EditableField
                  label="Bio"
                  name="bio"
                  value={profileData?.bio}
                  onSave={handleProfileUpdate}
                  placeholder="Tell us about yourself"
                />
                <Divider />
                <EditableField
                  label="E-mail"
                  name="email"
                  value={profileData?.email}
                  onSave={handleProfileUpdate}
                  placeholder="Your user email"
                />
                <Divider />

                <EditableField
                  label="Country"
                  name="country"
                  value={profileData?.country?.code}
                  onSave={handleProfileUpdate}
                  type="country"
                  placeholder="Select your country"
                />
                <Divider />
                <EditableField
                  label="Best Recipe"
                  name="bestRecipe"
                  value={profileData?.bestRecipe}
                  onSave={handleProfileUpdate}
                  placeholder="What's your favourite recipe?"
                />
                <Divider />
                <EditableField
                  label="Favorite Cuisine"
                  name="favoriteCuisine"
                  value={profileData?.favoriteCuisine}
                  onSave={handleProfileUpdate}
                  placeholder="What do you love to cook most?"
                />
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} align="stretch">
                {userRecipes.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {userRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe._id}
                        recipe={recipe}
                        onDelete={handleRecipeDelete}
                        isOwner={true}
                      />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Box textAlign="center" py={10}>
                    You haven&apos;t created any recipes yet.
                  </Box>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default Profile;
