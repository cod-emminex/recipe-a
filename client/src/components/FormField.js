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
        onChange={onChange}
        {...props}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormField;
