// client/src/pages/Profile.js
import { useState, useEffect } from "react";
import {
  Container,
  VStack,
  Heading,
  Box,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { userAPI, recipeAPI } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ProfileForm from "./ProfileForm";

const Profile = () => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [profileResponse, recipesResponse] = await Promise.all([
        userAPI.getProfile(),
        recipeAPI.getAll({ author: user.id }),
      ]);
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
  };

  const handleRecipeDelete = (deletedId) => {
    setUserRecipes((prev) => prev.filter((recipe) => recipe._id !== deletedId));
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container maxW="container.xl" py={8}>
      <Tabs>
        <TabList>
          <Tab>Profile</Tab>
          <Tab>My Recipes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Heading size="lg">Profile Settings</Heading>
              <ProfileForm />
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Heading size="lg">My Recipes</Heading>
              {userRecipes.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {userRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      recipe={recipe}
                      onDelete={handleRecipeDelete}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  You haven't created any recipes yet.
                </Box>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Profile;
