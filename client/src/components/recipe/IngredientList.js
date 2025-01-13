// client/src/components/recipe/IngredientList.js
import React, { useState } from "react";
import {
  VStack,
  HStack,
  Input,
  IconButton,
  List,
  ListItem,
  Text,
  Button,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, DragHandleIcon } from "@chakra-ui/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const IngredientList = ({ ingredients, onChange }) => {
  const [newIngredient, setNewIngredient] = useState("");

  const handleAdd = () => {
    if (newIngredient.trim()) {
      onChange([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemove = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(ingredients);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack>
        <Input
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          placeholder="Enter ingredient"
          onKeyPress={(e) => e.key === "Enter" && handleAdd()}
        />
        <IconButton
          icon={<AddIcon />}
          onClick={handleAdd}
          colorScheme="teal"
          aria-label="Add ingredient"
        />
      </HStack>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ingredients">
          {(provided) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              spacing={2}
            >
              {ingredients.map((ingredient, index) => (
                <Draggable
                  key={`${ingredient}-${index}`}
                  draggableId={`${ingredient}-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      display="flex"
                      alignItems="center"
                      p={2}
                      bg="gray.50"
                      borderRadius="md"
                    >
                      <IconButton
                        {...provided.dragHandleProps}
                        icon={<DragHandleIcon />}
                        variant="ghost"
                        size="sm"
                        mr={2}
                        aria-label="Drag handle"
                      />
                      <Text flex={1}>{ingredient}</Text>
                      <IconButton
                        icon={<DeleteIcon />}
                        onClick={() => handleRemove(index)}
                        variant="ghost"
                        colorScheme="red"
                        size="sm"
                        aria-label="Remove ingredient"
                      />
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
