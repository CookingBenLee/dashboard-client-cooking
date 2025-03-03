import { Dishes } from "../dishes/Dishes";
import { Simulation } from "../simulation/simulation";

export class EstimationVente {
  id: number;
  dateDebut?: Date | null;
  dateFin?: Date | null;
  frequence?: String | null;
  isDeleted?: boolean | null;
  prixUnitaire: number;
  nbreEstime: number | 0;
  facteurMultiplicatif: number | 0;
  dishesId: Dishes ;
  //dishesList?: Dishes [];

  refSimulation: Simulation;


  ///////
  total:number
  prixRevient:number


}

