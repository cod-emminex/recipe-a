// src/components/CountrySelector.js
import React, { useState, useEffect, useRef } from "react";
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

const CountrySelector = ({
  name = "country",
  id = "country",
  value,
  onChange,
  isEditing,
  autoComplete = "off",
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const inputRef = useRef(null);

  // Find and set the selected country when value changes or on mount
  useEffect(() => {
    if (value) {
      const country =
        typeof value === "string"
          ? countries.find((c) => c.code === value)
          : countries.find((c) => c.code === value.code);
      setSelectedCountry(country);
    }
  }, [value]);

  const filteredCountries = search
    ? countries.filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase())
      )
    : countries;

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setSearch(country.name); // Update the input field with selected country name
    onChange(country);
    setIsOpen(false);
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
    <Box position="relative" width="100%">
      <Input
        ref={inputRef}
        name={name}
        id={id}
        value={
          selectedCountry
            ? `${selectedCountry.flag} ${selectedCountry.name}`
            : search
        }
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedCountry(null); // Clear selection when user types
          setIsOpen(true);
        }}
        placeholder="Search country..."
        autoComplete={autoComplete}
        onFocus={() => setIsOpen(true)}
        onClick={() => setIsOpen(true)}
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
            w={inputRef.current ? inputRef.current.offsetWidth : "300px"}
            left={
              inputRef.current
                ? inputRef.current.getBoundingClientRect().left
                : 0
            }
            top={
              inputRef.current
                ? inputRef.current.getBoundingClientRect().bottom
                : 0
            }
            boxShadow="lg"
          >
            <VStack align="stretch" spacing={0}>
              {filteredCountries.map((country) => (
                <ListItem
                  key={country.code}
                  p={2}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => handleSelect(country)}
                  bg={
                    selectedCountry?.code === country.code
                      ? "gray.100"
                      : "transparent"
                  }
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
