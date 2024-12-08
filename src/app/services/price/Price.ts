import { Product } from "src/app/entity/Product";
import { Currency } from "../currency/Currency";
import { DetailsPurchasing } from "../detailspurchasing/DetailsPurchasing";
import { Shop } from "../shop/Shop";

export class Price{

  id?:number
  value:number;
  isDeleted?:boolean;


  currency :Currency;
  shop :Shop;
  product: Product;

  detailsPurchasingList:DetailsPurchasing[]
}
