// server.js
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect("mongodb+srv://emminex:admin@recipe-app.stvvj.mongodb.net/?retryWrites=true&w=majority&appName=Recipe-app")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: String,
  instructions: String,
  image: String,
  rating: {type: Number, default: 0},
  created_at: {type: Date, default: Date.now},
});

const Recipe = mongoose.model("Recipe", recipeSchema);

// File Upload Configuration
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, "recipe-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({storage: storage});

// Routes
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort("-created_at");
    res.json(recipes);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

app.post("/api/recipes", upload.single("image"), async (req, res) => {
  try {
    const recipe = new Recipe({
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

app.post("/api/recipes/:id/rate", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {rating: req.body.rating},
      {new: true}
    );
    res.json(recipe);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

app.delete("/api/recipes/:id", async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
