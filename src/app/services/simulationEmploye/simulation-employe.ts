import { Profil } from "../profil/profil";
import { Simulation } from "../simulation/simulation";

export class SimulationEmploye {
    id: number;
    refProfilEmploye: Profil;
    nombreEmploye: number;
    montantUnitaire: number;
    refSimulation: Simulation;

    total:number

}
