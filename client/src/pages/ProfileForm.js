// src/pages/ProfileForm.js
import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

const ProfileForm = ({ onSubmit, initialValues = {} }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    onSubmit(data);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            defaultValue={initialValues.name}
            placeholder="Your name"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            defaultValue={initialValues.email}
            placeholder="your.email@example.com"
          />
        </FormControl>

        <Button type="submit" colorScheme="blue" width="full">
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
};

export default ProfileForm;
