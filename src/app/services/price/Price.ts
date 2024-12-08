import { Currency } from "../currency/Currency";
import { DetailsPurchasing } from "../detailspurchasing/DetailsPurchasing";
import { Product } from "../product/Product";
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
