// src/controllers/recipes.js

import { Recipe } from "../models/Recipe.js";
import { AppError } from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import { getIO } from "../config/socket.js";

export const createRecipe = async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    const recipe = await Recipe.create(req.body);

    const io = getIO();
    io.of("/recipes").emit("new-recipe", recipe);

    res.status(201).json({
      success: true,
      data: recipe,
    });
  } catch (err) {
    next(err);
  }
};

export const getRecipes = async (req, res, next) => {
  try {
    const features = new APIFeatures(Recipe.find(), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const recipes = await features.query;

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (err) {
    next(err);
  }
};

export const getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("author", "username avatar")
      .populate("comments");

    if (!recipe) {
      return next(new AppError("Recipe not found", 404));
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (err) {
    next(err);
  }
};

export const updateRecipe = async (req, res, next) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return next(new AppError("Recipe not found", 404));
    }

    // Check ownership
    if (recipe.author.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new AppError("Not authorized to update this recipe", 401));
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const io = getIO();
    io.of("/recipes").to(`recipe:${recipe._id}`).emit("recipe-updated", recipe);

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return next(new AppError("Recipe not found", 404));
    }

    if (recipe.author.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new AppError("Not authorized to delete this recipe", 401));
    }

    await recipe.remove();

    const io = getIO();
    io.of("/recipes").emit("recipe-deleted", req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
