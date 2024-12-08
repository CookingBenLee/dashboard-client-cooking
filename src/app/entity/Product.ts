import { PristineChangeEvent } from "@angular/forms";
import { Brand } from "../services/brand/Brand";
import { Category } from "../services/category/Category";
import { Conditioning } from "../services/conditioning/Conditioning";
import { Unit } from "../services/unit/Unit";

export class Product{
  id?:number
  code?:string;
  name:string;
  price?:number;
  lossPercentage?:number;
  description?:string;
  photo?:string;
  imageBase64?:string;

  category?:Category;
  brand?:Brand;
  conditioning?:Conditioning;
  unit:Unit;
  stock: number;
  productList?:Product[];
  priceList:PristineChangeEvent[]
  // stockList:Stock[]
  isActive?:boolean;
}
