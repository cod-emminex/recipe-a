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
} from "@chakra-ui/react";
import FormField from "../components/FormField";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { validateForm } from "../utils/validation";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
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
      const response = await authAPI.register(formData);
      login(response.data.token, response.data.user);

      toast({
        title: "Registration successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");
    } catch (error) {
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
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8}>
        <Heading>Create an Account</Heading>

        <Box as="form" w="100%" onSubmit={handleSubmit}>
          <VStack spacing={4}>
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

            <FormField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              w="100%"
              isLoading={isLoading}
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
