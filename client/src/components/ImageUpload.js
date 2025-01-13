// client/src/components/ImageUpload.js
import { useState, useRef } from "react";
import {
  Box,
  Button,
  Image,
  VStack,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const ImageUpload = ({ initialImage, onImageChange }) => {
  const [preview, setPreview] = useState(initialImage);
  const fileInputRef = useRef();
  const toast = useToast();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange(null);
    fileInputRef.current.value = "";
  };

  return (
    <VStack spacing={4} align="center">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      {preview ? (
        <Box position="relative">
          <Image
            src={preview}
            alt="Recipe preview"
            maxH="200px"
            objectFit="cover"
            borderRadius="md"
          />
          <IconButton
            icon={<DeleteIcon />}
            position="absolute"
            top={2}
            right={2}
            colorScheme="red"
            onClick={handleRemoveImage}
            size="sm"
          />
        </Box>
      ) : (
        <Button onClick={() => fileInputRef.current.click()}>
          Upload Image
        </Button>
      )}
    </VStack>
  );
};

export default ImageUpload;
