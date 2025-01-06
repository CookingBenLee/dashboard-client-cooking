import { Dishes } from "../dishes/Dishes";


export class CategoryDishes{

  id?:number
  name?:string;
  code?:string;
  detail?:string;

  dishesList?:Dishes[];

  isDeleted?:boolean;
}
