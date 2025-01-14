// client/src/pages/RecipeListPage.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  VStack,
  HStack,
  Input,
  Select,
  Button,
  Text,
  useToast,
  Spinner,
  InputGroup,
  InputLeftElement,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { RecipeCard } from "../components/recipe/RecipeCard";
import { FilterDrawer } from "../components/recipe/FilterDrawer";
import { useDisclosure } from "@chakra-ui/react";
import { apiClient } from "../services/api/apiClient";
import { logger } from "../services/logging/logger";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "cookingTime", label: "Cooking Time" },
];

export const RecipeListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    difficulty: searchParams.get("difficulty") || "",
    maxCookingTime: searchParams.get("maxCookingTime") || "",
    dietary: searchParams.get("dietary") || [],
    sort: searchParams.get("sort") || "latest",
  });

  useEffect(() => {
    fetchRecipes();
  }, [filters, page]);

  const fetchRecipes = async (isLoadMore = false) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/recipes", {
        params: {
          ...filters,
          page,
          limit: 12,
        },
      });

      const { data, total } = response;
      setTotalRecipes(total);
      setRecipes((prev) => (isLoadMore ? [...prev, ...data] : data));
      setHasMore(data.length === 12);
    } catch (error) {
      logger.error("Error fetching recipes:", error);
      toast({
        title: "Error",
        description: "Failed to load recipes",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    updateFilters({ search: filters.search });
  };

  const handleFilterChange = (newFilters) => {
    setPage(1);
    updateFilters(newFilters);
    onClose();
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && (typeof value === "string" || Array.isArray(value))) {
        params.set(key, Array.isArray(value) ? value.join(",") : value);
      }
    });
    setSearchParams(params);
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Search and Filter Bar */}
        <Box as="form" onSubmit={handleSearch}>
          <HStack spacing={4}>
            <InputGroup size="lg">
              <InputLeftElement>
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search recipes..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
              />
            </InputGroup>
            <Select
              size="lg"
              width="200px"
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Button leftIcon={<FaFilter />} size="lg" onClick={onOpen}>
              Filters
            </Button>
          </HStack>
        </Box>

        {/* Results Summary */}
        <Text color="gray.600">
          {totalRecipes} recipes found
          {filters.search && ` for "${filters.search}"`}
        </Text>

        {/* Recipe Grid */}
        {isLoading && page === 1 ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </SimpleGrid>
        )}

        {/* Load More */}
        {hasMore && (
          <Box textAlign="center" py={4}>
            <Button
              onClick={loadMore}
              isLoading={isLoading}
              loadingText="Loading more..."
              variant="outline"
            >
              Load More
            </Button>
          </Box>
        )}

        {/* Filter Drawer */}
        <FilterDrawer
          isOpen={isOpen}
          onClose={onClose}
          currentFilters={filters}
          onApply={handleFilterChange}
        />
      </VStack>
    </Container>
  );
};
