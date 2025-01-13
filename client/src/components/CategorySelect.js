// client/src/components/CategorySelect.js
import { Select } from "@chakra-ui/react";

const categories = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
];

const CategorySelect = ({ value, onChange }) => {
  return (
    <Select value={value} onChange={onChange} placeholder="Select category">
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </Select>
  );
};

export default CategorySelect;
