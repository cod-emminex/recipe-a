// src/components/ThemeToggle.js
import React from "react";
import { IconButton } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { themeManager } from "../services/theme/themeManager";

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = React.useState(
    themeManager.currentTheme
  );

  React.useEffect(() => {
    const handleThemeChange = ({ newTheme }) => {
      setCurrentTheme(newTheme);
    };

    // Subscribe to theme changes
    const unsubscribe = themeManager.on("theme:change", handleThemeChange);

    return () => {
      // Cleanup subscription
      unsubscribe();
    };
  }, []);

  return (
    <IconButton
      aria-label="Toggle theme"
      icon={currentTheme === "light" ? <FaMoon /> : <FaSun />}
      onClick={() => themeManager.toggleTheme()}
      variant="ghost"
      color="current"
      size="md"
    />
  );
};

export default ThemeToggle;
