import { Product } from "src/app/entity/Product";


export class Unit{

  id?:number
  name?:string;
  code?:string;
  productList?:Product[];

  isDeleted?:boolean;
}
