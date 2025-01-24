// client/src/components/FormField.js
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";

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
  const InputComponent = isTextarea ? Textarea : Input;

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
