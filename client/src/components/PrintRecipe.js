// client/src/components/PrintRecipe.js
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  List,
  ListItem,
  Image,
} from "@chakra-ui/react";
import { PrintIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const PrintRecipe = ({ recipe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => setIsOpen(false),
  });

  return (
    <>
      <Button
        leftIcon={<PrintIcon />}
        onClick={() => setIsOpen(true)}
        colorScheme="teal"
        variant="outline"
      >
        Print Recipe
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Print Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box ref={printRef} p={6}>
              <VStack spacing={6} align="stretch">
                {recipe.image && (
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    maxH="300px"
                    objectFit="cover"
                  />
                )}

                <Box>
                  <Text fontSize="2xl" fontWeight="bold">
                    {recipe.title}
                  </Text>
                  <Text color="gray.600">{recipe.description}</Text>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" mb={2}>
                    Ingredients
                  </Text>
                  <List spacing={2}>
                    {recipe.ingredients.map((ingredient, index) => (
                      <ListItem key={index}>• {ingredient}</ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Text fontSize="xl" fontWeight="bold" mb={2}>
                    Instructions
                  </Text>
                  <List spacing={4}>
                    {recipe.steps.map((step, index) => (
                      <ListItem key={index}>
                        <Text as="span" fontWeight="bold">
                          {index + 1}.{" "}
                        </Text>
                        {step}
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box mt={4}>
                  <Text fontSize="sm" color="gray.500">
                    Recipe from Recipe-A • {new Date().toLocaleDateString()}
                  </Text>
                </Box>
              </VStack>
            </Box>

            <Button
              onClick={handlePrint}
              colorScheme="teal"
              width="100%"
              my={4}
            >
              Print
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PrintRecipe;
