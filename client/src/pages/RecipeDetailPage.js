// client/src/pages/RecipeDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CommentThread } from "../components/review/CommentThread";
import { RatingAggregation } from "../components/review/RatingAggregation";
import { format } from "date-fns";

// src/pages/RecipeDetailPage.js
import { ReviewsSection } from "../components/review/CommentThread";
import {
  Container,
  Box,
  Grid,
  Image,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  Button,
  useToast,
  Skeleton,
  useDisclosure,
  Divider,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FaClock,
  FaUtensils,
  FaBookmark,
  FaShare,
  FaHeart,
  FaPrint,
  FaLink,
} from "react-icons/fa";
import { apiClient } from "../services/api/apiClient";
import { logger } from "../services/logging/logger";
import { useAuth } from "../context/AuthContext"; // Updated path

// Import recipe components
import { IngredientList } from "../components/recipe/IngredientList";
import { StepsList } from "../components/recipe/StepsList";

// Import analytics
import { analytics } from "../services/analytics";

// Import common components
import { ImageUpload } from "../components/common/ImageUpload";

// NutritionInfo Component
const NutritionInfo = ({ nutrition }) => {
  if (!nutrition) return null;

  return (
    <Box p={4} borderRadius="lg" boxShadow="sm" bg="white" width="100%">
      <Heading size="md" mb={4}>
        Nutrition Information
      </Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        {Object.entries(nutrition).map(([key, value]) => (
          <HStack key={key} justify="space-between">
            <Text textTransform="capitalize">{key}</Text>
            <Text fontWeight="bold">{value}</Text>
          </HStack>
        ))}
      </Grid>
    </Box>
  );
};

