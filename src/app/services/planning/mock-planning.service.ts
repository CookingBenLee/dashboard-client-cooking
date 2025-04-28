import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IPlanningService, PlanningPayload, PlanningResponse } from './planning.interface';

export interface MealSlot {
  id: string;
  number: string;
  type: string;
  timeSlot: string;
  date: Date;
}

export interface DailyPlanning {
  matin: MealSlot[];
  midi: MealSlot[];
  soir: MealSlot[];
}

@Injectable({
  providedIn: 'root'
})
export class MockPlanningService implements IPlanningService {
  private mockData: PlanningResponse[] = [];
  private lastId = 0;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Create some initial mock data for the next 30 days
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part to midnight

    // Add specific test planning for today
    // Two meals at midi
    this.mockData.push({
      id: ++this.lastId,
      refdishes: 1,
      quantite: 25,
      date_planning: today.toISOString().split('T')[0],
      heuredebut: '12:00',
      heurefin: '14:00',
      periode: 'Midi',
      refcompteuser: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    this.mockData.push({
      id: ++this.lastId,
      refdishes: 2,
      quantite: 30,
      date_planning: today.toISOString().split('T')[0],
      heuredebut: '12:00',
      heurefin: '14:00',
      periode: 'Midi',
      refcompteuser: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // One meal at soir
    this.mockData.push({
      id: ++this.lastId,
      refdishes: 3,
      quantite: 20,
      date_planning: today.toISOString().split('T')[0],
      heuredebut: '19:00',
      heurefin: '21:00',
      periode: 'Soir',
      refcompteuser: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Add some random data for other days
    for (let i = 1; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      if (Math.random() > 0.7) { // Reduce frequency of random entries
        this.mockData.push(this.createMockPlanning(date, 'Matin'));
        this.mockData.push(this.createMockPlanning(date, 'Midi'));
        this.mockData.push(this.createMockPlanning(date, 'Soir'));
      }
    }
  }

  private createMockPlanning(date: Date, periode: 'Matin' | 'Midi' | 'Soir'): PlanningResponse {
    this.lastId++;
    return {
      id: this.lastId,
      refdishes: Math.floor(Math.random() * 10) + 1,
      quantite: Math.floor(Math.random() * 50) + 1,
      date_planning: date.toISOString().split('T')[0],
      heuredebut: periode === 'Matin' ? '08:00' : periode === 'Midi' ? '12:00' : '19:00',
      heurefin: periode === 'Matin' ? '10:00' : periode === 'Midi' ? '14:00' : '21:00',
      periode: periode,
      refcompteuser: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  createPlanning(payload: PlanningPayload): Observable<PlanningResponse> {
    const response: PlanningResponse = {
      id: ++this.lastId,
      ...payload,
      date_planning: payload.date_planning.toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.mockData.push(response);
    return of(response).pipe(delay(500)); // Simulate network delay
  }

  createPlanningBatch(payloads: PlanningPayload[]): Observable<PlanningResponse[]> {
    const responses = payloads.map(payload => {
      this.lastId++;
      return {
        id: this.lastId,
        refdishes: payload.refdishes,
        quantite: payload.quantite,
        date_planning: payload.date_planning.toISOString().split('T')[0],
        heuredebut: payload.heuredebut,
        heurefin: payload.heurefin,
        periode: payload.periode,
        refcompteuser: payload.refcompteuser,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });
    
    this.mockData.push(...responses);
    return of(responses).pipe(delay(500)); // Simulate network delay
  }

  getPlanningForDate(date: Date): Observable<PlanningResponse[]> {
    const formattedDate = date.toISOString().split('T')[0];
    const plannings = this.mockData.filter(p => p.date_planning === formattedDate);
    return of(plannings).pipe(delay(300));
  }

  updatePlanning(id: number, payload: Partial<PlanningPayload>): Observable<PlanningResponse> {
    const index = this.mockData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Planning not found');
    }

    const updated: PlanningResponse = {
      ...this.mockData[index],
      ...payload,
      date_planning: payload.date_planning ? payload.date_planning.toISOString().split('T')[0] : this.mockData[index].date_planning,
      updated_at: new Date().toISOString()
    };
    
    this.mockData[index] = updated;
    return of(updated).pipe(delay(300));
  }

  deletePlanning(id: number): Observable<void> {
    const index = this.mockData.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockData.splice(index, 1);
    }
    return of(void 0).pipe(delay(300));
  }

  // Helper method to check if a date has any planning
  hasPlanning(date: Date): Observable<boolean> {
    const formattedDate = date.toISOString().split('T')[0];
    const hasPlanning = this.mockData.some(p => p.date_planning === formattedDate);
    return of(hasPlanning).pipe(delay(100));
  }

  getAllPlannings(): Observable<PlanningResponse[]> {
    return of([...this.mockData]).pipe(delay(300));
  }

  getDishes(): Observable<Array<{ id: string; name: string }>> {
    const mockDishes = [
      { id: '1', name: 'Coq au Vin' },
      { id: '2', name: 'Ratatouille' },
      { id: '3', name: 'Bœuf Bourguignon' },
      { id: '4', name: 'Quiche Lorraine' },
      { id: '5', name: 'Soupe à l\'Oignon' },
      { id: '6', name: 'Croque Monsieur' },
      { id: '7', name: 'Salade Niçoise' },
      { id: '8', name: 'Cassoulet' },
      { id: '9', name: 'Blanquette de Veau' },
      { id: '10', name: 'Tarte Tatin' }
    ];
    return of(mockDishes).pipe(delay(300));
  }
} 