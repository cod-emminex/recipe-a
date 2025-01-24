// client/src/components/FormField.js
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";

const FormField = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  error,
  isTextarea = false,
  autoComplete = "on",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const InputComponent = isTextarea ? Textarea : Input;

  const handleTogglePassword = () => setShowPassword(!showPassword);

  // Render password input with toggle
  if (type === "password") {
    return (
      <FormControl isInvalid={!!error} mb={4}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <InputGroup>
          <Input
            id={name}
            name={name}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            fontFamily="Montserrat"
            autoComplete={autoComplete}
            {...props}
          />
          <InputRightElement>
            <IconButton
              aria-label={showPassword ? "Hide password" : "Show password"}
              h="1.75rem"
              size="sm"
              onClick={handleTogglePassword}
              icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
              variant="ghost"
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
              color="gray.500"
            />
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    );
  }

  // Render regular input or textarea
  return (
    <FormControl isInvalid={!!error} mb={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <InputComponent
        id={name}
        name={name}
        type={type}
        value={value}
        fontFamily="Montserrat"
        onChange={onChange}
        autoComplete={autoComplete}
        {...props}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormField;
