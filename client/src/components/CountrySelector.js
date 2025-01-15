// src/components/CountrySelector.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  Text,
  Portal,
  VStack,
  HStack,
} from "@chakra-ui/react";
import countries from "../utils/countries";

const CountrySelector = ({ value, onChange, isEditing }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Find and set the selected country when value changes
  useEffect(() => {
    if (value) {
      const country = countries.find((c) => c.code === value);
      setSelectedCountry(country);
    }
  }, [value]);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (country) => {
    setSelectedCountry(country);
    onChange(country);
    setIsOpen(false);
    setSearch("");
  };

  if (!isEditing) {
    return (
      <HStack>
        <Text>{selectedCountry ? selectedCountry.flag : "🏳️"}</Text>
        <Text>{selectedCountry ? selectedCountry.name : "Not set"}</Text>
      </HStack>
    );
  }

  return (
    <Box position="relative">
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        placeholder="Search country..."
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <Portal>
          <List
            position="fixed"
            zIndex={1000}
            bg="white"
            borderWidth="1px"
            borderRadius="md"
            maxH="200px"
            overflowY="auto"
            w="300px"
            boxShadow="lg"
          >
            <VStack align="stretch" spacing={0}>
              {filteredCountries.map((country) => (
                <ListItem
                  key={`${country.code}-${country.name}`} // Updated unique key
                  p={2}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => handleSelect(country)}
                >
                  <HStack>
                    <Text>{country.flag}</Text>
                    <Text>{country.name}</Text>
                  </HStack>
                </ListItem>
              ))}
            </VStack>
          </List>
        </Portal>
      )}
    </Box>
  );
};

export default CountrySelector;
