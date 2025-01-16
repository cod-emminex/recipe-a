// src/App.js
import React, { useEffect } from "react";
import { ChakraProvider, extendTheme, Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import { HelmetProvider } from "react-helmet-async";
import { themeManager } from "./services/theme/themeManager";
import { eventBus } from "./services/eventBus";
import { ThemeStyles } from "./components/ThemeStyles";
// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationCenter from "./components/NotificationCenter";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeList from "./pages/RecipeList";

// Context
import { AuthProvider } from "./context/AuthContext";

// Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Create theme that combines Chakra UI with our ThemeManager
const createTheme = (themeMode) => {
  const currentTheme = themeManager.getTheme(themeMode);

  return extendTheme({
    fonts: {
      heading: currentTheme.typography.fontFamily,
      body: currentTheme.typography.fontFamily,
    },
    colors: {
      brand: {
        50: "#E6FFFA",
        100: "#B2F5EA",
        200: "#81E6D9",
        300: "#4FD1C5",
        400: "#38B2AC",
        500: "#319795",
        600: "#2C7A7B",
        700: "#285E61",
        800: "#234E52",
        900: "#1D4044",
      },
      // Map theme manager colors to Chakra UI theme
      primary: currentTheme.colors.primary,
      secondary: currentTheme.colors.secondary,
      background: currentTheme.colors.background,
      surface: currentTheme.colors.surface,
      text: currentTheme.colors.text,
      error: currentTheme.colors.error,
      warning: currentTheme.colors.warning,
      success: currentTheme.colors.success,
      info: currentTheme.colors.info,
    },
    config: {
      initialColorMode: themeMode,
      useSystemColorMode: false,
    },
    // Add other theme properties
    space: currentTheme.spacing,
    radii: currentTheme.borderRadius,
    shadows: currentTheme.shadows,
    transition: currentTheme.transitions,
  });
};

function App() {
  const [theme, setTheme] = React.useState(() =>
    createTheme(themeManager.getCurrentTheme().name)
  );

  useEffect(() => {
    // Listen for theme changes
    const handleThemeChange = ({ newTheme }) => {
      setTheme(createTheme(newTheme));
    };

    eventBus.on("theme:change", handleThemeChange);

    return () => {
      eventBus.off("theme:change", handleThemeChange);
    };
  }, []);

  // Add theme toggle function to window for easy access (development only)
  if (process.env.NODE_ENV === "development") {
    window.toggleTheme = () => themeManager.toggleTheme();
  }

  return (
    <HelmetProvider>
      <ChakraProvider theme={theme}>
        <ThemeStyles />
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <Box
                minH="100vh"
                display="flex"
                flexDirection="column"
                bg="background"
                color="text"
              >
                <Navbar />
                <NotificationCenter />
                <Box flex="1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/create-recipe"
                      element={
                        <ProtectedRoute>
                          <CreateRecipe />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/recipes" element={<RecipeList />} />
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                  </Routes>
                </Box>
                <Footer />
              </Box>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ChakraProvider>
    </HelmetProvider>
  );
}

export default App;

// Add global styles to handle theme transitions
const globalStyles = document.createElement("style");
globalStyles.textContent = `
  * {
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;
document.head.appendChild(globalStyles);
