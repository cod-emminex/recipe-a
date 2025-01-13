// client/src/components/recipe/RecipeForm.js
import React, { useState, useCallback } from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Select,
  Button,
  useToast,
  Grid,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ImageUpload } from "../common/ImageUpload";
import { IngredientList } from "./IngredientList";
import { StepsList } from "./StepsList";
import { TagInput } from "../common/TagInput";
import { apiClient } from "../../services/api/apiClient";
import { logger } from "../../services/logging/logger";

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];
const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Appetizer",
];

export const RecipeForm = ({ initialData, onSubmit, isEdit = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
      cookingTime: 30,
      servings: 4,
      difficulty: "Medium",
      category: "",
      ingredients: [],
      steps: [],
      tags: [],
    },
  });

  const [imageFile, setImageFile] = useState(null);
  const [ingredients, setIngredients] = useState(
    initialData?.ingredients || []
  );
  const [steps, setSteps] = useState(initialData?.steps || []);
  const [tags, setTags] = useState(initialData?.tags || []);
  const toast = useToast();

  const handleImageChange = useCallback((file) => {
    setImageFile(file);
  }, []);

  const handleIngredientsChange = useCallback(
    (updatedIngredients) => {
      setIngredients(updatedIngredients);
      setValue("ingredients", updatedIngredients);
    },
    [setValue]
  );

  const handleStepsChange = useCallback(
    (updatedSteps) => {
      setSteps(updatedSteps);
      setValue("steps", updatedSteps);
    },
    [setValue]
  );

  const handleTagsChange = useCallback(
    (updatedTags) => {
      setTags(updatedTags);
      setValue("tags", updatedTags);
    },
    [setValue]
  );

  const onSubmitForm = async (data) => {
    try {
      let imageUrl = initialData?.imageUrl;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const response = await apiClient.post("/upload/recipe-image", formData);
        imageUrl = response.imageUrl;
      }

      const recipeData = {
        ...data,
        ingredients,
        steps,
        tags,
        imageUrl,
      };

      await onSubmit(recipeData);

      toast({
        title: `Recipe ${isEdit ? "updated" : "created"} successfully!`,
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      logger.error("Recipe form submission error:", error);
      toast({
        title: "Error",
        description: `Failed to ${
          isEdit ? "update" : "create"
        } recipe. Please try again.`,
        status: "error",
        duration: 5000,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmitForm)} width="100%">
      <VStack spacing={6} align="stretch">
        <ImageUpload
          initialImage={initialData?.imageUrl}
          onChange={handleImageChange}
          maxSize={5 * 1024 * 1024} // 5MB
          acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
        />

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <FormControl isInvalid={errors.title}>
            <FormLabel>Recipe Title</FormLabel>
            <Input
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
              placeholder="Enter recipe title"
            />
            <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.category}>
            <FormLabel>Category</FormLabel>
            <Select
              {...register("category", { required: "Category is required" })}
              placeholder="Select category"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
          </FormControl>
        </Grid>

        <FormControl isInvalid={errors.description}>
          <FormLabel>Description</FormLabel>
          <Textarea
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            })}
            placeholder="Write a brief description of your recipe"
            rows={3}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          <FormControl isInvalid={errors.cookingTime}>
            <FormLabel>Cooking Time (minutes)</FormLabel>
            <NumberInput min={5} max={480}>
              <NumberInputField
                {...register("cookingTime", {
                  required: "Cooking time is required",
                  min: {
                    value: 5,
                    message: "Minimum cooking time is 5 minutes",
                  },
                  max: {
                    value: 480,
                    message: "Maximum cooking time is 480 minutes",
                  },
                })}
              />
            </NumberInput>
            <FormErrorMessage>{errors.cookingTime?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.servings}>
            <FormLabel>Servings</FormLabel>
            <NumberInput min={1} max={50}>
              <NumberInputField
                {...register("servings", {
                  required: "Number of servings is required",
                  min: { value: 1, message: "Minimum serving is 1" },
                  max: { value: 50, message: "Maximum serving is 50" },
                })}
              />
            </NumberInput>
            <FormErrorMessage>{errors.servings?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.difficulty}>
            <FormLabel>Difficulty</FormLabel>
            <Select
              {...register("difficulty", {
                required: "Difficulty is required",
              })}
            >
              {DIFFICULTY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.difficulty?.message}</FormErrorMessage>
          </FormControl>
        </Grid>

        <Box>
          <Text mb={2} fontWeight="medium">
            Ingredients
          </Text>
          <IngredientList
            ingredients={ingredients}
            onChange={handleIngredientsChange}
          />
        </Box>

        <Box>
          <Text mb={2} fontWeight="medium">
            Preparation Steps
          </Text>
          <StepsList steps={steps} onChange={handleStepsChange} />
        </Box>

        <FormControl>
          <FormLabel>Tags</FormLabel>
          <TagInput
            tags={tags}
            onChange={handleTagsChange}
            placeholder="Add tags (press enter after each tag)"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          size="lg"
          isLoading={isSubmitting}
          loadingText={isEdit ? "Updating..." : "Creating..."}
        >
          {isEdit ? "Update Recipe" : "Create Recipe"}
        </Button>
      </VStack>
    </Box>
  );
};
