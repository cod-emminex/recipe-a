// src/models/Recipe.js

import mongoose from "mongoose";
import slugify from "slugify";
import timestampsSchema from "./plugins/timestamps.js";

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ingredient name is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
    },
    notes: String,
  },
  { _id: false }
);

const instructionSchema = new mongoose.Schema(
  {
    step: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Instruction description is required"],
      trim: true,
    },
    image: String,
    duration: Number, // in minutes
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    ingredients: [ingredientSchema],
    instructions: [instructionSchema],
    images: [
      {
        url: String,
        isPrimary: Boolean,
      },
    ],
    cookingTime: {
      prep: { type: Number, required: true },
      cook: { type: Number, required: true },
      total: Number,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    servings: {
      type: Number,
      required: true,
      min: [1, "Servings must be at least 1"],
    },
    nutrition: {
      calories: Number,
      protein: Number,
      carbohydrates: Number,
      fat: Number,
      fiber: Number,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    visibility: {
      type: String,
      enum: ["public", "private", "followers"],
      default: "public",
    },
    metrics: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
    },
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        review: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
recipeSchema.index({ title: "text", description: "text", tags: "text" });
recipeSchema.index({ slug: 1 });
recipeSchema.index({ status: 1, visibility: 1 });
recipeSchema.index({ "metrics.views": -1 });
recipeSchema.index({ averageRating: -1 });
recipeSchema.index({ createdAt: -1 });

// Middleware
recipeSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true });
  }

  if (this.isModified("cookingTime")) {
    this.cookingTime.total = this.cookingTime.prep + this.cookingTime.cook;
  }

  next();
});

// Update average rating when ratings are modified
recipeSchema.pre("save", async function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  }
  next();
});

export const Recipe = mongoose.model("Recipe", recipeSchema);
