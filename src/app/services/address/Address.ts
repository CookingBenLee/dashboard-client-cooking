import { Country } from "../country/Country";
import { Purchase } from "../purchase/Purchase";
import { Shop } from "../shop/Shop";
import {AddMap} from "./AddMap";
export class Address{

  id?:number
  longitude?:number;
  latitude?:number;

  label?:string;
  streetNumber?:string;
  streetName?:string;
  city?:string;

  geolocation?:string;
  // contact?:string;
  // email?:string;

  isSeat?:boolean;

  // datePurchase?:Date;
  isDeleted?:boolean;

  shop :Shop;
  country :Country;

  map:AddMap;
  purchaseList: Purchase[];

}
