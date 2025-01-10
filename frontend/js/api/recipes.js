// frontend/js/api/recipes.js
import { apiRequest } from "./config.js";

export const RecipeAPI = {
  async getAllRecipes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/recipes?${queryString}`);
  },

  async getRecipeById(id) {
    return await apiRequest(`/recipes/${id}`);
  },

  async createRecipe(recipeData) {
    return await apiRequest("/recipes", {
      method: "POST",
      body: JSON.stringify(recipeData),
    });
  },

  async updateRecipe(id, recipeData) {
    return await apiRequest(`/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(recipeData),
    });
  },

  async deleteRecipe(id) {
    return await apiRequest(`/recipes/${id}`, {
      method: "DELETE",
    });
  },

  async rateRecipe(id, rating) {
    return await apiRequest(`/recipes/${id}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating }),
    });
  },

  async getComments(id) {
    return await apiRequest(`/recipes/${id}/comments`);
  },

  async addComment(id, comment) {
    return await apiRequest(`/recipes/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    });
  },
};
