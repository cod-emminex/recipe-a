// src/components/CountrySelect.js
import React from "react";
import { Select } from "@chakra-ui/react";
import countries from "../utils/countries";

const CountrySelect = ({
  value,
  onChange,
  placeholder,
  includeAll = false,
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const options = includeAll
    ? [{ code: "all", name: "All", flag: "" }, ...countries]
    : countries;

  return (
    <Select
      name="country"
      id="country"
      value={value || ""}
      onChange={handleChange}
      placeholder={placeholder}
      fontFamily="Montserrat"
      autoComplete="on"
    >
      {options.map((country) => (
        <option
          key={country.code}
          value={country.code === "all" ? "all" : country.name}
        >
          {`${country.flag} ${country.name}`}
        </option>
      ))}
    </Select>
  );
};

export default CountrySelect;
