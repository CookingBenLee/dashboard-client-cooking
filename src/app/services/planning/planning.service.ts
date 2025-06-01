import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PlanningPayload, PlanningResponse } from './planning.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private readonly baseUrl = `${environment.apiUrl}/planning-dishe`;

  constructor(private http: HttpClient) {}

  // Create
  create(planning: any): Observable<PlanningResponse> {
    return this.http.post<{ data: PlanningResponse }>(`${this.baseUrl}/new`, planning).pipe(
      map(response => response.data)
    );
  }

  // Read by ID
  getById(id: number): Observable<PlanningResponse> {
    return this.http.get<{ data: PlanningResponse }>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Get all (paginated)
  getAll(page: number = 0, size: number = 100): Observable<PlanningResponse[]> {
    return this.http.get<{ content: PlanningResponse[] }>(`${this.baseUrl}/all?page=${page}&size=${size}`).pipe(
      map(response => response.content)
    );
  }

  // Get by date
  getByDate(date: Date): Observable<PlanningResponse[]> {
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get<PlanningResponse[]>(`${this.baseUrl}/by-date/${formattedDate}`);
  }

  // Get by date range
  getByDateRange(startDate: string, endDate: string): Observable<PlanningResponse[]> {
    return this.http.get<PlanningResponse[]>(`${this.baseUrl}/by-date-range?startDate=${startDate}&endDate=${endDate}`);
  }

  // Update
  update(id: number, planning: any): Observable<PlanningResponse> {
    return this.http.put<{ data: PlanningResponse }>(`${this.baseUrl}/update/${id}`, planning).pipe(
      map(response => response.data)
    );
  }

  // Delete
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  //
  getAllBetweenDates(data: any): Observable<Map<string, any>> {
    return this.http.post<Map<string, any>>(`${this.baseUrl}/filter-planning`, data);
  }
}
