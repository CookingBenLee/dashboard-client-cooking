import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockPlanningService } from '../../../services/planning/mock-planning.service';
import { PlanningPayload, PlanningResponse } from '../../../services/planning/planning.interface';
import { PlanningService } from 'src/app/services/planning/planning.service';
import { DishesService } from 'src/app/services/dishes/dishes.service';
import { Dishes } from 'src/app/services/dishes/Dishes';
import { TokenService } from 'src/app/services/token/token.service';


interface SimplifiedDish {
  id: string;
  name: string;
  category: string;
}
interface PlanningLine {
  date: Date;
  dish: string;
  quantity: number;
  startTime: string;
  endTime: string;
  period: 'Matin' | 'Midi' | 'Soir';
}

@Component({
  selector: 'app-nouvelle-planification',
  templateUrl: './nouvelle-planification.component.html',
  styleUrls: ['./nouvelle-planification.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class NouvellePlanificationComponent implements OnInit {
  @Input() isOpen = false;
  @Input() displayMode: 'modal' | 'card' = 'modal';
  @Input() selectedDate: Date = new Date();
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<PlanningResponse>();
  mydate: Date = new Date();
  dateStart: string = '';
  dateEnd: string = '';

  currentLine: {
    dish: string;
    quantity: number;
    startTime: string;
    endTime: string;
    period: 'Matin' | 'Midi' | 'Soir';
  } = {
    dish: '',
    quantity: 1,
    startTime: '08:00',
    endTime: '10:00',
    period: 'Matin'
  };

  planningLines: PlanningLine[] = [];

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  dishes: Array<{ id: string; name: string }> = [];
  periods: Array<'Matin' | 'Midi' | 'Soir'> = ['Matin', 'Midi', 'Soir'];

  private readonly periodTimes: Record<'Matin' | 'Midi' | 'Soir', { start: string; end: string }> = {
    'Matin': { start: '08:00', end: '10:00' },
    'Midi': { start: '12:00', end: '14:00' },
    'Soir': { start: '19:00', end: '21:00' }
  };

  constructor(private planningService: PlanningService,private dishService:DishesService,private tokenService:TokenService) {}

  ngOnInit(): void {
    this.loadDishes();
    if (this.mydate) {
      const formattedDate = this.formatDateForInput(this.mydate);
      this.dateStart = formattedDate;
      this.dateEnd = formattedDate;
    }
    this.onPeriodChange(this.currentLine.period);
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

 
  async loadDishes(): Promise<void> {
    try {
      // Assuming you have access to the current user's ID
      const currentUser = this.tokenService.getUser();
    const userId = currentUser.id; // The us/ You'll need to implement this or get it from your auth service
      const dishes = await this.dishService.getAll(userId);
      this.dishes =this.mapDishesToSimplifiedFormat( dishes);
      console.log('================================got the following Dishes:', this.dishes);
    } catch (error) {
      console.error('Error loading dishes:', error);
    }
  }

  private mapDishesToSimplifiedFormat(dishes: Dishes[]): SimplifiedDish[] {
    return dishes.map(dish => ({
      id: dish.id.toString(), // Convert number to string if needed
      name: dish.name,
      category: dish.categoryMenu?.name || '' // Assuming categoryMenu contains the category name
    }));
  }

  onPeriodChange(period: 'Matin' | 'Midi' | 'Soir'): void {
    const times = this.periodTimes[period];
    if (times) {
      this.currentLine.startTime = times.start;
      this.currentLine.endTime = times.end;
      this.currentLine.period = period;
    }
  }

  canAddLine(): boolean {
    return !!(
      this.dateStart &&
      this.currentLine.dish &&
      this.currentLine.quantity > 0 &&
      this.currentLine.period
    );
  }

  onDateChange(newDate: string): void {
    this.dateStart = newDate;
    this.dateEnd = newDate;
  }

  addLine(): void {
    if (!this.canAddLine()) return;

    const date = new Date(this.dateStart);
      
    if (this.planningLines.some(l => 
      l.dish === this.currentLine.dish && 
      l.period === this.currentLine.period && 
      this.formatDate(l.date) === this.formatDate(date)
    )) {
      this.errorMessage = 'Unicité sur l\'ajout : Plat+Période+Date';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.planningLines.push({
      date: new Date(date),
      dish: this.currentLine.dish,
      quantity: this.currentLine.quantity,
      startTime: this.currentLine.startTime,
      endTime: this.currentLine.endTime,
      period: this.currentLine.period
    });
  }

  removeLine(index: number): void {
    this.planningLines.splice(index, 1);
  }

  getDishName(dishId: string): string {
    const dish = this.dishes.find(d => d.id === dishId);
    return dish ? dish.name : '';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  onSubmit(): void {
    if (this.planningLines.length === 0) return;
    
    this.isSubmitting = true;
    const currentUser = this.tokenService.getUser();

    // Map to match backend PlanningDishes structure
    const payload = this.planningLines.map(line => ({
      quantite: line.quantity,
      datePlanning: new Date(line.date).toISOString(), // Convert to ISO string
      heureDebut: line.startTime,  // Already in correct format "HH:mm"
      heureFin: line.endTime,      // Already in correct format "HH:mm"
      periode: line.period,        // Matches EPlanningDishes enum
      dishesId: {
        id: Number(line.dish)      // Reference to Dishes entity
      },
      userId: {
        id: currentUser.id         // Reference to Utilisateur entity
      },
      isDeleted: false
    }));

    console.log('Planning Lines (raw):', this.planningLines);
    console.log('Payload being sent to backend:', payload);
    console.log('Current User:', currentUser);

    // Single planning creation
    for (const line of payload) {
    
      console.log('Sending single planning:', line);
      this.planningService.create(line).subscribe({
        next: (response) => {
          console.log('Backend response:', response);
          this.successMessage = 'Planification créée avec succès';
          setTimeout(() => {
            this.successMessage = '';
            this.save.emit(response);
            this.closeModal();
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating planning:', error);
          this.errorMessage = 'Erreur lors de la création de la planification';
          setTimeout(() => this.errorMessage = '', 3000);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } 
    // Implement a batch creation feature later
    // else {
    //   console.log('Sending batch plannings:', payload);
    //   this.planningService.createBatch(payload).subscribe({
    //     next: (response) => {
    //       console.log('Backend response for batch:', response);
    //       this.successMessage = 'Planifications créées avec succès';
    //       setTimeout(() => {
    //         this.successMessage = '';
    //         if (response && response.length > 0) {
    //           this.save.emit(response[0]);
    //         }
    //         this.closeModal();
    //       }, 2000);
    //     },
    //     error: (error) => {
    //       console.error('Error creating plannings:', error);
    //       this.errorMessage = 'Erreur lors de la création des planifications';
    //       setTimeout(() => this.errorMessage = '', 3000);
    //     },
    //     complete: () => {
    //       this.isSubmitting = false;
    //     }
    //   });
    // }
  }

  closeModal(): void {
    this.planningLines = [];
    this.currentLine = {
      dish: '',
      quantity: 1,
      startTime: '08:00',
      endTime: '10:00',
      period: 'Matin'
    };
    this.dateStart = '';
    this.dateEnd = '';
    this.close.emit();
  }
} 