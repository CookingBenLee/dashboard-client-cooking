import { Product } from "src/app/entity/Product";
import { Recipe } from "../recipe/Recipe";

export class DetailsRecipe{
  id: number;

  ingredient: Product;

  proportion: number=0;

  preparationIngredient: string;

  recipe: Recipe;

  isDeleted: boolean;

  ///

  brut: number=0;

  net: number=0;

  cout: number=0;

  ///
  stockApres:number
  totalPrice:number

}

