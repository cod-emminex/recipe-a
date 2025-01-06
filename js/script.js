// public/js/script.js
const API_URL = "http://localhost:3000/api";

// Handle recipe submission
async function submitRecipe(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch(`${API_URL}/recipes`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      alert("Recipe added successfully!");
      loadRecipes();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Load and display recipes
async function loadRecipes() {
  try {
    const response = await fetch(`${API_URL}/recipes`);
    const recipes = await response.json();
    const recipesContainer = document.getElementById("recipes-container");

    recipesContainer.innerHTML = recipes
      .map(
        (recipe) => `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${recipe.image}" class="card-img-top" alt="${
          recipe.title
        }">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">${recipe.description}</p>
                        <div class="rating" data-recipe-id="${recipe._id}">
                            ${"⭐".repeat(recipe.rating || 0)}
                        </div>
                        <button onclick="deleteRecipe('${
                          recipe._id
                        }')" class="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error:", error);
  }
}
