// client/src/components/ErrorBoundary.js
import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
} from "@chakra-ui/react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log the error to an error reporting service here
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxW="container.md" py={20}>
          <VStack spacing={6} align="center" textAlign="center">
            <Heading>Oops! Something went wrong.</Heading>
            <Text>
              We're sorry for the inconvenience. Please try refreshing the page
              or contact support if the problem persists.
            </Text>
            <Button colorScheme="teal" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </VStack>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
