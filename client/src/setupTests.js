// client/src/setupTests.js
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import React from "react";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Chakra UI
jest.mock("@chakra-ui/react", () => ({
  ChakraProvider: ({ children }) => children,
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Heading: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  Text: ({ children, ...props }) => <p {...props}>{children}</p>,
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  Stack: ({ children, ...props }) => <div {...props}>{children}</div>,
  Container: ({ children, ...props }) => <div {...props}>{children}</div>,
  useToast: () => ({ toast: jest.fn() }),
  useDisclosure: () => ({
    isOpen: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
  }),
}));

// Mock Chakra Icons
jest.mock("@chakra-ui/icons", () => ({
  BellIcon: () => "BellIcon",
}));

// Mock react-icons
jest.mock("react-icons/md", () => ({
  MdCloudUpload: "MdCloudUpload",
}));

// Create mock AuthContext directly instead of mocking the module
const mockAuthContext = {
  user: { id: "1", name: "Test User" },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
};
// Mock react-dropzone
jest.mock("react-dropzone", () => ({
  useDropzone: () => ({
    getRootProps: () => ({}),
    getInputProps: () => ({
      "data-testid": "file-input",
    }),
    isDragActive: false,
  }),
}));
const MockAuthProvider = ({ children }) => {
  return <div>{children}</div>;
};

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: "1" }),
  useLocation: () => ({ pathname: "/" }),
}));

// Make auth context available globally
global.mockAuthContext = mockAuthContext;
global.MockAuthProvider = MockAuthProvider;
