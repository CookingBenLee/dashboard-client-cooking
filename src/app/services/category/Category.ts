import { Product } from "src/app/entity/Product";


export class Category{

  id?:number
  name?:string;
  code?:string;
  description?:string;

  productList?:Product[];

  isDeleted?:boolean;
}
