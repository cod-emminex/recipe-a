// src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxLength: 500, // Reasonable limit for bio
    },
    country: {
      code: String,
      name: String,
      flag: String,
    },
    bestRecipe: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    favoriteCuisine: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

// Virtual fields for counts
userSchema.virtual("recipesCount").get(function () {
  return this.recipes ? this.recipes.length : 0;
});

userSchema.virtual("followersCount").get(function () {
  return this.followers ? this.followers.length : 0;
});

userSchema.virtual("followingCount").get(function () {
  return this.following ? this.following.length : 0;
});
// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
