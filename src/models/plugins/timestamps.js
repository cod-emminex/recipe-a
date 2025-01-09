// src/models/plugins/timestamps.js

import mongoose from "mongoose";

const timestampsSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

export default timestampsSchema;
