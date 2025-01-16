// src/components/EditableField.js
import React, { useState, useEffect } from "react";
import { Flex, Text, Input, IconButton, HStack, Box } from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import CountrySelector from "./CountrySelector";

const EditableField = ({
  label,
  value,
  onSave,
  name,
  placeholder = "Not set",
  type = "text",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  useEffect(() => {
    setEditedValue(value);
  }, [value]);

  const handleSave = async () => {
    try {
      if (type === "country" && editedValue) {
        // For country selection, pass the complete country object
        await onSave({
          [name]: {
            code: editedValue.code,
            name: editedValue.name,
            flag: editedValue.flag,
          },
        });
      } else {
        await onSave({ [name]: editedValue });
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

  const renderEditComponent = () => {
    if (type === "country") {
      return (
        <CountrySelector
          value={editedValue?.code || editedValue}
          onChange={(country) => setEditedValue(country)}
          isEditing={isEditing}
        />
      );
    }

    return (
      <Input
        value={editedValue || ""}
        onChange={(e) => setEditedValue(e.target.value)}
        placeholder={placeholder}
      />
    );
  };

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
