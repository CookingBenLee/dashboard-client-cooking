import { ECategoryOperation } from "./ECategoryOperation";

export class CategoryOperation {
  id: number;
  libelle: string;
  detail?: string;
  sens: ECategoryOperation;
  // opEmploye: boolean;
  montant:number;
  isEmploye: boolean;

  //
  nbre:number=0
  totalPrice:number=0

}
