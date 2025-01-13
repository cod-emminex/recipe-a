// client/src/components/AdvancedSearch.js
import {
  Box,
  VStack,
  HStack,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Checkbox,
  Button,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useState } from "react";

const AdvancedSearch = ({ onFilter }) => {
  const { isOpen, onToggle } = useDisclosure();
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    cookingTime: [0, 180],
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
    },
    rating: 0,
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDietaryChange = (field) => {
    setFilters((prev) => ({
      ...prev,
      dietary: {
        ...prev.dietary,
        [field]: !prev.dietary[field],
      },
    }));
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      difficulty: "",
      cookingTime: [0, 180],
      dietary: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
      },
      rating: 0,
    });
    onFilter(null);
  };

  return (
    <Box mb={6}>
      <Button
        rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        onClick={onToggle}
        variant="ghost"
        width="100%"
        mb={2}
      >
        Advanced Filters
      </Button>

      <Collapse in={isOpen}>
        <VStack
          spacing={4}
          align="stretch"
          p={4}
          bg="gray.50"
          borderRadius="md"
        >
          <HStack spacing={4}>
            <Box flex={1}>
              <Text mb={2}>Category</Text>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="dessert">Dessert</option>
                <option value="snack">Snack</option>
              </Select>
            </Box>

            <Box flex={1}>
              <Text mb={2}>Difficulty</Text>
              <Select
                value={filters.difficulty}
                onChange={(e) =>
                  handleFilterChange("difficulty", e.target.value)
                }
              >
                <option value="">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
            </Box>
          </HStack>

          <Box>
            <Text mb={2}>Cooking Time (minutes)</Text>
            <RangeSlider
              value={filters.cookingTime}
              onChange={(val) => handleFilterChange("cookingTime", val)}
              min={0}
              max={180}
              step={15}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
            <Text fontSize="sm" textAlign="center">
              {filters.cookingTime[0]} - {filters.cookingTime[1]} minutes
            </Text>
          </Box>

          <Box>
            <Text mb={2}>Dietary Preferences</Text>
            <HStack spacing={4} wrap="wrap">
              <Checkbox
                isChecked={filters.dietary.vegetarian}
                onChange={() => handleDietaryChange("vegetarian")}
              >
                Vegetarian
              </Checkbox>
              <Checkbox
                isChecked={filters.dietary.vegan}
                onChange={() => handleDietaryChange("vegan")}
              >
                Vegan
              </Checkbox>
              <Checkbox
                isChecked={filters.dietary.glutenFree}
                onChange={() => handleDietaryChange("glutenFree")}
              >
                Gluten-Free
              </Checkbox>
              <Checkbox
                isChecked={filters.dietary.dairyFree}
                onChange={() => handleDietaryChange("dairyFree")}
              >
                Dairy-Free
              </Checkbox>
            </HStack>
          </Box>

          <HStack spacing={4} justify="flex-end">
            <Button variant="ghost" onClick={resetFilters}>
              Reset
            </Button>
            <Button colorScheme="teal" onClick={applyFilters}>
              Apply Filters
            </Button>
          </HStack>
        </VStack>
      </Collapse>
    </Box>
  );
};

export default AdvancedSearch;
