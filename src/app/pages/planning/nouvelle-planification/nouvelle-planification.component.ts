import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockPlanningService } from '../../../services/planning/mock-planning.service';
import { PlanningPayload, PlanningResponse } from '../../../services/planning/planning.interface';

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

  constructor(private planningService: MockPlanningService) {}

  ngOnInit(): void {
    this.loadDishes();
    if (this.selectedDate) {
      const formattedDate = this.formatDateForInput(this.selectedDate);
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

  loadDishes(): void {
    this.planningService.getDishes().subscribe({
      next: (dishes) => {
        this.dishes = dishes;
      },
      error: (error) => {
        console.error('Error loading dishes:', error);
        this.errorMessage = 'Erreur lors du chargement des plats';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
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
    const payload: PlanningPayload[] = this.planningLines.map(line => ({
      refdishes: Number(line.dish),
      quantite: line.quantity,
      date_planning: line.date,
      heuredebut: line.startTime,
      heurefin: line.endTime,
      periode: line.period,
      refcompteuser: 1
    }));

    this.planningService.createPlanningBatch(payload).subscribe({
      next: (response) => {
        this.successMessage = 'Planification(s) créée(s) avec succès';
        setTimeout(() => {
          this.successMessage = '';
          this.save.emit(response[0]);
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