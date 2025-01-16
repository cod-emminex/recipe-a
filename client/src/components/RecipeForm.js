// client/src/components/RecipeForm.js
import { useState } from "react";
import { Box, VStack, HStack, Button, useToast } from "@chakra-ui/react";
import FormField from "./FormField";
import ImageUpload from "./ImageUpload";
import { validateForm } from "../utils/validation";
import CategorySelect from "./CategorySelect";

const RecipeForm = ({ initialData = {}, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    ingredients: initialData.ingredients || [""],
    steps: initialData.steps || [""],
    category: initialData.category || "",
    image: initialData.image || null,
    cookingTime: initialData.cookingTime || "",
    servings: initialData.servings || "",
    difficulty: initialData.difficulty || "medium",
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveItem = (index, field) => {
    if (formData[field].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const handleImageChange = (image) => {
    setFormData((prev) => ({
      ...prev,
      image,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData, "recipe");
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Validation Error",
        description: "Please check all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Filter out empty ingredients and steps
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter((item) => item.trim()),
      steps: formData.steps.filter((item) => item.trim()),
    };

    onSubmit(cleanedData);
  };
  const renderIngredients = () => (
    <VStack align="stretch" spacing={2}>
      <Text fontWeight="bold">Ingredients</Text>
      {formData.ingredients.map((ingredient, index) => (
        <HStack key={index}>
          <FormField
            value={ingredient}
            onChange={(e) =>
              handleArrayChange(index, "ingredients", e.target.value)
            }
            placeholder="Add ingredient"
          />
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => handleRemoveItem(index, "ingredients")}
          >
            Remove
          </Button>
        </HStack>
      ))}
      <Button
        size="sm"
        leftIcon={<AddIcon />}
        onClick={() => handleAddItem("ingredients")}
      >
        Add Ingredient
      </Button>
    </VStack>
  );

  const renderSteps = () => (
    <VStack align="stretch" spacing={2}>
      <Text fontWeight="bold">Steps</Text>
      {formData.steps.map((step, index) => (
        <HStack key={index}>
          <FormField
            value={step}
            onChange={(e) => handleArrayChange(index, "steps", e.target.value)}
            placeholder={`Step ${index + 1}`}
            isTextarea
          />
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => handleRemoveItem(index, "steps")}
          >
            Remove
          </Button>
        </HStack>
      ))}
      <Button
        size="sm"
        leftIcon={<AddIcon />}
        onClick={() => handleAddItem("steps")}
      >
        Add Step
      </Button>
    </VStack>
  );
  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={6} align="stretch">
        <ImageUpload
          initialImage={formData.image}
          onImageChange={handleImageChange}
        />

        <FormField
          name="title"
          label="Recipe Title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Enter recipe title"
        />

        <FormField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="Describe your recipe"
          isTextarea
        />

        <CategorySelect
          value={formData.category}
          onChange={(e) =>
            handleChange({
              target: { name: "category", value: e.target.value },
            })
          }
          error={errors.category}
        />

        <HStack spacing={4}>
          <FormField
            name="cookingTime"
            label="Cooking Time (minutes)"
            type="number"
            value={formData.cookingTime}
            onChange={handleChange}
            error={errors.cookingTime}
          />

          <FormField
            name="servings"
            label="Servings"
            type="number"
            value={formData.servings}
            onChange={handleChange}
            error={errors.servings}
          />
        </HStack>

        {/* Rest of the form components remain the same */}
        {/* ... ingredients and steps sections ... */}

        <Button
          type="submit"
          colorScheme="teal"
          size="lg"
          isLoading={isLoading}
          loadingText="Saving..."
        >
          {initialData.title ? "Update Recipe" : "Create Recipe"}
        </Button>
      </VStack>
    </Box>
  );
};

export default RecipeForm;
