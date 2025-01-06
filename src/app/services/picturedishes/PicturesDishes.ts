import { Dishes } from "../dishes/Dishes";

export class PicturesDishes{

  id: number;

  label: string;

  link: string;
  description: string;


  file:any
  filebase64:any
  createdDate: Date;
  isDeleted: boolean;
  refdishe: Dishes;
}
