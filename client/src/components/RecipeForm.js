// client/src/components/RecipeForm.js
import { useState } from "react";
import { Box, VStack, HStack, Button, useToast, Text } from "@chakra-ui/react";
import FormField from "./FormField";
import ImageUpload from "./ImageUpload";
import { validateForm } from "../utils/validation";
import CategorySelect from "./CategorySelect";
import { AddIcon } from "@chakra-ui/icons";
import EditableField from "./EditableField";

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
    country: initialData.country || "",
    author: initialData.author || null,
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
  const handleCountryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      country: value,
    }));
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

  const handleImageChange = (imageData) => {
    setFormData((prev) => ({
      ...prev,
      image: imageData,
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
    const cleanedinData = {
      ...formData,
      ingredients: formData.ingredients.filter((item) => item.trim()),
      steps: formData.steps.filter((item) => item.trim()),
    };

    onSubmit(cleanedinData);
  };
  const renderIngredients = () => (
    <VStack align="stretch" spacing={2}>
      <Text fontWeight="bold">Ingredients</Text>
      {formData.ingredients.map((ingredient, index) => (
        <HStack key={index}>
          <FormField
            name={`ingredient-${index}`}
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
            name={`step-${index}`}
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
    <Box
      as="form"
      onSubmit={handleSubmit}
      width="100%"
      fontFamily={"Montserrat"}
    >
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
          name="category"
          id="category"
          value={formData.category}
          onChange={(e) =>
            handleChange({
              target: { name: "category", value: e.target.value },
            })
          }
          error={errors.category}
        />
        <EditableField
          label="Country"
          name="country"
          type="country"
          id="recipe-country"
          value={formData.country}
          onChange={handleCountryChange}
          placeholder="Select country of origin"
          isRecipeForm={true}
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
        </HStack>

        {/* Rest of the form components remain the same */}
        {/* ... ingredients and steps sections ... */}
        {renderIngredients()}
        {renderSteps()}

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
