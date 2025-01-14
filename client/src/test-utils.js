// client/src/test-utils.js
import React from "react";
import { render } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MockAuthProvider } from "./__mocks__/authContext";

const AllTheProviders = ({ children }) => {
  return (
    <ChakraProvider>
      <MockAuthProvider>{children}</MockAuthProvider>
    </ChakraProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
