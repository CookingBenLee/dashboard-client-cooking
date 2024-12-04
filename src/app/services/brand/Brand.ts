import { Product } from "src/app/entity/Product";


export class Brand{

  id?:number
  name?:string;
  productList?:Product[];

  isDeleted?:boolean;
}
