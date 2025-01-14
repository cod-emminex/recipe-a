// client/src/mocks/handlers.js
import { rest } from "msw";

export const handlers = [
  // Mock GET recipe
  rest.get("/api/recipes/:id", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        title: "Test Recipe",
        description: "Test Description",
        ingredients: [],
        instructions: [],
        author: {
          name: "Test Author",
        },
      })
    );
  }),

  // Mock GET reviews
  rest.get("/api/recipes/:id/reviews", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          rating: 5,
          comment: "Great recipe!",
          user: {
            name: "Test User",
          },
        },
      ])
    );
  }),
];
