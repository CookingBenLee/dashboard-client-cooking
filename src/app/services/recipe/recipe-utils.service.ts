import { Injectable } from '@angular/core';
import { Recipe } from './Recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeUtilsService {

  /**
   * Assure qu'une recette a toutes les propriétés nécessaires avec des valeurs par défaut
   */
  ensureRecipeDefaults(recipe: Partial<Recipe>): Recipe {
    return {
      id: recipe.id || 0,
      code: recipe.code || '',
      name: recipe.name || '',
      ratio: (recipe.ratio || 1) || 1,
      principaleRecipe: recipe.principaleRecipe || false,
      createdDate: recipe.createdDate || new Date(),
      isDeleted: recipe.isDeleted || false,
      share: recipe.share || false,
      owner: recipe.owner || false,
      detailCuisine: recipe.detailCuisine || '',
      categoryRecipe: recipe.categoryRecipe,
      detailList: (recipe.detailList || []) || [],
      compositionList: recipe.compositionList || [],
      lossPercentage: recipe.lossPercentage || 0,
      cout: (recipe.cout || 0) || 0,
      brut: (recipe.brut || 0) || 0,
      net: (recipe.net || 0) || 0,
      stock: recipe.stock || 0,
      stockApres: (recipe.stockApres || 0) || 0,
      qteEstimee: recipe.qteEstimee || 0,
      user: recipe.user,
      photo: recipe.photo || '',
      compteuser_id: recipe.compteuser_id || 0,
      ingredients: recipe.ingredients || [],
      description: recipe.description || '',
      preparationTime: recipe.preparationTime || 0,
      cookingTime: recipe.cookingTime || 0,
      difficulty: recipe.difficulty || 'EASY',
      servings: recipe.servings || 1,
      status: recipe.status || 'DRAFT',
      tags: recipe.tags || [],
      calories: recipe.calories || 0,
      protein: recipe.protein || 0,
      carbs: recipe.carbs || 0,
      fat: recipe.fat || 0
    };
  }

  /**
   * Vérifie si une recette est valide
   */
  isRecipeValid(recipe: Partial<Recipe>): boolean {
    return !!(recipe.name && recipe.name.trim() !== '');
  }

  /**
   * Calcule le coût total d'une recette
   */
  calculateTotalCost(recipe: Recipe): number {
    const baseCost = (recipe.cout || 0) || 0;
    const ingredientsCost = (recipe.ingredients || []).reduce((total, ingredient) => {
      return total + (ingredient.totalPrice || 0);
    }, 0);
    return baseCost + ingredientsCost;
  }

  /**
   * Calcule le poids brut basé sur le poids net et le ratio
   */
  calculateBrutWeight(recipe: Recipe): number {
    const net = (recipe.net || 0) || 0;
    const ratio = (recipe.ratio || 1) || 1;
    return net * ratio;
  }

  /**
   * Calcule le temps total de préparation
   */
  calculateTotalTime(recipe: Recipe): number {
    const prepTime = recipe.preparationTime || 0;
    const cookTime = recipe.cookingTime || 0;
    return prepTime + cookTime;
  }

  /**
   * Formate le nom d'une recette pour l'affichage
   */
  formatRecipeName(recipe: Recipe): string {
    return recipe.name || 'Recette sans nom';
  }

  /**
   * Vérifie si une recette a des ingrédients
   */
  hasIngredients(recipe: Recipe): boolean {
    return (recipe.ingredients && recipe.ingredients.length > 0) || 
           ((recipe.detailList || []) && (recipe.detailList || []).length > 0);
  }

  /**
   * Obtient le nombre total d'ingrédients
   */
  getIngredientsCount(recipe: Recipe): number {
    const ingredientsCount = (recipe.ingredients || []).length;
    const detailListCount = ((recipe.detailList || []) || []).length;
    return ingredientsCount + detailListCount;
  }

  /**
   * Vérifie si une recette est partagée
   */
  isShared(recipe: Recipe): boolean {
    return recipe.share === true;
  }

  /**
   * Vérifie si une recette appartient à un utilisateur
   */
  isOwnedByUser(recipe: Recipe, userId: number): boolean {
    return recipe.compteuser_id === userId;
  }

  /**
   * Obtient le statut de la recette
   */
  getRecipeStatus(recipe: Recipe): string {
    return recipe.status || 'DRAFT';
  }

  /**
   * Vérifie si une recette est en brouillon
   */
  isDraft(recipe: Recipe): boolean {
    return this.getRecipeStatus(recipe) === 'DRAFT';
  }

  /**
   * Vérifie si une recette est publiée
   */
  isPublished(recipe: Recipe): boolean {
    return this.getRecipeStatus(recipe) === 'PUBLISHED';
  }

  /**
   * Obtient la difficulté de la recette
   */
  getDifficulty(recipe: Recipe): string {
    return recipe.difficulty || 'EASY';
  }

  /**
   * Obtient le libellé de difficulté
   */
  getDifficultyLabel(recipe: Recipe): string {
    const difficulty = this.getDifficulty(recipe);
    const labels = {
      'EASY': 'Facile',
      'MEDIUM': 'Moyen',
      'HARD': 'Difficile'
    };
    return labels[difficulty as keyof typeof labels] || 'Facile';
  }

  /**
   * Obtient le nombre de portions
   */
  getServings(recipe: Recipe): number {
    return recipe.servings || 1;
  }

  /**
   * Calcule les calories par portion
   */
  getCaloriesPerServing(recipe: Recipe): number {
    const totalCalories = recipe.calories || 0;
    const servings = this.getServings(recipe);
    return servings > 0 ? totalCalories / servings : 0;
  }

  /**
   * Vérifie si une recette a une photo
   */
  hasPhoto(recipe: Recipe): boolean {
    return !!(recipe.photo && recipe.photo.trim() !== '');
  }

  /**
   * Obtient l'URL de la photo ou une image par défaut
   */
  getPhotoUrl(recipe: Recipe, defaultImage?: string): string {
    if (this.hasPhoto(recipe)) {
      return recipe.photo!;
    }
    return defaultImage || '/assets/images/default-recipe.jpg';
  }

  /**
   * Génère un résumé de la recette
   */
  generateRecipeSummary(recipe: Recipe): string {
    const name = this.formatRecipeName(recipe);
    const servings = this.getServings(recipe);
    const time = this.calculateTotalTime(recipe);
    const difficulty = this.getDifficultyLabel(recipe);
    
    return `${name} - ${servings} portion(s) - ${time} min - ${difficulty}`;
  }

  /**
   * Filtre les recettes par nom
   */
  filterRecipesByName(recipes: Recipe[], searchTerm: string): Recipe[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return recipes;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return recipes.filter(recipe => {
      const name = (recipe.name || '').toLowerCase();
      return name.includes(term);
    });
  }

  /**
   * Trie les recettes par nom
   */
  sortRecipesByName(recipes: Recipe[], ascending: boolean = true): Recipe[] {
    return [...recipes].sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      
      if (ascending) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  /**
   * Trie les recettes par date de création
   */
  sortRecipesByDate(recipes: Recipe[], ascending: boolean = false): Recipe[] {
    return [...recipes].sort((a, b) => {
      const dateA = new Date(a.createdDate || 0).getTime();
      const dateB = new Date(b.createdDate || 0).getTime();
      
      if (ascending) {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }
}
