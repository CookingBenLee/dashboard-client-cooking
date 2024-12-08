import { Product } from "src/app/entity/Product";
import { Price } from "../price/Price";
import { Purchase } from "../purchase/Purchase";

export class DetailsPurchasing{

  id?:number
  quantity:number;
  totalPrice:number;
  isDeleted?:boolean;

  product: Product;
  purchase: Purchase;

  price:Price
}
