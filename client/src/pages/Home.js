// client/src/pages/Home.js
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Box,
  SimpleGrid,
  Image,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import SearchBar from "../components/SearchBar";
import RecipeCarousel from "../components/RecipeCarousel";
import PageTitle from "../components/PageTitle";
import WelcomeMessage from "../components/WelcomeMessage";
const Home = () => {
  const { user } = useAuth();
  const bgColor = useColorModeValue("gray.50", "gray.900");

  const featuredRecipes = [
    {
      id: 1,
      title: "Homestyle Pasta Carbonara",
      description: "Creamy Italian pasta with crispy pancetta",
      image:
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      title: "Asian Glazed Salmon",
      description: "Teriyaki-glazed salmon with sticky rice",
      image:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      title: "Mediterranean Quinoa Bowl",
      description: "Healthy bowl with fresh vegetables and feta",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    },
    {
      id: 4,
      title: "Classic Margherita Pizza",
      description: "Traditional Italian pizza with fresh basil",
      image:
        "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&h=600&fit=crop",
    },
    {
      id: 5,
      title: "Chocolate Lava Cake",
      description: "Decadent dessert with molten center",
      image:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop",
    },
  ];
  const features = [
    {
      title: "Share Your Recipes",
      description:
        "Create and share your culinary masterpieces with food enthusiasts worldwide.",
      image: process.env.PUBLIC_URL + "/images/share-recipe.svg",
    },
    {
      title: "Discover New Dishes",
      description:
        "Explore a world of flavors with recipes from global cuisines.",
      image: process.env.PUBLIC_URL + "/images/discover.svg",
    },
    {
      title: "Cook Together",
      description:
        "Join our community of passionate cooks and share your kitchen adventures.",
      image: process.env.PUBLIC_URL + "/images/cook-together.svg",
    },
  ];
  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
  };

  return (
    <Box bg={bgColor}>
      <Container maxW="container.xl" py={10}>
        <VStack spacing={10} align="center" textAlign="center">
          <PageTitle title="Home" />

          {/* Welcome Section */}
          <Box>
            <WelcomeMessage fontSize="xxxl" fontFamily="Montserrat" />
            {user && <Text fontSize="xxxl" color="teal.600"></Text>}
          </Box>
          <Text
            fontSize={{ base: "xxl", md: "2xl" }}
            maxW="container.md"
            fontFamily="Montserrat"
            fontStyle="oblique"
            fontWeight={"bold"}
          >
            Your journey to culinary excellence starts here. Share, discover,
            and create amazing dishes.
          </Text>

          <SearchBar onSearch={handleSearch} />

          {!user && (
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                colorScheme="teal"
                px={8}
                fontFamily="Montserrat"
              >
                Get Started
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                size="lg"
                colorScheme="teal"
                variant="outline"
                px={8}
                fontFamily="Montserrat"
              >
                Sign In
              </Button>
            </Stack>
          )}

          {/* Featured Recipes Carousel */}
          <Box w="full" py={8}>
            <RecipeCarousel recipes={featuredRecipes} />
          </Box>

          {/* Features Grid */}
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={10}
            pt={10}
            w="full"
          >
            {features.map((feature, index) => (
              <VStack
                key={index}
                p={8}
                bg="white"
                boxShadow="xl"
                borderRadius="lg"
                spacing={4}
                transition="transform 0.3s, box-shadow 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "2xl",
                }}
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  boxSize="120px"
                  objectFit="contain"
                  fallback={
                    <Box
                      h="120px"
                      w="120px"
                      bg="gray.100"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="md"
                    >
                      <Text color="gray.500">Loading...</Text>
                    </Box>
                  }
                />
                <Heading size="md" fontFamily="Montserrat" color="teal.600">
                  {feature.title}
                </Heading>
                <Text fontFamily="Montserrat" color="gray.600">
                  {feature.description}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>

          {/* Call to Action */}
          <Box py={16}>
            <VStack spacing={6}>
              <Heading size="lg" color="teal.600" fontFamily="Montserrat">
                Start Your Culinary Journey Today
              </Heading>
              <Text fontSize="lg" fontFamily="Montserrat" maxW="container.md">
                Join our growing community of food lovers and share your unique
                recipes with the world.
              </Text>
              {!user && (
                <Button
                  as={RouterLink}
                  to="/register"
                  size="lg"
                  colorScheme="teal"
                  px={12}
                  py={6}
                  fontSize="lg"
                  fontFamily="Montserrat"
                >
                  Join Recipe Haven
                </Button>
              )}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;