// RelatedRecipes Component
const RelatedRecipes = ({ category, currentRecipeId }) => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedRecipes = async () => {
      try {
        const response = await apiClient.get("/recipes", {
          params: {
            category,
            limit: 3,
            exclude: currentRecipeId,
          },
        });
        setRecipes(response.data);
      } catch (error) {
        logger.error("Error fetching related recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (category && currentRecipeId) {
      fetchRelatedRecipes();
    }
  }, [category, currentRecipeId]);

  if (isLoading) {
    return (
      <Box width="100%">
        <Heading size="md" mb={4}>
          Related Recipes
        </Heading>
        <VStack spacing={4}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="100px" width="100%" />
          ))}
        </VStack>
      </Box>
    );
  }

  if (!recipes.length) return null;

  return (
    <Box width="100%">
      <Heading size="md" mb={4}>
        Related Recipes
      </Heading>
      <VStack spacing={4}>
        {recipes.map((recipe) => (
          <Box
            key={recipe.id}
            p={4}
            borderRadius="lg"
            boxShadow="sm"
            bg="white"
            width="100%"
            cursor="pointer"
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            _hover={{ transform: "translateY(-2px)", transition: "all 0.2s" }}
          >
            <HStack spacing={4}>
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                boxSize="60px"
                objectFit="cover"
                borderRadius="md"
              />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" noOfLines={1}>
                  {recipe.title}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {recipe.cookingTime} mins · {recipe.difficulty}
                </Text>
              </VStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
// RecipeActions Component
const RecipeActions = ({ recipe, onLike, onSave, onShare }) => {
  const toast = useToast();
  const { user } = useAuth();

  const handlePrint = () => {
    window.print();
  };

  const trackSocialInteraction = (type, data) => {
    try {
      if (window.analytics) {
        window.analytics.track("social_interaction", {
          type,
          recipeId: data.recipeId,
          userId: data.userId,
          timestamp: new Date().toISOString(),
          ...data,
        });
      }
    } catch (error) {
      logger.error("Error tracking social interaction:", error);
    }
  };

  return (
    <HStack spacing={2}>
      <Button
        leftIcon={<Icon as={FaHeart} />}
        colorScheme={recipe.isLiked ? "red" : "gray"}
        variant={recipe.isLiked ? "solid" : "outline"}
        onClick={() => {
          onLike();
          trackSocialInteraction("like", {
            recipeId: recipe.id,
            userId: user?.id,
          });
        }}
        isDisabled={!user}
      >
        {recipe.likes}
      </Button>
      <Button
        leftIcon={<Icon as={FaBookmark} />}
        colorScheme={recipe.isSaved ? "teal" : "gray"}
        variant={recipe.isSaved ? "solid" : "outline"}
        onClick={() => {
          onSave();
          trackSocialInteraction("save", {
            recipeId: recipe.id,
            userId: user?.id,
          });
        }}
        isDisabled={!user}
      >
        Save
      </Button>
      <Button
        leftIcon={<Icon as={FaShare} />}
        onClick={() => {
          onShare();
          trackSocialInteraction("share", {
            recipeId: recipe.id,
            userId: user?.id,
          });
        }}
      >
        Share
      </Button>
      <Button
        leftIcon={<Icon as={FaPrint} />}
        onClick={() => {
          handlePrint();
          trackSocialInteraction("print", {
            recipeId: recipe.id,
            userId: user?.id,
          });
        }}
      >
        Print
      </Button>
    </HStack>
  );
};

// RecipeDetailSkeleton component for loading state
const RecipeDetailSkeleton = () => (
  <VStack spacing={6} align="stretch" data-testid="recipe-detail-skeleton">
    <Skeleton height="400px" borderRadius="lg" />
    <Skeleton height="40px" width="70%" />
    <Skeleton height="20px" width="40%" />
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      <Skeleton height="60px" />
      <Skeleton height="60px" />
      <Skeleton height="60px" />
    </Grid>
    <Skeleton height="100px" />
    <Skeleton height="200px" />
  </VStack>
);

// RecipeMetadata component
const RecipeMetadata = ({ recipe }) => (
  <HStack spacing={6} wrap="wrap">
    <HStack>
      <Icon as={FaClock} color="gray.500" />
      <Text>{recipe.cookingTime} mins</Text>
    </HStack>
    <HStack>
      <Icon as={FaUtensils} color="gray.500" />
      <Text>{recipe.servings} servings</Text>
    </HStack>
    <Badge
      colorScheme={
        recipe.difficulty === "Easy"
          ? "green"
          : recipe.difficulty === "Medium"
          ? "yellow"
          : "red"
      }
    >
      {recipe.difficulty}
    </Badge>
  </HStack>
);

// IngredientDisplay component
const IngredientDisplay = ({ ingredients, servings }) => {
  const [currentServings, setCurrentServings] = useState(servings);

  const adjustedIngredients = ingredients.map((ing) => ({
    ...ing,
    amount: (ing.amount * currentServings) / servings,
  }));

  return (
    <Box>
      <HStack mb={4}>
        <Text>Adjust servings:</Text>
        <Button
          size="sm"
          onClick={() => setCurrentServings(Math.max(1, currentServings - 1))}
        >
          -
        </Button>
        <Text>{currentServings}</Text>
        <Button
          size="sm"
          onClick={() => setCurrentServings(currentServings + 1)}
        >
          +
        </Button>
      </HStack>

      <VStack align="stretch" spacing={2}>
        {adjustedIngredients.map((ing, index) => (
          <HStack key={index} justify="space-between">
            <Text>{ing.name}</Text>
            <Text color="gray.600">
              {ing.amount.toFixed(1)} {ing.unit}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};
// StepsDisplay component
const StepsDisplay = ({ steps }) => (
  <VStack align="stretch" spacing={6}>
    {steps.map((step, index) => (
      <Box key={index} p={4} borderRadius="md" bg="gray.50">
        <HStack align="flex-start" spacing={4}>
          <Badge colorScheme="teal" fontSize="lg" p={2} borderRadius="full">
            {index + 1}
          </Badge>
          <Text>{step}</Text>
        </HStack>
      </Box>
    ))}
  </VStack>
);

// ShareModal component
const ShareModal = ({ isOpen, onClose, recipe }) => {
  const toast = useToast();
  const shareUrl = window.location.href;

  const shareOptions = [
    {
      name: "Copy Link",
      icon: FaLink,
      onClick: () => {
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          status: "success",
          duration: 2000,
        });
        onClose();
      },
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share Recipe</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            {shareOptions.map((option) => (
              <Button
                key={option.name}
                leftIcon={<Icon as={option.icon} />}
                w="100%"
                onClick={option.onClick}
              >
                {option.name}
              </Button>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// AuthorCard component
const AuthorCard = ({ author }) => {
  const navigate = useNavigate();

  return (
    <Box p={4} borderRadius="lg" boxShadow="sm" bg="white" width="100%">
      <VStack spacing={4}>
        <Avatar size="xl" src={author.avatarUrl} name={author.name} />
        <VStack spacing={1}>
          <Heading size="md">{author.name}</Heading>
          <Text color="gray.600">
            {author.recipeCount} recipes · {author.followersCount} followers
          </Text>
        </VStack>
        <Button
          colorScheme="teal"
          width="100%"
          onClick={() => navigate(`/profile/${author.username}`)}
        >
          View Profile
        </Button>
      </VStack>
    </Box>
  );
};

// Main RecipeDetailPage Component
export const RecipeDetailPage = () => {
  const { id: recipeId } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([
    { stars: 5, count: 0 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ]);

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/recipes/${recipeId}`);
        setRecipe(response.data);
      } catch (err) {
        setError(err.message);
        logger.error("Error fetching recipe:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  // Fetch social data
  useEffect(() => {
    const fetchSocialData = async () => {
      if (!recipe) return;

      try {
        const [reviewsData, commentsData, ratingsData] = await Promise.all([
          apiClient.get(`/recipes/${recipeId}/reviews`),
          apiClient.get(`/recipes/${recipeId}/comments`),
          apiClient.get(`/recipes/${recipeId}/ratings/distribution`),
        ]);

        setReviews(reviewsData.data);
        setComments(commentsData.data);
        setRatings(ratingsData.data);
      } catch (error) {
        logger.error("Error fetching social data:", error);
      }
    };

    fetchSocialData();
  }, [recipeId, recipe]);

  const handleLike = async () => {
    try {
      await apiClient.post(`/recipes/${recipeId}/like`);
      setRecipe((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      }));
    } catch (error) {
      logger.error("Error liking recipe:", error);
    }
  };

  const handleSave = async () => {
    try {
      await apiClient.post(`/recipes/${recipeId}/save`);
      setRecipe((prev) => ({
        ...prev,
        isSaved: !prev.isSaved,
      }));
    } catch (error) {
      logger.error("Error saving recipe:", error);
    }
  };

  if (error) {
    return (
      <Container maxW="container.lg" py={8}>
        <Box textAlign="center" py={10}>
          <Heading color="red.500" mb={4}>
            Error
          </Heading>
          <Text>{error}</Text>
          <Button mt={4} onClick={() => navigate("/recipes")}>
            Back to Recipes
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      {isLoading ? (
        <RecipeDetailSkeleton />
      ) : (
        <>
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
            <Box>
              {/* Main Recipe Content */}
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                borderRadius="lg"
                objectFit="cover"
                w="100%"
                h="400px"
              />

              <VStack align="stretch" spacing={6} mt={6}>
                <HStack justify="space-between" align="flex-start">
                  <VStack align="start" spacing={2}>
                    <Heading size="xl">{recipe.title}</Heading>
                    <RecipeMetadata recipe={recipe} />
                  </VStack>
                  <RecipeActions
                    recipe={recipe}
                    onLike={handleLike}
                    onSave={handleSave}
                    onShare={onOpen}
                  />
                </HStack>

                <Text fontSize="lg">{recipe.description}</Text>

                <Divider />

                <Box>
                  <Heading size="md" mb={4}>
                    Ingredients
                  </Heading>
                  <IngredientDisplay
                    ingredients={recipe.ingredients}
                    servings={recipe.servings}
                  />
                </Box>

                <Divider />

                <Box>
                  <Heading size="md" mb={4}>
                    Instructions
                  </Heading>
                  <StepsDisplay steps={recipe.steps} />
                </Box>

                {recipe.notes && (
                  <>
                    <Divider />
                    <Box>
                      <Heading size="md" mb={4}>
                        Chef's Notes
                      </Heading>
                      <Text>{recipe.notes}</Text>
                    </Box>
                  </>
                )}

                <Box>
                  <Heading size="md" mb={4}>
                    Tags
                  </Heading>
                  <HStack spacing={2} wrap="wrap">
                    {recipe.tags.map((tag) => (
                      <Badge
                        key={tag}
                        colorScheme="teal"
                        borderRadius="full"
                        px={3}
                        py={1}
                        cursor="pointer"
                        onClick={() => navigate(`/recipes/tags/${tag}`)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              </VStack>

              {/* Social Sections */}
              <VStack spacing={8} mt={8}>
                <Box width="100%">
                  <Heading size="lg" mb={6}>
                    Ratings & Reviews
                  </Heading>
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                    <RatingAggregation ratings={ratings} />
                    <ReviewsSection
                      recipeId={recipeId}
                      reviews={reviews}
                      onReviewAdded={(newReview) => {
                        setReviews((prev) => [newReview, ...prev]);
                        setRatings((prev) =>
                          prev.map((r) =>
                            r.stars === newReview.rating
                              ? { ...r, count: r.count + 1 }
                              : r
                          )
                        );
                      }}
                    />
                  </SimpleGrid>
                </Box>

                <Box width="100%">
                  <Heading size="lg" mb={6}>
                    Comments
                  </Heading>
                  <CommentThread recipeId={recipeId} comments={comments} />
                </Box>
              </VStack>
            </Box>

            {/* Sidebar */}
            <VStack spacing={6}>
              <AuthorCard author={recipe.author} />
              <NutritionInfo nutrition={recipe.nutrition} />
              <RelatedRecipes
                category={recipe.category}
                currentRecipeId={recipe.id}
              />
            </VStack>
          </Grid>

          <ShareModal isOpen={isOpen} onClose={onClose} recipe={recipe} />
        </>
      )}
    </Container>
  );
};

export default RecipeDetailPage;
