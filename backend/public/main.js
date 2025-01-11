// frontend/js/main.js
import { initializeApp } from "./api/config.js";
import { setupEventListeners } from "./utils/helpers.js";
import { initializeWebSocket } from "./utils/websocket.js";
import { setupTheme } from "./utils/theme.js";
import { setupAuth } from "./api/auth.js";
import { Clerk } from "@clerk/clerk-js";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerk = new Clerk(clerkPubKey);
await clerk.load({
  navigate: true,
  checkLogin: true,
  checkLoginOptions: {
    redirectUrl: "/login",
  },
  signIn: true,
  signUp: true,
  signOut: true,
  social: true,
  socialOptions: {
    providers: ["google", "facebook", "github"],
  },
  user: true,
  userOptions: {
    initialData: true,
  },
  userSettings: true,
  userSettingsOptions: {
    initialData: true,
  },
  userFields: true,
  userFieldsOptions: {
    initialData: true,
  },
  userFieldsUpdate: true,
  userFieldsUpdateOptions: {
    initialData: true,
  },
  userFieldsDelete: true,
  userFieldsDeleteOptions: {
    initialData: true,
  },
  userFieldsCreate: true,
  userFieldsCreateOptions: {
    initialData: true,
  },
  userFieldsUpdate: true,
  userFieldsUpdateOptions: {
    initialData: true,
  },
  userFieldsDelete: true,
  userFieldsDeleteOptions: {
    initialData: true,
  },
  userFieldsCreate: true,
  userFieldsCreateOptions: {
    initialData: true,
  },
  userFieldsUpdate: true,
  userFieldsUpdateOptions: {
    initialData: true,
  },
  userFieldsDelete: true,
  userFieldsDeleteOptions: {
    initialData: true,
  },
  userFieldsCreate: true,
  userFieldsCreateOptions: {
    initialData: true,
  },
  userFieldsUpdate: true,
  userFieldsUpdateOptions: {
    initialData: true,
  },
  userFieldsDelete: true,
  userFieldsDeleteOptions: {
    initialData: true,
  },
  userFieldsCreate: true,
  userFieldsCreateOptions: {
    initialData: true,
  },
  userFieldsUpdate: true,
  userFieldsUpdateOptions: {
    initialData: true,
  },
  userFieldsDelete: true,
  userFieldsDeleteOptions: {
    initialData: true,
  },
  userFieldsCreate: true,
  userFieldsCreateOptions: {
    initialData: true,
  },
  userFieldsUpdate: true,
  userFieldsUpdateOptions: {
    initialData: true,
  },
  userFieldsDelete: true,
  userFieldsDeleteOptions: {
    initialData: true,
  },
});
if (clerk.user) {
  document.getElementById("app").innerHTML = `
    <div id="user-button"></div>
  `;

  const userButtonDiv = document.getElementById("user-button");

  clerk.mountUserButton(userButtonDiv);
} else {
  document.getElementById("app").innerHTML = `
    <div id="sign-in"></div>
  `;

  const signInDiv = document.getElementById("sign-in");

  clerk.mountSignIn(signInDiv);
}
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Initialize the application
    await initializeApp();

    // Setup event listeners
    setupEventListeners();

    // Initialize WebSocket connection
    initializeWebSocket();

    // Setup theme
    setupTheme();

    // Setup authentication
    setupAuth();
  } catch (error) {
    console.error("Error initializing application:", error);
  }
});
