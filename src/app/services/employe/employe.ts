import { Utilisateur } from "src/app/entity/Utilisateur";
import { Profil } from "../profil/profil";

export class Employe {

  id: number;
  poste?: string;
  salaire: number;
  profil:Profil
  refuser?: Utilisateur | null;
}
