// src/hooks/useTheme.js
import { useState, useEffect } from 'react';
import { eventBus } from '../services/eventBus';
import { themeManager } from '../services/theme/themeManager';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(themeManager.getCurrentTheme());

  useEffect(() => {
    const handleThemeChange = ({ newTheme }) => {
      setCurrentTheme(themeManager.getTheme(newTheme));
    };

    eventBus.on('theme:change', handleThemeChange);
    return () => eventBus.off('theme:change', handleThemeChange);
  }, []);

  return {
    theme: currentTheme,
    toggleTheme: themeManager.toggleTheme.bind(themeManager),
    setTheme: themeManager.setTheme.bind(themeManager)
  };
};
