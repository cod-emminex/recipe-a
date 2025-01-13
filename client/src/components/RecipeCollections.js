// client/src/components/RecipeCollections.js
import {
  VStack,
  Box,
  Heading,
  Button,
  Input,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast,
  Text,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { userAPI } from "../services/api";
import RecipeCard from "./RecipeCard";

const RecipeCollections = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await userAPI.getCollections();
      setCollections(response.data);
    } catch (error) {
      toast({
        title: "Error fetching collections",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateCollection = async () => {
    try {
      const response = await userAPI.createCollection({
        name: newCollectionName,
      });
      setCollections([...collections, response.data]);
      setNewCollectionName("");
      onClose();
      toast({
        title: "Collection created",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error creating collection",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    try {
      await userAPI.deleteCollection(collectionId);
      setCollections(collections.filter((c) => c._id !== collectionId));
      toast({
        title: "Collection deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting collection",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">My Collections</Heading>
          <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen}>
            New Collection
          </Button>
        </HStack>

        {collections.map((collection) => (
          <Box
            key={collection._id}
            p={4}
            borderWidth={1}
            borderRadius="md"
            shadow="sm"
          >
            <HStack justify="space-between" mb={4}>
              <Heading size="md">{collection.name}</Heading>
              <HStack>
                <IconButton
                  icon={<EditIcon />}
                  onClick={() => setSelectedCollection(collection)}
                  variant="ghost"
                />
                <IconButton
                  icon={<DeleteIcon />}
                  onClick={() => handleDeleteCollection(collection._id)}
                  variant="ghost"
                  colorScheme="red"
                />
              </HStack>
            </HStack>

            {collection.recipes.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {collection.recipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} compact />
                ))}
              </SimpleGrid>
            ) : (
              <Text color="gray.500">No recipes in this collection</Text>
            )}
          </Box>
        ))}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Collection</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleCreateCollection}
              isDisabled={!newCollectionName.trim()}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RecipeCollections;
