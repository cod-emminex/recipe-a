// client/src/components/common/TagInput.js
import React, { useState } from "react";
import {
  Box,
  Input,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";

export const TagInput = ({ tags, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue("");
    }
  };

  const handleRemove = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Box>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        mb={2}
      />
      <Wrap spacing={2}>
        {tags.map((tag) => (
          <WrapItem key={tag}>
            <Tag
              size="md"
              borderRadius="full"
              variant="solid"
              colorScheme="teal"
            >
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={() => handleRemove(tag)} />
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};
