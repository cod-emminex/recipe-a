// src/config/swagger.js

import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Recipe Sharing Platform API",
      version: "1.0.0",
      description: "API documentation for the Recipe Sharing Platform",
      contact: {
        name: "API Support",
        email: "support@recipeplatform.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Recipe: {
          type: "object",
          required: ["title", "description", "ingredients", "instructions"],
          properties: {
            title: {
              type: "string",
              description: "Recipe title",
            },
            description: {
              type: "string",
              description: "Recipe description",
            },
            ingredients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  amount: { type: "number" },
                  unit: { type: "string" },
                },
              },
            },
            instructions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  step: { type: "number" },
                  text: { type: "string" },
                  image: { type: "string" },
                },
              },
            },
          },
        },
        Collection: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              description: "Collection name",
            },
            description: {
              type: "string",
              description: "Collection description",
            },
            privacy: {
              type: "string",
              enum: ["private", "public", "shared"],
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
            code: {
              type: "number",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

export const specs = swaggerJsdoc(options);
