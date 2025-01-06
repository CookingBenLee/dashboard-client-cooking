import { CompositionMenu } from "../compositionMenu/CompositionMenu";

export class CategoryMenu{

  id?:number
  name?:string;
  code?:string;
  detail?:string;

  CompositionMenuList?:CompositionMenu[];

  isDeleted?:boolean;
}
