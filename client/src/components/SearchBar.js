// client/src/components/SearchBar.js
import React from "react";
import {
  InputGroup,
  Input,
  InputRightElement,
  Icon,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const SearchBar = ({ onSearch, placeholder = "Search recipes..." }) => {
  return (
    <Box maxW="600px" w="full" mx="auto" my={6}>
      <InputGroup size="lg">
        <Input
          fontFamily="Poppins"
          placeholder={placeholder}
          borderRadius="full"
          bg="white"
          border="2px"
          borderColor="teal.500"
          _hover={{
            borderColor: "teal.600",
          }}
          _focus={{
            borderColor: "teal.700",
            boxShadow: "0 0 0 1px var(--chakra-colors-teal-700)",
          }}
          onChange={(e) => onSearch(e.target.value)}
        />
        <InputRightElement>
          <Icon as={SearchIcon} color="teal.500" />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
