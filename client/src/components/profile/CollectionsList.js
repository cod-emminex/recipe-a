// client/src/components/profile/CollectionsList.js
import React, { useState } from "react";
import {
  VStack,
  HStack,
  Box,
  Image,
  Text,
  Button,
  Grid,
  useDisclosure,
  Icon,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import { FaLock, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export const CollectionsList = ({
  collections,
  isOwnProfile,
  onCollectionClick,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingCollection, setEditingCollection] = useState(null);

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    onOpen();
  };

  return (
    <>
      {isOwnProfile && (
        <Button
          leftIcon={<FaPlus />}
          colorScheme="teal"
          mb={6}
          onClick={() => {
            setEditingCollection(null);
            onOpen();
          }}
        >
          New Collection
        </Button>
      )}

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            isOwnProfile={isOwnProfile}
            onClick={() => onCollectionClick(collection.id)}
            onEdit={() => handleEdit(collection)}
          />
        ))}
      </Grid>

      <CollectionModal
        isOpen={isOpen}
        onClose={onClose}
        collection={editingCollection}
      />
    </>
  );
};

const CollectionCard = ({ collection, isOwnProfile, onClick, onEdit }) => (
  <Box
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    cursor="pointer"
    transition="transform 0.2s"
    _hover={{ transform: "translateY(-4px)" }}
  >
    <Box position="relative" onClick={onClick}>
      <Image
        src={collection.coverImage || "/default-collection.jpg"}
        alt={collection.name}
        height="200px"
        width="100%"
        objectFit="cover"
      />
      {collection.isPrivate && (
        <Icon as={FaLock} position="absolute" top={4} right={4} color="white" />
      )}
    </Box>

    <Box p={4}>
      <HStack justify="space-between" mb={2}>
        <Text fontWeight="bold" fontSize="lg">
          {collection.name}
        </Text>
        {isOwnProfile && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Icon as={FaEdit} />
          </Button>
        )}
      </HStack>

      <Text color="gray.600" noOfLines={2} mb={2}>
        {collection.description}
      </Text>

      <HStack>
        <Badge colorScheme="teal">{collection.recipeCount} recipes</Badge>
        {collection.isPrivate && <Badge colorScheme="purple">Private</Badge>}
      </HStack>
    </Box>
  </Box>
);

const CollectionModal = ({ isOpen, onClose, collection }) => {
  const [formData, setFormData] = useState({
    name: collection?.name || "",
    description: collection?.description || "",
    isPrivate: collection?.isPrivate || false,
  });

  const handleSave = async () => {
    try {
      if (collection) {
        // Update existing collection
        await apiClient.put(`/collections/${collection.id}`, formData);
      } else {
        // Create new collection
        await apiClient.post("/collections", formData);
      }
      onClose();
      // Trigger refresh of collections
    } catch (error) {
      logger.error("Error saving collection:", error);
      toast({
        title: "Error",
        description: "Failed to save collection",
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {collection ? "Edit Collection" : "New Collection"}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Collection name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe your collection"
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Private Collection</FormLabel>
              <Switch
                isChecked={formData.isPrivate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPrivate: e.target.checked,
                  }))
                }
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="teal" onClick={handleSave}>
            {collection ? "Save Changes" : "Create Collection"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
