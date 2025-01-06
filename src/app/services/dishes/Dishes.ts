import { CategoryDishes } from "../categorydishes/CategoryDishes";
import { CategoryMenu } from "../categotyMenu/CategoryMenu";
import { CompositionDishes } from "../compositiondishes/CompositionDishes";
import { DetailDishes } from "../detaildishes/DetailDishes";
import { PicturesDishes } from "../picturedishes/PicturesDishes";
import { Unit } from "../unit/Unit";

export class Dishes{

  id: number;

  reference: string;

  name: string;
  //ratio: number;
  createdDate:Date
  isDeleted: boolean;

  detail: string;

  // categoryDishe: CategoryDishes;

  categoryMenu: CategoryMenu;

  compositionList: CompositionDishes[];
  picturesList: PicturesDishes[];

  //
  poids: number;

  //quantite: number;

  //qte: number;

  cout: number;

  brut: number;

  net: number;
  ///////
  estimationPlatAVendre:number;
  platVendu:number

  ///for calculate simulation economique
  nbre:number=0
  totalPrice:number=0
  facteurMultiplicatif:number=0

  ///
  stock:number
  qteEstimee:number
  prixRevient:number

  

}
