import { Menu } from "primeng/menu";
import { CategoryMenu } from "../categotyMenu/CategoryMenu";
import { Dishes } from "../dishes/Dishes";

export class CompositionMenu{
  id: number;

  detail: string;

  dishe: Dishes;
  menu: Menu;
  categoryMenu: CategoryMenu;

  isDeleted: boolean;


}
