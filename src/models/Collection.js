// src/models/Collection.js

import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
    },
    description: String,
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    recipes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Recipe",
      },
    ],
    collaborators: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["viewer", "editor"],
          default: "viewer",
        },
      },
    ],
    privacy: {
      type: String,
      enum: ["private", "public", "shared"],
      default: "private",
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Collection = mongoose.model("Collection", collectionSchema);
