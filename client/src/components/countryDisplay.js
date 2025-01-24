// src/components/CountryDisplay.js
import React from "react";
import { HStack, Text } from "@chakra-ui/react";
import { getCountryData } from "../utils/countryHelper";

const CountryDisplay = ({ country, showLabel = true }) => {
  if (!country) return null;

  const countryData = getCountryData(country);

  if (!countryData) return <Text>{country}</Text>;

  return (
    <HStack spacing={2}>
      {showLabel && <Text>Country:</Text>}
      <Text>{countryData.flag}</Text>
      <Text>{countryData.name}</Text>
    </HStack>
  );
};

export default CountryDisplay;
