// client/src/services/theme/themeManager.js
import { storage } from "../../utils/storage";
import { eventBus } from "../eventBus";

class ThemeManager {
  constructor() {
    this.currentTheme = "light";
    this.themes = new Map();
    this.variables = new Map();
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.initialize();
  }

  initialize() {
    // Register default themes
    this.registerTheme("light", {
      colors: {
        primary: "#2B6CB0",
        secondary: "#718096",
        background: "#FFFFFF",
        surface: "#F7FAFC",
        text: "#1A202C",
        error: "#E53E3E",
        warning: "#D69E2E",
        success: "#38A169",
        info: "#3182CE",
      },
      typography: {
        fontFamily: "'Inter', sans-serif",
        fontSize: {
          base: "16px",
          small: "14px",
          large: "18px",
        },
        fontWeight: {
          normal: "400",
          medium: "500",
          bold: "700",
        },
      },
      spacing: {
        base: "4px",
        small: "8px",
        medium: "16px",
        large: "24px",
        xlarge: "32px",
      },
      borderRadius: {
        small: "4px",
        medium: "8px",
        large: "16px",
        circle: "50%",
      },
      shadows: {
        small: "0 1px 3px rgba(0,0,0,0.12)",
        medium: "0 4px 6px rgba(0,0,0,0.1)",
        large: "0 10px 15px rgba(0,0,0,0.1)",
      },
      transitions: {
        fast: "150ms ease-in-out",
        normal: "300ms ease-in-out",
        slow: "500ms ease-in-out",
      },
    });

    this.registerTheme("dark", {
      colors: {
        primary: "#63B3ED",
        secondary: "#A0AEC0",
        background: "#1A202C",
        surface: "#2D3748",
        text: "#F7FAFC",
        error: "#FC8181",
        warning: "#F6AD55",
        success: "#68D391",
        info: "#63B3ED",
      },
      // Inherit other properties from light theme
      ...this.getTheme("light"),
    });

    // Load saved theme or use system preference
    const savedTheme = storage.get("theme");
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme(this.mediaQuery.matches ? "dark" : "light");
    }

    // Listen for system theme changes
    this.mediaQuery.addEventListener("change", (e) => {
      if (!storage.get("theme")) {
        this.setTheme(e.matches ? "dark" : "light");
      }
    });
  }

  registerTheme(name, theme) {
    this.themes.set(name, theme);
    this.compileThemeVariables(name, theme);
  }

  compileThemeVariables(themeName, theme, prefix = "") {
    const flatten = (obj, parentKey = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}-${key}` : key;
        if (value && typeof value === "object") {
          flatten(value, fullKey);
        } else {
          this.variables.set(`--${themeName}-${fullKey}`, value);
        }
      });
    };

    flatten(theme);
  }

  setTheme(themeName) {
    if (!this.themes.has(themeName)) {
      console.error(`Theme "${themeName}" not found`);
      return;
    }

    const oldTheme = this.currentTheme;
    this.currentTheme = themeName;

    // Update CSS variables
    const root = document.documentElement;
    this.variables.forEach((value, key) => {
      if (key.startsWith(`--${themeName}-`)) {
        const varName = key.replace(`--${themeName}-`, "--");
        root.style.setProperty(varName, value);
      }
    });

    // Update class on root element
    root.classList.remove(`theme-${oldTheme}`);
    root.classList.add(`theme-${themeName}`);

    // Store preference
    storage.set("theme", themeName);

    // Emit theme change event
    eventBus.emit("theme:change", {
      oldTheme,
      newTheme: themeName,
    });
  }

  getTheme(themeName) {
    return this.themes.get(themeName);
  }

  getCurrentTheme() {
    return {
      name: this.currentTheme,
      ...this.getTheme(this.currentTheme),
    };
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  // Helper method to get CSS variable value
  getVariable(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${name}`)
      .trim();
  }
}

export const themeManager = new ThemeManager();
