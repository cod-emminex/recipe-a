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
  "Others",
];

const CategorySelect = ({
  value,
  onChange,
  name = "category",
  id = "category",
}) => {
  return (
    <Select
      value={value}
      name={name}
      id={id}
      onChange={onChange}
      placeholder="Select category"
    >
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </Select>
  );
};

export default CategorySelect;
