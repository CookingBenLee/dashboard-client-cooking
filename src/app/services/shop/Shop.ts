import { Address } from "../address/Address";
import { Price } from "../price/Price";
import { Purchase } from "../purchase/Purchase";

export class Shop{

  id?:number
  // quantity?:number;
  acronym?:string;

  // reference?:string;
  name?:string;
  //contact?:string;
  //email?:string;
  // entryDate?:Date;

  // datePurchase?:Date;
  isDeleted?:boolean;
  isActive?:boolean;

  addressPrincipale:Address=new Address()
  // purchaseList: Purchase[];
  priceList :Price[];
  adressList :Address[];
  displayLabel?: string;
}
