// src/routes/collections.js

import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  deleteCollection,
  addRecipeToCollection,
  removeRecipeFromCollection,
  updateCollaborators,
} from "../controllers/collections.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getCollections).post(createCollection);

router
  .route("/:id")
  .get(getCollection)
  .put(updateCollection)
  .delete(deleteCollection);

router.route("/:id/recipes").post(addRecipeToCollection);

router.route("/:id/recipes/:recipeId").delete(removeRecipeFromCollection);

router.route("/:id/collaborators").put(updateCollaborators);

export default router;
