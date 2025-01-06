import { Product } from "src/app/entity/Product";
import { CategoryDishes } from "../categorydishes/CategoryDishes";
import { Dishes } from "../dishes/Dishes";
import { Unit } from "../unit/Unit";

export class DetailDishes{
  id: number;

  ingredient: Product;

  //poids: number=0;

  proportion: number=0;

  // quantite: number=0;

  brut: number=0;

  net: number=0;

  cout: number=0;

  //preparationInitial: number=0;

  preparationIngredient: string;

  //unit: Unit;

  dishe: Dishes;

  isDeleted: boolean;

  // floatingBrut: number=0;

  // floatingNet: number=0;

  // floatingCout: number=0;

}


