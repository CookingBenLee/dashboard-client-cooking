import { CompositionCardMenu } from "../compositionCardMenu/CompositionCardMenu";
import { CompositionMenu } from "../compositionMenu/CompositionMenu";

export class Menu{

  id?:number
  code?:string;
  name:string;


  compositionCardList:CompositionCardMenu[]
  compositionMenuList:CompositionMenu[]

  isDeleted?:boolean;
}
