// client/src/components/ProfileForm.js
import { useState } from "react";
import { VStack, Button, useToast } from "@chakra-ui/react";
import FormField from "./FormField";
import { userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProfileForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userAPI.updateProfile(formData);
      toast({
        title: "Profile updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={6} align="stretch">
      <FormField
        name="username"
        label="Username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
      />

      <FormField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      <Button
        type="submit"
        colorScheme="teal"
        size="lg"
        isLoading={isLoading}
        loadingText="Updating..."
      >
        Update Profile
      </Button>
    </VStack>
  );
};

export default ProfileForm;
