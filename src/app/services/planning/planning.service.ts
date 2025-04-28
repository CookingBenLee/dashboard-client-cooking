import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IPlanningService, PlanningPayload, PlanningResponse } from './planning.interface';

@Injectable({
  providedIn: 'root'
})
export class PlanningService implements IPlanningService {
  private apiUrl = `${environment.apiUrl}/planning`;

  constructor(private http: HttpClient) {}

  createPlanning(payload: PlanningPayload): Observable<PlanningResponse> {
    return this.http.post<PlanningResponse>(this.apiUrl, payload);
  }

  getPlanningForDate(date: Date): Observable<PlanningResponse[]> {
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get<PlanningResponse[]>(`${this.apiUrl}/date/${formattedDate}`);
  }

  updatePlanning(id: number, payload: Partial<PlanningPayload>): Observable<PlanningResponse> {
    return this.http.put<PlanningResponse>(`${this.apiUrl}/${id}`, payload);
  }

  deletePlanning(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createPlanningBatch(payloads: PlanningPayload[]): Observable<PlanningResponse[]> {
    return this.http.post<PlanningResponse[]>(`${this.apiUrl}/batch`, payloads);
  }
} 