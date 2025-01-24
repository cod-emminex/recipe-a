// src/components/CountrySelect.js
import React from "react";
import { Select } from "@chakra-ui/react";
import countries from "../utils/countries";

const CountrySelect = ({
  name = "country",
  id = "country",
  value,
  onChange,
  placeholder,
  includeAll = false,
  autoComplete = "country",
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const options = includeAll
    ? [{ code: "all", name: "All" }].concat(countries)
    : countries;

  return (
    <Select
      name={name}
      id={id}
      value={value || ""}
      onChange={handleChange}
      placeholder={placeholder}
      fontFamily="Montserrat"
      autoComplete={autoComplete}
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
