// Usage Example:
// frontend/js/components/RecipeView.js

class RecipeView {
    constructor(recipeId) {
        this.recipeId = recipeId;
        this.setupRealtime();
        this.render();
    }

    setupRealtime() {
        realtime.subscribeToRecipe(this.recipeId);

        // Cleanup on destroy
        this.cleanup = () => {
            realtime.unsubscribeFromRecipe(this.recipeId);
        };

        // Subscribe to recipe updates
        this.unsubscribe = state.subscribe('currentRecipe', (recipe) => {
            if (recipe._id === this.recipeId) {
                this.updateView(recipe);
            }
        });
    }

    handleComment(event) {
        event.preventDefault();
        const content = this.element.querySelector('.comment-input').value;
        if (content.trim()) {
            realtime.sendComment(this.recipeId, content);
            this.element.querySelector('.comment-input').value = '';
        }
    }

    handleRating(rating) {
        realtime.updateRating(this.recipeId, rating);
    }

    destroy() {
        this.cleanup?.();
        this.unsubscribe?.();
    }
}
