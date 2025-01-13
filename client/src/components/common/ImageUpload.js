// client/src/components/common/ImageUpload.js
import React, { useCallback, useState } from 'react';
import {
  Box,
  Image,
  Input,
  Text,
  VStack,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { MdCloudUpload } from 'react-icons/md';

export const ImageUpload = ({
  initialImage,
  onChange,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
}) => {
  const [preview, setPreview] = useState(initialImage);
  const toast = useToast();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!acceptedFormats.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, or WebP image.',
        status: 'error',
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: `Image must be less than ${maxSize / (1024 * 1024)}MB`,
        status: 'error',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onChange(file);
    };
    reader.readAsDataURL(file);
  }, [acceptedFormats, maxSize, onChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.join(','),
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      borderWidth={2}
      borderStyle="dashed"
      borderRadius="md"
      p={6}
      cursor="pointer"
      bg={isDragActive ? 'gray.50' : 'white'}
      _hover={{ bg: 'gray.50' }}
      transition="background-color 0.2s"
    >
      <Input {...getInputProps()} />
      {preview ? (
        <Image
          src={preview}
          alt="Recipe preview"
          maxH="300px"
          mx="auto"
          objectFit="contain"
        />
      ) : (
        <VStack spacing={2}>
          <Icon as={MdCloudUpload} w={12} h={12} color="gray.400" />
          <Text color="gray.500" textAlign="center">
            {isDragActive
              ? 'Drop the image here...'
              : 'Drag and drop an image, or click to select'}
          </Text>
          <Text color="gray.400" fontSize="sm">
            JPEG, PNG, or WebP, max {maxSize / (1024 * 1024)}MB
          </Text>
        </VStack>
      )}
    </Box>
  );
};
