// client/src/pages/Home.js
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
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const bgColor = useColorModeValue("gray.50", "gray.900");

  const features = [
    {
      title: "Share Your Recipes",
      description: "Create and share your favorite recipes with the community.",
      image: "/images/share-recipe.svg",
    },
    {
      title: "Discover New Dishes",
      description: "Explore recipes from other food enthusiasts.",
      image: "/images/discover.svg",
    },
    {
      title: "Cook Together",
      description:
        "Connect with other cooks and share your culinary experiences.",
      image: "/images/cook-together.svg",
    },
  ];

  return (
    <Box bg={bgColor}>
      <Container maxW="container.xl" py={20}>
        <VStack spacing={10} align="center" textAlign="center">
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-r, teal.400, teal.600)"
            bgClip="text"
          >
            Welcome to Recipe-A
          </Heading>

          <Text fontSize="xl" maxW="container.md">
            Your personal recipe collection platform. Share, discover, and cook
            amazing dishes.
          </Text>

          {!user && (
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              colorScheme="teal"
              px={8}
            >
              Get Started
            </Button>
          )}

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} pt={10}>
            {features.map((feature, index) => (
              <VStack
                key={index}
                p={6}
                bg="white"
                boxShadow="xl"
                borderRadius="lg"
                spacing={4}
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  boxSize="150px"
                  objectFit="contain"
                />
                <Heading size="md">{feature.title}</Heading>
                <Text>{feature.description}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;
