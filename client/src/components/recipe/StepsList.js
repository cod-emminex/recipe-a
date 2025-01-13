// client/src/components/recipe/StepsList.js
import React, { useState } from "react";
import {
  VStack,
  Textarea,
  IconButton,
  List,
  ListItem,
  Text,
  Button,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, DragHandleIcon } from "@chakra-ui/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const StepsList = ({ steps, onChange }) => {
  const [newStep, setNewStep] = useState("");

  const handleAdd = () => {
    if (newStep.trim()) {
      onChange([...steps, newStep.trim()]);
      setNewStep("");
    }
  };

  const handleRemove = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  return (
    <VStack spacing={4} align="stretch">
      <Flex direction="column">
        <Textarea
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          placeholder="Describe this step..."
          rows={3}
          mb={2}
        />
        <Button
          leftIcon={<AddIcon />}
          onClick={handleAdd}
          colorScheme="teal"
          alignSelf="flex-end"
        >
          Add Step
        </Button>
      </Flex>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="steps">
          {(provided) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              spacing={4}
            >
              {steps.map((step, index) => (
                <Draggable
                  key={`step-${index}`}
                  draggableId={`step-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      p={4}
                      bg="gray.50"
                      borderRadius="md"
                      boxShadow="sm"
                    >
                      <Flex align="center" mb={2}>
                        <IconButton
                          {...provided.dragHandleProps}
                          icon={<DragHandleIcon />}
                          variant="ghost"
                          size="sm"
                          mr={2}
                          aria-label="Drag handle"
                        />
                        <Badge colorScheme="teal">Step {index + 1}</Badge>
                        <IconButton
                          icon={<DeleteIcon />}
                          onClick={() => handleRemove(index)}
                          variant="ghost"
                          colorScheme="red"
                          size="sm"
                          ml="auto"
                          aria-label="Remove step"
                        />
                      </Flex>
                      <Text pl={10}>{step}</Text>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </VStack>
  );
};
