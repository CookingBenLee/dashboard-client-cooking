import { Currency } from "../currency/Currency";

export class Country{

  id?:number
  name?:string;
  code?:string;
  currency?:Currency;

  isDeleted?:boolean;
}
