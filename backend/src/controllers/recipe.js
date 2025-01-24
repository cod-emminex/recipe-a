//src/controllers/recipe.js
const Recipe = require("../models/Recipe");

exports.createRecipe = async (req, res) => {
  try {
    // Find the highest recipe number in the database
    const highestRecipe = await Recipe.findOne({})
      .sort({ recipeNumber: -1 })
      .select("recipeNumber");

    // If no recipes exist or highest number is less than 5, start from 6
    const nextRecipeNumber = Math.max(highestRecipe?.recipeNumber || 0, 5) + 1;

    const recipe = await Recipe.create({
      ...req.body,
      author: req.user._id,
      recipeNumber: nextRecipeNumber,
    });

    const populatedRecipe = await recipe.populate("author", "username");
    res.status(201).json(populatedRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("author", "username")
      .sort({ recipeNumber: 1 }); // Sort by recipe number instead of creation date
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .populate("author", "username")
      .sort({ recipeNumber: 1 });
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const recipeNumber = parseInt(req.params.number);

    if (isNaN(recipeNumber)) {
      return res.status(400).json({
        error: "Invalid recipe number",
      });
    }

    const recipe = await Recipe.findOne({
      recipeNumber: recipeNumber,
    }).populate("author", "username");

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    console.error("Get recipe error:", error);
    res.status(400).json({ error: error.message });
  }
};
exports.updateRecipe = async (req, res) => {
  try {
    const recipeNumber = parseInt(req.params.number); // Change from id to number to match route

    if (isNaN(recipeNumber)) {
      return res.status(400).json({ error: "Invalid recipe number" });
    }

    // Remove recipeNumber from the update data to prevent changing it
    const updateData = { ...req.body };
    delete updateData.recipeNumber; // Prevent changing the recipe number

    const recipe = await Recipe.findOneAndUpdate(
      {
        recipeNumber: recipeNumber,
        author: req.user._id, // Ensure user owns the recipe
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("author", "username");

    if (!recipe) {
      return res
        .status(404)
        .json({ error: "Recipe not found or unauthorized" });
    }

    res.json(recipe);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ error: error.message });
  }
};
exports.deleteRecipe = async (req, res) => {
  const session = await Recipe.startSession();
  session.startTransaction();

  try {
    const recipeNumber = parseInt(req.params.number);

    if (isNaN(recipeNumber)) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Invalid recipe number" });
    }

    // Find the recipe to delete
    const recipe = await Recipe.findOne({
      recipeNumber: recipeNumber,
      author: req.user._id,
    }).session(session);

    if (!recipe) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "Recipe not found or unauthorized" });
    }

    // Delete the recipe
    await Recipe.deleteOne({ _id: recipe._id }).session(session);

    // Get all recipes with higher numbers
    const recipesToUpdate = await Recipe.find({
      recipeNumber: { $gt: recipeNumber },
    })
      .sort({ recipeNumber: 1 })
      .session(session);

    // Update recipe numbers sequentially
    const updateOperations = recipesToUpdate.map((recipe, index) => ({
      updateOne: {
        filter: { _id: recipe._id },
        update: { $set: { recipeNumber: recipeNumber + index } },
      },
    }));

    if (updateOperations.length > 0) {
      await Recipe.bulkWrite(updateOperations, { session });
    }

    await session.commitTransaction();
    res.status(204).send();
  } catch (error) {
    await session.abortTransaction();
    console.error("Delete error:", error);
    res.status(400).json({ error: error.message || "Error deleting recipe" });
  } finally {
    session.endSession();
  }
};
