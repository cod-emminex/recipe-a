// frontend/js/components/Recipe.js

export class Recipe {
  constructor(data) {
    this.data = data;
    this.element = null;
  }

  render() {
    this.element = document.createElement("article");
    this.element.className = "recipe-card";
    this.element.innerHTML = `
            <div class="recipe-card__image">
                <img src="${this.data.images[0]?.url || "assets/images/default-recipe.jpg"}" 
                     alt="${this.data.title}">
                <div class="recipe-card__badges">
                    <span class="badge badge--${this.data.difficulty}">${this.data.difficulty}</span>
                    <span class="badge">${this.data.cookingTime.total} min</span>
                </div>
            </div>
            <div class="recipe-card__content">
                <h3 class="recipe-card__title">${this.data.title}</h3>
                <p class="recipe-card__description">${this.data.description}</p>
                <div class="recipe-card__meta">
                    <div class="recipe-card__rating">
                        <i class="fas fa-star"></i>
                        <span>${this.data.averageRating.toFixed(1)}</span>
                    </div>
                    <div class="recipe-card__author">
                        <img src="${this.data.author.profileImage}" alt="${this.data.author.username}">
                        <span>by ${this.data.author.username}</span>
                    </div>
                </div>
                <button class="btn btn--primary btn--block view-recipe" data-id="${this.data._id}">
                    View Recipe
                </button>
            </div>
        `;

    this.attachEventListeners();
    return this.element;
  }

  attachEventListeners() {
    const viewButton = this.element.querySelector(".view-recipe");
    viewButton.addEventListener("click", () => this.handleViewRecipe());
  }

  handleViewRecipe() {
    window.location.href = `/recipe/${this.data._id}`;
  }

  static renderList(recipes, container) {
    container.innerHTML = "";
    recipes.forEach((recipeData) => {
      const recipe = new Recipe(recipeData);
      container.appendChild(recipe.render());
    });
  }
}
