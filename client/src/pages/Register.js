// client/src/pages/Register.js
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  useToast,
  VStack,
  Divider,
} from "@chakra-ui/react";
import FormField from "../components/FormField";
import { useAuth } from "../context/AuthContext";
import { validateForm } from "../utils/validation";
import { authAPI } from "../services/api";
import PageTitle from "../components/PageTitle";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Add profile fields
    name: "",
    bio: "",
    country: "",
    bestRecipe: "",
    favoriteCuisine: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData, "register");
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Register with all profile fields
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        // Include profile fields
        name: formData.name,
        bio: formData.bio,
        country: formData.country,
        bestRecipe: formData.bestRecipe,
        favoriteCuisine: formData.favoriteCuisine,
      });

      // If registration successful, login automatically
      await login(formData.email, formData.password);

      toast({
        title: "Registration successful",
        description: `Welcome to Recipe Haven, ${
          formData.name || formData.username
        }!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
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
    <Container maxW="container.sm" py={10} fontFamily="Montserrat">
      <PageTitle title="Register" />
      <VStack spacing={8}>
        <Heading fontFamily="Montserrat">Create an Account</Heading>

        <Box as="form" w="100%" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Text fontSize="lg" fontWeight="bold" alignSelf="start">
              Account Information
            </Text>

            <FormField
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              isRequired
            />

            <FormField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              isRequired
            />

            <FormField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              isRequired
            />

            <FormField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              isRequired
            />

            <Divider my={4} />

            <Text fontSize="lg" fontWeight="bold" alignSelf="start">
              Profile Information
            </Text>

            <FormField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              isRequired
            />

            <FormField
              name="bio"
              label="Bio"
              type="textarea"
              value={formData.bio}
              onChange={handleChange}
              error={errors.bio}
              placeholder="Tell us about yourself..."
              isRequired
            />

            <FormField
              name="country"
              label="Country"
              type="country"
              value={formData.country}
              onChange={handleChange}
              error={errors.country}
            />

            <FormField
              name="bestRecipe"
              label="Best Recipe"
              value={formData.bestRecipe}
              onChange={handleChange}
              error={errors.bestRecipe}
              placeholder="What food do you love cooking most?"
              isRequired
            />

            <FormField
              name="favoriteCuisine"
              label="Favorite Cuisine"
              value={formData.favoriteCuisine}
              onChange={handleChange}
              error={errors.favoriteCuisine}
              placeholder="What type of food do you love eating most?"
            />

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              w="100%"
              isLoading={isLoading}
              loadingText="Creating account..."
            >
              Register
            </Button>
          </VStack>
        </Box>

        <Text>
          Already have an account?{" "}
          <RouterLink to="/login" style={{ color: "teal" }}>
            Login here
          </RouterLink>
        </Text>
      </VStack>
    </Container>
  );
};

export default Register;
