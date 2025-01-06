import { Dishes } from "../dishes/Dishes";
import { Recipe } from "../recipe/Recipe";

export class CompositionDishes{
  id: number;

  code: string;
  detail: string;
  quantity:number
  proportion: number=0;

  dishe: Dishes;
  recipe: Recipe;

  isDeleted: boolean;

  ///
  cout:number;
  quantityKg:number


}


