// src/components/common/ImageUpload.js
import React from "react";
import { Box, Button, Text, VStack, Image, useToast } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { MdCloudUpload } from "react-icons/md";

const ImageUpload = ({ onImageUpload, initialImage }) => {
  const toast = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast({
          title: "Error",
          description: "File must be an image under 5MB",
          status: "error",
          duration: 3000,
        });
        return;
      }

      const file = acceptedFiles[0];
      onImageUpload(file);
    },
  });

  return (
    <Box>
      <VStack spacing={4}>
        {initialImage && (
          <Image
            src={
              typeof initialImage === "string"
                ? initialImage
                : URL.createObjectURL(initialImage)
            }
            alt="Uploaded preview"
            boxSize="200px"
            objectFit="cover"
            borderRadius="md"
          />
        )}

        <Box
          {...getRootProps()}
          p={6}
          border="2px dashed"
          borderColor={isDragActive ? "blue.400" : "gray.200"}
          borderRadius="md"
          bg={isDragActive ? "blue.50" : "gray.50"}
          cursor="pointer"
          w="100%"
        >
          <input {...getInputProps()} data-testid="file-input" />
          <VStack spacing={2}>
            <MdCloudUpload size="2em" />
            <Text textAlign="center">
              {isDragActive
                ? "Drop the image here"
                : "Drag and drop an image, or click to select"}
            </Text>
            <Button size="sm" variant="outline">
              Select Image
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ImageUpload;
