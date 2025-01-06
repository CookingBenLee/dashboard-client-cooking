import { CardMenu } from "../cardmenu/CardMenu";
import { Dishes } from "../dishes/Dishes";
import { Menu } from "../menu/Menu";

export class CompositionCardMenu{
  id: number;

  detail: string;

  menu: Menu;
  cardMenu: CardMenu;

  isDeleted: boolean;


}
