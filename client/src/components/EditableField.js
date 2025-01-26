// src/components/EditableField.js
import React, { useState, useEffect } from "react";
import { Flex, Text, Input, IconButton, HStack, Box } from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import CountrySelector from "./CountrySelector"; // Keep this for profile
import CountrySelect from "./CountrySelect"; // Add this for recipes

const EditableField = ({
  label,
  value,
  onSave,
  onChange, // Add this for direct onChange handling
  name,
  id,
  placeholder = "Not set",
  type = "text",
  isRecipeForm,
  // Add this prop to distinguish between profile and recipe form
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  useEffect(() => {
    setEditedValue(value);
  }, [value]);

  const handleSave = async () => {
    try {
      if (type === "country" && editedValue && !isRecipeForm) {
        // For profile country selection, pass the complete country object
        await onSave({
          [name]: {
            code: editedValue.code,
            name: editedValue.name,
            flag: editedValue.flag,
          },
        });
      } else {
        await onSave?.({ [name]: editedValue });
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleCancel = () => {
    setEditedValue(value);
    setIsEditing(false);
  };

  const handleChange = (newValue) => {
    setEditedValue(newValue);
    if (isRecipeForm && onChange) {
      onChange(newValue);
    }
  };

  const renderEditComponent = () => {
    if (type === "country") {
      if (isRecipeForm) {
        return (
          <CountrySelect
            mb={50}
            px={20}
            textAlign="left"
            autoComplete="off"
            value={editedValue}
            onChange={handleChange}
            placeholder={placeholder}
          />
        );
      }
      return (
        <CountrySelector
          autoComplete="off"
          value={editedValue?.code || editedValue}
          onChange={(country) => handleChange(country)}
          isEditing={isEditing}
        />
      );
    }

    return (
      <Input
        value={editedValue || ""}
        name={name}
        id={id}
        autoComplete="on"
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  };

  // If it's a recipe form, just render the CountrySelect
  if (isRecipeForm && type === "country") {
    return (
      <Box width="100%">
        <Text fontSize="m" mb={2} textAlign="left">
          {label}
        </Text>
        <CountrySelect
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          color="gray.600"
        />
      </Box>
    );
  }

  return (
    <Flex
      direction="row"
      justify="space-between"
      align="center"
      w="100%"
      py={2}
    >
      <Box flex="1">
        <Text fontWeight="bold" fontSize="sm" color="gray.600">
          {label}
        </Text>
        {isEditing ? (
          renderEditComponent()
        ) : type === "country" ? (
          <CountrySelector
            value={value?.code || value}
            isEditing={false}
            onChange={() => {}} // Add empty onChange for non-editing mode
          />
        ) : (
          <Text>{value || placeholder}</Text>
        )}
      </Box>
      <Box ml={4}>
        {isEditing ? (
          <HStack spacing={2}>
            <IconButton
              size="sm"
              icon={<CheckIcon />}
              colorScheme="green"
              onClick={handleSave}
            />
            <IconButton
              size="sm"
              icon={<CloseIcon />}
              colorScheme="red"
              onClick={handleCancel}
            />
          </HStack>
        ) : (
          <IconButton
            size="sm"
            icon={<EditIcon />}
            onClick={() => setIsEditing(true)}
          />
        )}
      </Box>
    </Flex>
  );
};

export default EditableField;
