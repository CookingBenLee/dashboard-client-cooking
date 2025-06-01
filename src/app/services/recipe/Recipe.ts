import { Product } from "src/app/entity/Product";
import { CategoryRecipe } from "../categoryrecipe/CategoryRecipe";
import { CompositionDishes } from "../compositiondishes/CompositionDishes";
import { DetailsRecipe } from "../detailsrecipe/DetailsRecipe";

export class Recipe{

  id: number;

  code: string;

  name: string;

  ratio: number;
  principaleRecipe: boolean;

  createdDate: Date;
  isDeleted: boolean;

  detailCuisine: string;

  categoryRecipe: CategoryRecipe;

  detailList: DetailsRecipe[];
  compositionList: CompositionDishes[];
  lossPercentage?: number;
  ///
  cout: number;

  brut: number;

  net: number;

  stock:number

  ///
  stockApres:number
  qteEstimee:number
  user: any

}
