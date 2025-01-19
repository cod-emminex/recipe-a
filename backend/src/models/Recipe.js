// src/models/Recipe.js
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    ingredients: [
      {
        type: String,
        required: [true, "Ingredients are required"],
      },
    ],
    steps: [
      {
        type: String,
        required: [true, "Steps are required"],
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    country: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    cookingTime: {
      type: Number,
    },
    servings: {
      type: Number,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    image: {
      type: String,
    },
    recipeNumber: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

recipeSchema.pre("save", async function (next) {
  if (!this.recipeNumber) {
    const highestRecipe = await this.constructor
      .findOne({})
      .sort({ recipeNumber: -1 })
      .select("recipeNumber");

    this.recipeNumber = (highestRecipe?.recipeNumber || 5) + 1;
  }
  next();
});

module.exports = mongoose.model("Recipe", recipeSchema);
