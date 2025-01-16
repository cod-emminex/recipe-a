// src/components/ThemeStyles.js
import React from "react";
import { Global, css } from "@emotion/react";

const ThemeStyles = () => (
  <Global
    styles={css`
      :root {
        --transition-duration: 0.2s;
      }

      body {
        transition: background-color var(--transition-duration) ease,
          color var(--transition-duration) ease;
      }

      .theme-dark {
        background-color: var(--dark-background);
        color: var(--dark-text);
      }

      .theme-light {
        background-color: var(--light-background);
        color: var(--light-text);
      }
    `}
  />
);

export default ThemeStyles;
