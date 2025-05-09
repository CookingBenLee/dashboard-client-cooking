import { Observable } from 'rxjs';
import { Dishes } from '../dishes/Dishes';

export interface PlanningPayload {
  refdishes: number;
  quantite: number;
  date_planning: Date;
  heuredebut: string;
  heurefin: string;
  periode: 'Matin' | 'Midi' | 'Soir';
  refcompteuser: number;
}

export interface PlanningResponse {
  id: number;
  refdishes: number;
  quantite: number;
  date_planning: string;
  heuredebut: string;
  heurefin: string;
  periode: 'Matin' | 'Midi' | 'Soir';
  refcompteuser: number;
  created_at: string;
  updated_at: string;
  category?: string;
  name?: string;
}

export interface IPlanningService {
  createPlanning(payload: PlanningPayload): Observable<PlanningResponse>;
  createPlanningBatch(payloads: PlanningPayload[]): Observable<PlanningResponse[]>;
  getPlanningForDate(date: Date): Observable<PlanningResponse[]>;
  updatePlanning(id: number, payload: Partial<PlanningPayload>): Observable<PlanningResponse>;
  deletePlanning(id: number): Observable<void>;
  hasPlanning(date: Date): Observable<boolean>;
  getAllPlannings(): Observable<PlanningResponse[]>;
  getDishes(): Observable<Array<{ id: string; name: string; category: string }>>;
  getDishDetails(dishId: string): Observable<Dishes>;
} 