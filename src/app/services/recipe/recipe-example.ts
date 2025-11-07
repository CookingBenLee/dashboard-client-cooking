import { Recipe, RecipeIngredient } from './Recipe';
import { RecipeHelperService } from './recipe-helper.service';

/**
 * Exemple d'utilisation du service de recette amélioré
 */
export class RecipeExample {

  constructor(private recipeHelper: RecipeHelperService) {}

  /**
   * Exemple de création d'une recette complète
   */
  async createCompleteRecipeExample() {
    try {
      // Données de base de la recette
      const recipeData: Partial<Recipe> = {
        name: 'Poulet rôti aux herbes',
        description: 'Un délicieux poulet rôti avec des herbes fraîches',
        preparationTime: 30,
        cookingTime: 90,
        difficulty: 'MEDIUM',
        servings: 4,
        detailCuisine: '1. Préchauffer le four à 200°C\n2. Assaisonner le poulet\n3. Enfourner pendant 90 minutes',
        status: 'DRAFT',
        tags: ['poulet', 'rôti', 'herbes', 'familial']
      };

      // Ingrédients de la recette
      const ingredients: RecipeIngredient[] = [
        {
          productName: 'Poulet entier',
          quantity: 1,
          unit: 'pièce',
          unitPrice: 8.50,
          totalPrice: 8.50,
          notes: 'Poulet de 1.5kg environ',
          isOptional: false,
          order: 1
        },
        {
          productName: 'Thym frais',
          quantity: 2,
          unit: 'brins',
          unitPrice: 0.50,
          totalPrice: 1.00,
          notes: 'Herbes fraîches',
          isOptional: false,
          order: 2
        },
        {
          productName: 'Romarin',
          quantity: 1,
          unit: 'brin',
          unitPrice: 0.30,
          totalPrice: 0.30,
          notes: 'Herbes fraîches',
          isOptional: false,
          order: 3
        },
        {
          productName: 'Ail',
          quantity: 3,
          unit: 'gousses',
          unitPrice: 0.20,
          totalPrice: 0.60,
          notes: 'Ail frais',
          isOptional: false,
          order: 4
        },
        {
          productName: 'Huile d\'olive',
          quantity: 2,
          unit: 'cuillères à soupe',
          unitPrice: 0.15,
          totalPrice: 0.30,
          notes: 'Huile d\'olive extra vierge',
          isOptional: false,
          order: 5
        }
      ];

      // Simulation d'un fichier photo (en réalité, ce serait un File object)
      const photoFile: File | undefined = undefined; // Remplacer par le vrai fichier

      // ID de l'utilisateur (récupéré depuis le service d'authentification)
      const userId = 1;

      // Créer la recette complète
      const result = await this.recipeHelper.createCompleteRecipe(
        recipeData,
        photoFile,
        ingredients,
        userId
      );

      console.log('Recette créée avec succès:', result);
      return result;

    } catch (error) {
      console.error('Erreur lors de la création de la recette:', error);
      throw error;
    }
  }

  /**
   * Exemple de mise à jour d'une recette avec photo
   */
  async updateRecipeWithPhotoExample(recipeId: number, photoFile: File) {
    try {
      const recipeData: Partial<Recipe> = {
        name: 'Poulet rôti aux herbes (version améliorée)',
        description: 'Version améliorée avec plus d\'herbes',
        tags: ['poulet', 'rôti', 'herbes', 'familial', 'amélioré']
      };

      const result = await this.recipeHelper.updateRecipeWithPhoto(
        recipeId,
        recipeData,
        photoFile
      );

      console.log('Recette mise à jour avec succès:', result);
      return result;

    } catch (error) {
      console.error('Erreur lors de la mise à jour de la recette:', error);
      throw error;
    }
  }

  /**
   * Exemple de gestion des ingrédients
   */
  async manageIngredientsExample(recipeId: number) {
    try {
      const newIngredients: RecipeIngredient[] = [
        {
          productName: 'Sel',
          quantity: 1,
          unit: 'cuillère à café',
          unitPrice: 0.01,
          totalPrice: 0.01,
          notes: 'Sel de mer',
          isOptional: false,
          order: 6
        },
        {
          productName: 'Poivre noir',
          quantity: 0.5,
          unit: 'cuillère à café',
          unitPrice: 0.02,
          totalPrice: 0.01,
          notes: 'Poivre fraîchement moulu',
          isOptional: false,
          order: 7
        }
      ];

      const result = await this.recipeHelper.manageRecipeIngredients(
        recipeId,
        newIngredients
      );

      console.log('Ingrédients gérés avec succès:', result);
      return result;

    } catch (error) {
      console.error('Erreur lors de la gestion des ingrédients:', error);
      throw error;
    }
  }

  /**
   * Exemple de validation d'une recette
   */
  validateRecipeExample() {
    const recipe: Recipe = {
      name: '',
      description: 'Test recipe',
      preparationTime: -10, // Temps négatif (erreur)
      cookingTime: 30,
      servings: 0, // Portions à 0 (erreur)
      difficulty: 'EASY',
      status: 'DRAFT',
      compteuser_id: undefined // Pas d'utilisateur (erreur)
    };

    const validation = this.recipeHelper.validateRecipe(recipe);
    
    console.log('Validation de la recette:');
    console.log('Valide:', validation.isValid);
    console.log('Erreurs:', validation.errors);
    
    return validation;
  }

  /**
   * Exemple d'export d'une recette
   */
  exportRecipeExample(recipe: Recipe) {
    const exportedData = this.recipeHelper.exportRecipe(recipe);
    console.log('Recette exportée:', exportedData);
    
    // Optionnel: télécharger le fichier
    this.downloadRecipeFile(exportedData, recipe.name || 'recette');
    
    return exportedData;
  }

  /**
   * Télécharge un fichier de recette
   */
  private downloadRecipeFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
