// client/src/components/RecipeCard.js
import { useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  useToast,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { recipeAPI } from "../services/api";

const RecipeCard = ({ recipe, onDelete }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // Ensure recipeNumber is a valid number
      const recipeNumber = parseInt(recipe.recipeNumber);

      if (isNaN(recipeNumber)) {
        throw new Error("Invalid recipe number");
      }

      await recipeAPI.delete(recipeNumber);

      if (onDelete) {
        onDelete(recipeNumber);
      }
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage =
        error.response?.data?.error || error.message || "Error deleting recipe";

      toast({
        title: "Error deleting recipe",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Box
      position="relative"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      shadow="md"
      transition="all 0.2s"
      _hover={{ shadow: "lg" }}
    >
      {/* Recipe Number Badge */}
      <Box
        position="absolute"
        top="2"
        left="2"
        bg="teal.500"
        color="white"
        borderRadius="full"
        px={2}
        py={1}
        fontSize="sm"
        fontWeight="bold"
        zIndex="1"
      >
        {recipe.recipeNumber}
      </Box>

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
        <Text noOfLines={2} mb={4} color="gray.600" fontFamily="Montserrat">
          {recipe.description}
        </Text>
        <Text fontSize="sm" color="gray.500" mb={4} fontFamily="Montserrat">
          By {recipe.author.username}
        </Text>

        <Stack direction="row" spacing={4} justify="flex-end">
          <Button
            as={RouterLink}
            to={`/recipe/${recipe.recipeNumber}`}
            colorScheme="teal"
            variant="outline"
            size="sm"
            fontFamily="Montserrat"
          >
            View Details
          </Button>

          {user && user.id === recipe.author._id && (
            <>
              <Button
                as={RouterLink}
                to={`/recipe/${recipe.recipeNumber}/edit`}
                colorScheme="blue"
                variant="outline"
                size="sm"
                fontFamily="Montserrat"
              >
                Edit
              </Button>
              <Button
                onClick={onOpen}
                colorScheme="red"
                variant="outline"
                size="sm"
                fontFamily="Montserrat"
              >
                Delete
              </Button>
            </>
          )}
        </Stack>
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Recipe #{recipe.recipeNumber}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete &#34;{recipe.title}&#34;? This
              action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} fontFamily="Montserrat">
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={isDeleting}
                loadingText="Deleting..."
                fontFamily="Montserrat"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default RecipeCard;
