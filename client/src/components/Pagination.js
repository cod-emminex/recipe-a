// client/src/components/Pagination.js
import { HStack, Button, Text } from "@chakra-ui/react";

const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <HStack spacing={2} justify="center" py={4}>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1 || isLoading}
      >
        Previous
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          colorScheme={currentPage === page ? "teal" : "gray"}
          isDisabled={isLoading}
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages || isLoading}
      >
        Next
      </Button>
    </HStack>
  );
};

export default Pagination;
