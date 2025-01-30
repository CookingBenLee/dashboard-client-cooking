import { CategoryRecipe } from "../categoryrecipe/CategoryRecipe";
import { CompositionDishes } from "../compositiondishes/CompositionDishes";
import { DetailsRecipe } from "../detailsrecipe/DetailsRecipe";
import { Recipe } from "../recipe/Recipe";

export class PreparationRecipe{

  id: number;



  poidsNet: number;

  createdDate: Date;

  datePreparation: Date;
  isDeleted: boolean;


  recipe: Recipe;

}
