// src/controllers/collections.js

import { Collection } from "../models/Collection.js";
import { AppError } from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import { getIO } from "../config/socket.js";

export const createCollection = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;
    const collection = await Collection.create(req.body);

    const io = getIO();
    io.of("/collections").emit("collection-created", {
      collection,
      user: req.user.username,
    });

    res.status(201).json({
      success: true,
      data: collection,
    });
  } catch (err) {
    next(err);
  }
};

export const getCollections = async (req, res, next) => {
  try {
    const features = new APIFeatures(Collection.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Add visibility filter
    features.query = features.query.find({
      $or: [
        { owner: req.user.id },
        { privacy: "public" },
        { "collaborators.user": req.user.id },
      ],
    });

    const collections = await features.query
      .populate("owner", "username avatar")
      .populate("recipes", "title images");

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCollection = async (req, res, next) => {
  try {
    let collection = await Collection.findById(req.params.id);

    if (!collection) {
      return next(new AppError("Collection not found", 404));
    }

    // Check ownership or collaboration rights
    const hasAccess =
      collection.owner.toString() === req.user.id ||
      collection.collaborators.some(
        (c) => c.user.toString() === req.user.id && c.role === "editor"
      );

    if (!hasAccess) {
      return next(
        new AppError("Not authorized to update this collection", 401)
      );
    }

    collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const io = getIO();
    io.of("/collections")
      .to(`collection:${collection._id}`)
      .emit("collection-updated", {
        collection,
        user: req.user.username,
      });

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (err) {
    next(err);
  }
};

export const addRecipeToCollection = async (req, res, next) => {
  try {
    const { recipeId } = req.body;
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return next(new AppError("Collection not found", 404));
    }

    if (!collection.recipes.includes(recipeId)) {
      collection.recipes.push(recipeId);
      await collection.save();

      const io = getIO();
      io.of("/collections")
        .to(`collection:${collection._id}`)
        .emit("recipe-added", {
          collectionId: collection._id,
          recipeId,
          user: req.user.username,
        });
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (err) {
    next(err);
  }
};

export const removeRecipeFromCollection = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return next(new AppError("Collection not found", 404));
    }

    collection.recipes = collection.recipes.filter(
      (recipe) => recipe.toString() !== recipeId
    );
    await collection.save();

    const io = getIO();
    io.of("/collections")
      .to(`collection:${collection._id}`)
      .emit("recipe-removed", {
        collectionId: collection._id,
        recipeId,
        user: req.user.username,
      });

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (err) {
    next(err);
  }
};
