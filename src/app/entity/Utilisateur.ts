import { Address } from "../services/address/Address";
import { Country } from "../services/country/Country";
import { TypeCompte } from "./TypeCompte";

export class Utilisateur{
  id: number;
  nom: String;
  prenom: String;
  login: String;
  password: String
  denomination: String;
  typeCompte: TypeCompte;
  adresse: Address;
  country: Country;
}
