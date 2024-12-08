import { Country } from "../country/Country";
import { Purchase } from "../purchase/Purchase";

export class Currency{

  id?:number
  name?:string;
  symbol?:string;
  // description?:string;

  productList?:Country[];

  isDeleted?:boolean;

  purchaseList?:Purchase[];

}
