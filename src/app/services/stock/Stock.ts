import { Product } from "src/app/entity/Product";


export class Stock{

  id?:number
  quantity?:number=0;
  minimum?:number;

  date?:Date
  isDeleted?:boolean;
  product: Product;
}
