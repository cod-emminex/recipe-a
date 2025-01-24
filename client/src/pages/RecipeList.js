// client/src/pages/RecipeList.js
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Container,
  SimpleGrid,
  Heading,
  Input,
  Box,
  Select,
  HStack,
  useToast,
  VStack,
  Button,
  Image,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";
import LoadingSpinner from "../components/LoadingSpinner";
import { recipeAPI } from "../services/api";
import CountrySelect from "../components/CountrySelect";
import CountryDisplay from "../components/countryDisplay";

// Featured recipes data
const carouselRecipes = [
  {
    id: "1",
    title: "Classic Margherita Pizza",
    description: "Italian-style pizza with fresh basil",
    image:
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&h=600&fit=crop",
    author: { username: "cod-emminex", _id: "featured-author" },
  },
  {
    id: "2",
    title: "Creamy Mushroom Risotto",
    description: "Rich and authentic Italian risotto",
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop",
    author: { username: "cod-emminex", _id: "featured-author" },
  },
  {
    id: "3",
    title: "Grilled Salmon Bowl",
    description: "Fresh salmon with quinoa and vegetables",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
    author: { username: "cod-emminex", _id: "featured-author" },
  },
  {
    id: "4",
    title: "Thai Green Curry",
    description: "Authentic Thai curry with coconut milk",
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop",
    author: { username: "cod-emminex", _id: "featured-author" },
  },
  {
    id: "5",
    title: "Chocolate Lava Cake",
    description: "Decadent dessert with molten center",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop",
    author: { username: "cod-emminex", _id: "featured-author" },
  },
];

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("number");
  const toast = useToast();
  const [countryFilter, setCountryFilter] = useState("all");

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await recipeAPI.getAll();
      const databaseRecipes = response.data;

      // First, add carousel recipes (1-5)
      const numberedCarouselRecipes = carouselRecipes.map((recipe, index) => ({
        ...recipe,
        recipeNumber: index + 1,
      }));

      // Filter out database recipes that already have numbers 1-5
      const filteredDatabaseRecipes = databaseRecipes.filter(
        (recipe) => recipe.recipeNumber > 5
      );

      // Combine carousel and database recipes
      const allRecipes = [
        ...numberedCarouselRecipes,
        ...filteredDatabaseRecipes,
      ];

      // Sort by recipe number to ensure proper order
      const sortedRecipes = allRecipes.sort(
        (a, b) => a.recipeNumber - b.recipeNumber
      );
      setRecipes(sortedRecipes);
    } catch (error) {
      toast({
        title: "Error fetching recipes",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const filteredAndSortedRecipes = useMemo(() => {
    return recipes
      .filter((recipe) => {
        const matchesSearch =
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCountry =
          countryFilter === "all" ||
          countryFilter === "" ||
          (recipe.country &&
            recipe.country.toLowerCase() === countryFilter.toLowerCase());

        return matchesSearch && matchesCountry;
      })
      .sort((a, b) => {
        if (sortBy === "number") return a.recipeNumber - b.recipeNumber;
        if (sortBy === "newest")
          return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest")
          return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "country") {
          const countryA = a.country?.name || a.country || "";
          const countryB = b.country?.name || b.country || "";
          return countryA.localeCompare(countryB);
        }
        return 0;
      });
  }, [recipes, searchTerm, sortBy, countryFilter]);

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading fontFamily="Montserrat">
            All Recipes ({recipes.length})
          </Heading>
          <Button
            as={RouterLink}
            to="/create-recipe"
            colorScheme="teal"
            leftIcon={<AddIcon />}
            fontFamily="Montserrat"
          >
            Add New Recipe
          </Button>
        </HStack>

        <HStack mb={8} spacing={4}>
          <Input
            name="search"
            id="search"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fontFamily="Montserrat"
          />
          <Box minW="200px">
            <CountrySelect
              value={countryFilter}
              onChange={setCountryFilter}
              placeholder="All Countries"
              includeAll={true}
            />
          </Box>
          <Select
            name="sortBy"
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            fontFamily="Montserrat"
          >
            <option value="number">By Number</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">By Title</option>
            <option value="country">By Country</option>
          </Select>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredAndSortedRecipes.map((recipe) => (
            <Box
              key={recipe.recipeNumber}
              position="relative"
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-4px)" }}
            >
              <Box
                position="absolute"
                top="5px"
                left="5px"
                bg="teal.500"
                color="white"
                borderRadius="full"
                w="30px"
                h="30px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                zIndex="1"
                boxShadow="md"
              >
                {recipe.recipeNumber}
              </Box>
              <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                shadow="md"
              >
                <Image
                  src={recipe.image || "https://placehold.co/400?text=No+Image"}
                  alt={recipe.title}
                  h="200px"
                  w="100%"
                  objectFit="cover"
                />
                <Box p={5}>
                  <Heading size="md" mb={2} fontFamily="Montserrat">
                    {recipe.title}
                  </Heading>
                  <Box color="gray.600" mb={4} fontFamily="Montserrat">
                    {recipe.description}
                  </Box>
                  <Box
                    color="gray.600"
                    mb={4}
                    fontFamily="Montserrat"
                    fontSize="sm"
                  >
                    {recipe.country ? (
                      <CountryDisplay country={recipe.country} />
                    ) : (
                      "Country: Not specified"
                    )}{" "}
                  </Box>
                  <Box
                    fontSize="sm"
                    color="gray.500"
                    mb={4}
                    fontFamily="Montserrat"
                  >
                    By {recipe.author.username}
                  </Box>
                  <Button
                    as={RouterLink}
                    to={`/recipe/${recipe.recipeNumber}`}
                    colorScheme="teal"
                    variant="outline"
                    w="100%"
                    fontFamily="Montserrat"
                  >
                    View Recipe
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default RecipeList;
