// src/docs/swagger.js

const swaggerDocs = {
  openapi: "3.0.0",
  info: {
    title: "Recipe Sharing Platform API",
    version: "2.0.0",
    description: "Complete API documentation for the Recipe Sharing Platform",
    contact: {
      name: "API Support",
      email: "support@recipeplatform.com",
      url: "https://docs.recipeplatform.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "https://api.recipeplatform.com/v2",
      description: "Production server",
    },
    {
      url: "https://staging-api.recipeplatform.com/v2",
      description: "Staging server",
    },
    {
      url: "http://localhost:3000/v2",
      description: "Development server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Recipes", description: "Recipe management" },
    { name: "Collections", description: "Collection management" },
    { name: "Users", description: "User management" },
    { name: "Comments", description: "Recipe comments" },
    { name: "Search", description: "Search functionality" },
    { name: "Upload", description: "File upload endpoints" },
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Create a new user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserRegistration",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User successfully registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          400: {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/recipes": {
      get: {
        tags: ["Recipes"],
        summary: "Get all recipes",
        description: "Retrieve a list of recipes with optional filtering",
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", default: 1 },
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", default: 10 },
            description: "Items per page",
          },
          {
            in: "query",
            name: "sort",
            schema: { type: "string" },
            description: "Sort field (e.g., -createdAt,title)",
          },
          {
            in: "query",
            name: "difficulty",
            schema: { type: "string", enum: ["easy", "medium", "hard"] },
            description: "Filter by difficulty",
          },
          {
            in: "query",
            name: "category",
            schema: { type: "string" },
            description: "Filter by category ID",
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of recipes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    count: { type: "integer" },
                    pagination: {
                      $ref: "#/components/schemas/Pagination",
                    },
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Recipe",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Recipes"],
        summary: "Create a new recipe",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RecipeInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Recipe created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RecipeResponse",
                },
              },
            },
          },
        },
      },
    },
    "/recipes/{id}": {
      get: {
        tags: ["Recipes"],
        summary: "Get recipe by ID",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Recipe details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RecipeResponse",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Recipes"],
        summary: "Update recipe",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RecipeInput",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Recipe updated successfully",
          },
        },
      },
    },
    "/collections/{id}/recipes": {
      post: {
        tags: ["Collections"],
        summary: "Add recipe to collection",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["recipeId"],
                properties: {
                  recipeId: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Recipe added to collection",
          },
        },
      },
    },
    "/search": {
      get: {
        tags: ["Search"],
        summary: "Search recipes",
        parameters: [
          {
            in: "query",
            name: "q",
            schema: { type: "string" },
            description: "Search query",
          },
          {
            in: "query",
            name: "type",
            schema: {
              type: "string",
              enum: ["recipe", "collection", "user"],
            },
            description: "Search type",
          },
        ],
        responses: {
          200: {
            description: "Search results",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    count: { type: "integer" },
                    data: {
                      type: "array",
                      items: {
                        oneOf: [
                          { $ref: "#/components/schemas/Recipe" },
                          { $ref: "#/components/schemas/Collection" },
                          { $ref: "#/components/schemas/User" },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      // Schema definitions...
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export default swaggerDocs;
