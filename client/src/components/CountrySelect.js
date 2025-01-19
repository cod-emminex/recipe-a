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
    ? [{ code: "all", name: "All" }].concat(countries)
    : countries;

  return (
    <Select
      value={value || ""}
      onChange={handleChange}
      placeholder={placeholder}
      fontFamily="Montserrat"
    >
      {options.map((country) => (
        <option
          key={country.code}
          value={country.code === "all" ? "all" : country.name}
        >
          {country.name}
        </option>
      ))}
    </Select>
  );
};

export default CountrySelect;
