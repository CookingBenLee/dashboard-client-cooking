import { Address } from "../address/Address";
import { Currency } from "../currency/Currency";
import { DetailsPurchasing } from "../detailspurchasing/DetailsPurchasing";
import { Shop } from "../shop/Shop";

export class Purchase{

  id?:number
  // quantity?:number;
  montant?:number;

  reference?:string;

  entryDate?:Date;

  datePurchase:Date;
  isDeleted?:boolean;
  detailsPurchasingList: DetailsPurchasing[];
  shop :Shop;
  address :Address;
  currency :Currency;

}
