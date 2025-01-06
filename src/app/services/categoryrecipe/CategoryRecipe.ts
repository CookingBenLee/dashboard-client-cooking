import { Recipe } from "../recipe/Recipe";

export class CategoryRecipe{

  id?:number
  name?:string;
  code?:string;
  detail?:string;

  recipeList?:Recipe[];

  isDeleted?:boolean;
}
