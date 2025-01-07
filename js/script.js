// js/script.js
const API_URL = 'http://localhost:3000/api';
// Database Schema

// User Schema
const userSchema = {
  id: "UUID",
  username: "String, unique",
  email: "String, unique",
  password: "String, hashed",
  profileImage: "String, optional",
  createdAt: "Timestamp",
  updatedAt: "Timestamp",
  favorites: ["Recipe IDs"]
}

// Recipe Schema
const recipeSchema = {
  id: "UUID",
  title: "String",
  description: "String",
  authorId: "UUID, ref: User",
  ingredients: [{
    name: "String",
    amount: "Number",
    unit: "String"
  }],
  instructions: ["String"],
  prepTime: "Number, minutes",
  cookTime: "Number, minutes",
  servings: "Number",
  difficulty: "String (easy, medium, hard)",
  category: ["String"],
  tags: ["String"],
  image: "String",
  ratings: [{
    userId: "UUID, ref: User",
    rating: "Number (1-5)",
    review: "String",
    createdAt: "Timestamp"
  }],
  averageRating: "Number",
  createdAt: "Timestamp",
  updatedAt: "Timestamp"
}

// Category Schema
const categorySchema = {
  id: "UUID",
  name: "String",
  description: "String",
  image: "String",
  recipeCount: "Number"
}

// Comment Schema
const commentSchema = {
  id: "UUID",
  recipeId: "UUID, ref: Recipe",
  userId: "UUID, ref: User",
  content: "String",
  createdAt: "Timestamp",
  updatedAt: "Timestamp"
}
// Load recipes when page loads
document.addEventListener('DOMContentLoaded', loadRecipes);

// Handle recipe submission
async function submitRecipe(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      alert('Recipe added successfully!');
      form.reset();
      loadRecipes();
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error adding recipe');
  }
}

// Load and display recipes
async function loadRecipes() {
  try {
    const response = await fetch(`${API_URL}/recipes`);
    const recipes = await response.json();
    const recipesContainer = document.getElementById('recipes-container');

    recipesContainer.innerHTML = recipes.map(recipe => `
            <div class="col-md-4 mb-4">
                <div class="card">
                    ${recipe.image ? `<img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">` : ''}
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">${recipe.description}</p>
                        <div class="rating mb-2" data-recipe-id="${recipe._id}">
                            ${getRatingStars(recipe.rating)}
                        </div>
                        <button onclick="deleteRecipe('${recipe._id}')" class="btn btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Delete recipe
async function deleteRecipe(recipeId) {
  if (confirm('Are you sure you want to delete this recipe?')) {
    try {
      const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        loadRecipes();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
document.addEventListener('DOMContentLoaded', function () {
  // Star Rating Functionality
  const starContainer = document.querySelector('.star-rating');
  if (starContainer) {
    const stars = starContainer.querySelectorAll('i');

    stars.forEach(star => {
      star.addEventListener('mouseover', function () {
        const rating = this.dataset.rating;
        highlightStars(rating);
      });

      star.addEventListener('click', function () {
        const rating = this.dataset.rating;
        setRating(rating);
      });
    });

    starContainer.addEventListener('mouseleave', function () {
      const currentRating = starContainer.dataset.currentRating || 0;
      highlightStars(currentRating);
    });
  }

  function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('far');
        star.classList.add('fas');
      } else {
        star.classList.remove('fas');
        star.classList.add('far');
      }
    });
  }

  function setRating(rating) {
    const starContainer = document.querySelector('.star-rating');
    starContainer.dataset.currentRating = rating;
    // You can add AJAX call here to save the rating
  }
});
// Initialize carousel with settings
$(document).ready(function () {
  $('#recipe-carousel').carousel({
    interval: 4000, // Changes slides every 4 seconds
    pause: "hover", // Pauses sliding on hover
    wrap: true // Continues sliding from last to first image
  });
});
// Helper function to display rating stars
function getRatingStars(rating) {
  return '⭐'.repeat(rating || 0);
}
// Enhanced Form Navigation
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('recipe-form');
  const sections = form.getElementsByClassName('form-section');
  const steps = document.getElementsByClassName('step');
  let currentSection = 0;

  // Next button handler
  document.querySelector('.next-step').addEventListener('click', () => {
    sections[currentSection].classList.remove('active');
    steps[currentSection].classList.remove('active');
    currentSection++;
    sections[currentSection].classList.add('active');
    steps[currentSection].classList.add('active');
    updateNavigation();
  });

  // Previous button handler
  document.querySelector('.prev-step').addEventListener('click', () => {
    sections[currentSection].classList.remove('active');
    steps[currentSection].classList.remove('active');
    currentSection--;
    sections[currentSection].classList.add('active');
    steps[currentSection].classList.add('active');
    updateNavigation();
  });

  // Image upload preview
  const imageUpload = document.getElementById('recipe-image');
  const uploadPreview = document.querySelector('.upload-preview');

  uploadPreview.addEventListener('click', () => {
    imageUpload.click();
  });

  imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadPreview.style.backgroundImage = `url(${e.target.result})`;
        uploadPreview.innerHTML = '';
      };
      reader.readAsDataURL(file);
    }
  });

  // Dynamic ingredient addition
  document.querySelector('.ingredient-item .btn-fancy').addEventListener('click', () => {
    const newIngredient = document.querySelector('.ingredient-item').cloneNode(true);
    newIngredient.querySelector('input').value = '';
    document.querySelector('.ingredients-list').appendChild(newIngredient);
  });

  // Dynamic step addition
  document.querySelector('.recipe-steps .btn-fancy').addEventListener('click', () => {
    const newStep = document.querySelector('.recipe-steps li').cloneNode(true);
    newStep.querySelector('textarea').value = '';
    document.querySelector('.recipe-steps').appendChild(newStep);
  });
});
