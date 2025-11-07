import { Product } from "src/app/entity/Product";
import { CategoryRecipe } from "../categoryrecipe/CategoryRecipe";
import { CompositionDishes } from "../compositiondishes/CompositionDishes";
import { DetailsRecipe } from "../detailsrecipe/DetailsRecipe";

export class Recipe{

  id?: number;

  code?: string;

  name?: string;

  ratio?: number;
  principaleRecipe?: boolean;

  createdDate?: Date;
  isDeleted?: boolean;
  share?: boolean;
  owner?: boolean;

  detailCuisine?: string;

  categoryRecipe?: CategoryRecipe;

  detailList?: DetailsRecipe[];
  compositionList?: CompositionDishes[];
  lossPercentage?: number;
  
  // Coûts et calculs
  cout?: number;
  brut?: number;
  net?: number;
  stock?: number;
  stockApres?: number;
  qteEstimee?: number;
  
  // Utilisateur et photo
  user?: any;
  photo?: string;
  compteuser_id?: number;
  uniquecode?: string;
  
  // Nouveaux champs pour la gestion des ingrédients
  ingredients?: RecipeIngredient[];
  
  // Métadonnées
  description?: string;
  preparationTime?: number; // en minutes
  cookingTime?: number; // en minutes
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  servings?: number;
  
  // Statut de la recette
  status?: 'DRAFT' | 'PUBLISHED' | 'PRIVATE';
  
  // Tags et catégories
  tags?: string[];
  
  // Informations nutritionnelles
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  
  constructor() {
    this.id = 0;
    this.code = '';
    this.name = '';
    this.ratio = 1;
    this.principaleRecipe = false;
    this.createdDate = new Date();
    this.isDeleted = false;
    this.share = false;
    this.owner = false;
    this.detailCuisine = '';
    this.lossPercentage = 0;
    this.cout = 0;
    this.brut = 0;
    this.net = 0;
    this.stock = 0;
    this.stockApres = 0;
    this.qteEstimee = 0;
    this.photo = '';
    this.compteuser_id = 0;
    this.uniquecode = '';
    this.ingredients = [];
    this.detailList = [];
    this.compositionList = [];
    this.tags = [];
    this.description = '';
    this.preparationTime = 0;
    this.cookingTime = 0;
    this.difficulty = 'EASY';
    this.servings = 1;
    this.status = 'DRAFT';
    this.calories = 0;
    this.protein = 0;
    this.carbs = 0;
    this.fat = 0;
  }
}

// Interface pour les ingrédients de recette
export interface RecipeIngredient {
  id?: number;
  productId?: number;
  productName?: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  totalPrice?: number;
  notes?: string;
  isOptional?: boolean;
  order?: number;
}

// Interface pour les étapes de préparation
export interface RecipeStep {
  id?: number;
  stepNumber?: number;
  description?: string;
  duration?: number; // en minutes
  temperature?: number;
  notes?: string;
}
