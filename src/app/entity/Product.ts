export class Product{
  id?:number
  code?:string;
  name:string;
  price?:number;
  lossPercentage?:number;
  description?:string;
  photo?:string;
  imageBase64?:string;

  // category?:Category;
  // brand?:Brand;
  // conditioning?:Conditioning;
  // unit:Unit;

  //productList?:Product[];
  // priceList:Price[]
  // detailsPurchasingList:DetailsPurchasing[]
  // // stockList:Stock[]
  // stock: Stock;
  isActive?:boolean;
}
