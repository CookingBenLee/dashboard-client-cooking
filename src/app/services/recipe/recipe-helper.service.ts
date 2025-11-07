import { Injectable } from '@angular/core';
import { Recipe, RecipeIngredient, RecipeStep } from './Recipe';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeHelperService {

  constructor(private recipeService: RecipeService) { }

  /**
   * Crée une recette complète avec photo, ingrédients et compte utilisateur
   */
  async createCompleteRecipe(
    recipeData: Partial<Recipe>,
    photo?: File,
    ingredients?: RecipeIngredient[],
    userId?: number
  ): Promise<any> {
    try {
      // Créer la recette de base
      const recipe = new Recipe();
      Object.assign(recipe, recipeData);
      recipe.compteuser_id = userId;
      recipe.createdDate = new Date();

      // Si on a une photo et des ingrédients, utiliser la méthode complète
      if (photo || (ingredients && ingredients.length > 0)) {
        return await this.recipeService.createCompleteRecipe(recipe, photo, ingredients, userId);
      } else {
        // Sinon, créer la recette simple
        return await this.recipeService.create(recipe);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la recette:', error);
      throw error;
    }
  }

  /**
   * Met à jour une recette avec photo
   */
  async updateRecipeWithPhoto(
    recipeId: number,
    recipeData: Partial<Recipe>,
    photo?: File
  ): Promise<any> {
    try {
      // Mettre à jour la recette
      const updatedRecipe = await this.recipeService.update(recipeId, recipeData as Recipe);
      
      // Si une nouvelle photo est fournie, la mettre à jour
      if (photo) {
        await this.recipeService.updatePhoto(photo, recipeId);
      }
      
      return updatedRecipe;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la recette:', error);
      throw error;
    }
  }

  /**
   * Gère les ingrédients d'une recette
   */
  async manageRecipeIngredients(
    recipeId: number,
    ingredients: RecipeIngredient[]
  ): Promise<any> {
    try {
      const results = [];
      
      for (const ingredient of ingredients) {
        if (ingredient.id) {
          // Mettre à jour l'ingrédient existant
          const result = await this.recipeService.updateIngredient(
            recipeId, 
            ingredient.id, 
            ingredient
          );
          results.push(result);
        } else {
          // Ajouter un nouvel ingrédient
          const result = await this.recipeService.addIngredient(recipeId, ingredient);
          results.push(result);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Erreur lors de la gestion des ingrédients:', error);
      throw error;
    }
  }

  /**
   * Calcule le coût total d'une recette basé sur ses ingrédients
   */
  calculateRecipeCost(ingredients: RecipeIngredient[]): number {
    return ingredients.reduce((total, ingredient) => {
      return total + (ingredient.totalPrice || 0);
    }, 0);
  }

  /**
   * Valide les données d'une recette avant enregistrement
   */
  validateRecipe(recipe: Recipe): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!recipe.name || recipe.name.trim() === '') {
      errors.push('Le nom de la recette est requis');
    }

    if (!recipe.categoryRecipe || !recipe.categoryRecipe.id) {
      errors.push('La catégorie de la recette est requise');
    }

    if (!recipe.compteuser_id) {
      errors.push('L\'utilisateur propriétaire est requis');
    }

    if (recipe.preparationTime && recipe.preparationTime < 0) {
      errors.push('Le temps de préparation doit être positif');
    }

    if (recipe.cookingTime && recipe.cookingTime < 0) {
      errors.push('Le temps de cuisson doit être positif');
    }

    if (recipe.servings && recipe.servings <= 0) {
      errors.push('Le nombre de portions doit être supérieur à 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Formate les données d'une recette pour l'affichage
   */
  formatRecipeForDisplay(recipe: Recipe): any {
    return {
      ...recipe,
      formattedPreparationTime: this.formatTime(recipe.preparationTime),
      formattedCookingTime: this.formatTime(recipe.cookingTime),
      totalTime: (recipe.preparationTime || 0) + (recipe.cookingTime || 0),
      totalCost: this.calculateRecipeCost(recipe.ingredients || []),
      difficultyLabel: this.getDifficultyLabel(recipe.difficulty),
      statusLabel: this.getStatusLabel(recipe.status)
    };
  }

  /**
   * Formate le temps en minutes vers un format lisible
   */
  private formatTime(minutes?: number): string {
    if (!minutes) return 'Non spécifié';
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours}h ${remainingMinutes}min`
        : `${hours}h`;
    }
  }

  /**
   * Retourne le libellé de difficulté
   */
  private getDifficultyLabel(difficulty?: string): string {
    const labels = {
      'EASY': 'Facile',
      'MEDIUM': 'Moyen',
      'HARD': 'Difficile'
    };
    return labels[difficulty as keyof typeof labels] || 'Non spécifié';
  }

  /**
   * Retourne le libellé de statut
   */
  private getStatusLabel(status?: string): string {
    const labels = {
      'DRAFT': 'Brouillon',
      'PUBLISHED': 'Publié',
      'PRIVATE': 'Privé'
    };
    return labels[status as keyof typeof labels] || 'Brouillon';
  }

  /**
   * Génère un code unique pour une recette
   */
  generateRecipeCode(recipeName: string, userId: number): string {
    const timestamp = Date.now();
    const namePrefix = recipeName.substring(0, 3).toUpperCase();
    return `REC-${namePrefix}-${userId}-${timestamp}`;
  }

  /**
   * Exporte une recette au format JSON
   */
  exportRecipe(recipe: Recipe): string {
    const exportData = {
      name: recipe.name,
      description: recipe.description,
      preparationTime: recipe.preparationTime,
      cookingTime: recipe.cookingTime,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      detailCuisine: recipe.detailCuisine,
      tags: recipe.tags,
      nutritionalInfo: {
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fat: recipe.fat
      },
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(exportData, null, 2);
  }
}
