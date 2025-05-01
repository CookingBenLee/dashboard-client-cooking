import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localeFr from '@angular/common/locales/fr';
import { MockPlanningService, DailyPlanning } from '../../services/planning/mock-planning.service';
import { PlanningPayload, PlanningResponse } from '../../services/planning/planning.interface';
import { NouvellePlanificationComponent } from './nouvelle-planification/nouvelle-planification.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList, faPlus, faInfoCircle, faSearch, faEdit, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DishDetailsPopupComponent } from '../plat/dish-details-popup/dish-details-popup.component';

registerLocaleData(localeFr);

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NouvellePlanificationComponent,
    DatePipe,
    FontAwesomeModule,
    DishDetailsPopupComponent
  ]
})
export class PlanningComponent implements OnInit {
  // Font Awesome icons
  faList = faList;
  faPlus = faPlus;
  faInfoCircle = faInfoCircle;
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  faCheck = faCheck;
  faTimes = faTimes;

  currentView: 'list' | 'details' | 'new' = 'list';
  selectedDate: Date = new Date();
  currentMonth: Date = new Date();
  weeks: Date[][] = [];
  currentPlanning: any = {
    matin: [],
    midi: [],
    soir: []
  };
  selectedDish: any = null;
  
  filterStartDate: string = '';
  filterEndDate: string = '';
  allPlannings: PlanningResponse[] = [];
  filteredPlannings: PlanningResponse[] = [];
  editingPlanning: PlanningResponse | null = null;
  dishes: Array<{ id: string; name: string; category: string }> = [];

  planningLines: { date: Date; dish: string; quantity: number; startTime: string; endTime: string; period: string }[] = [];

  categories: string[] = ['Entrée', 'Plat Principal', 'Dessert', 'Collation'];

  showDishPopup = false;

  constructor(private planningService: MockPlanningService) {
    this.generateCalendar();
    this.initializeFilters();
    this.loadDishes();
  }

  ngOnInit(): void {
    this.loadTodayPlanning();
  }

  loadTodayPlanning() {
    // Load today's planning by default
    this.onDateSelect(new Date());
  }

  showDishDetails(dishId: string) {
    // Get full dish details from the service
    this.planningService.getDishDetails(dishId).subscribe({
      next: (dish) => {
        this.selectedDish = dish;
        this.showDishPopup = true;
      },
      error: (error) => {
        console.error('Error loading dish details:', error);
      }
    });
  }

  switchView(view: 'list' | 'details' | 'new') {
    this.currentView = view;
    if (view === 'list') {
      this.selectedDish = null;
    }
  }

  private loadPlanningForDate(date: Date): void {
    
    const planningsForDate = this.allPlannings.filter(p => {
      const planningDate = new Date(p.date_planning);
      return planningDate.toDateString() === date.toDateString();
    });

    if (planningsForDate.length > 0) {
      this.updateCurrentPlanning(planningsForDate);
    } else {
     
      this.planningService.getPlanningForDate(date).subscribe(plannings => {
        this.updateCurrentPlanning(plannings);
      });
    }
  }

  private updateCurrentPlanning(plannings: PlanningResponse[]): void {
    this.currentPlanning = {
      matin: plannings.filter(p => p.periode === 'Matin').map(p => ({
        id: p.refdishes.toString(),
        number: p.quantite.toString(),
        type: this.getDishName(p.refdishes.toString()),
        timeSlot: `${p.heuredebut}-${p.heurefin}`,
        date: new Date(p.date_planning)
      })),
      midi: plannings.filter(p => p.periode === 'Midi').map(p => ({
        id: p.refdishes.toString(),
        number: p.quantite.toString(),
        type: this.getDishName(p.refdishes.toString()),
        timeSlot: `${p.heuredebut}-${p.heurefin}`,
        date: new Date(p.date_planning)
      })),
      soir: plannings.filter(p => p.periode === 'Soir').map(p => ({
        id: p.refdishes.toString(),
        number: p.quantite.toString(),
        type: this.getDishName(p.refdishes.toString()),
        timeSlot: `${p.heuredebut}-${p.heurefin}`,
        date: new Date(p.date_planning)
      }))
    };
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startingDay = firstDay.getDay();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startingDay);
    
    this.weeks = [];
    let currentWeek: Date[] = [];
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      if (i % 7 === 0 && i > 0) {
        this.weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(currentDate);
    }
    
    if (currentWeek.length > 0) {
      this.weeks.push(currentWeek);
    }

 
    this.weeks.flat().forEach(date => {
      this.planningService.hasPlanning(date).subscribe(has => {
        if (has) {
         
          this.updatePlanningStatus(date, has);
        }
      });
    });
  }

  private planningStatus = new Map<string, boolean>();

  private updatePlanningStatus(date: Date, hasPlanning: boolean): void {
    const dateKey = date.toISOString().split('T')[0];
    this.planningStatus.set(dateKey, hasPlanning);
  }

  public hasDatePlanning(date: Date): boolean {
    const dateKey = date.toISOString().split('T')[0];
    return this.planningStatus.get(dateKey) || false;
  }

  previousMonth(): void {
    const newDate = new Date(this.currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    this.currentMonth = newDate;
    this.generateCalendar();
  }

  nextMonth(): void {
    const newDate = new Date(this.currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentMonth = newDate;
    this.generateCalendar();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth.getMonth();
  }

  isSelectedDate(date: Date): boolean {
    return date.toDateString() === this.selectedDate.toDateString();
  }

  hasPlanning(date: Date): boolean {
    return this.hasDatePlanning(date);
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  onDateSelect(date: Date): void {
    this.selectedDate = date;
    this.loadPlanningForDate(date);
  }

  openNewPlanningModal(): void {
    this.currentView = 'new';
  }

  closeModal(): void {
    this.currentView = 'list';
  }

  onSavePlanning(event: any): void {
    const planning = event as PlanningResponse;
    const payload: PlanningPayload = {
      refdishes: planning.refdishes,
      quantite: planning.quantite,
      date_planning: new Date(planning.date_planning),
      heuredebut: planning.heuredebut,
      heurefin: planning.heurefin,
      periode: planning.periode,
      refcompteuser: 1
    };

    this.planningService.createPlanning(payload).subscribe({
      next: (response) => {
     
        this.allPlannings.push(response);
       
        if (this.isDateInRange(new Date(response.date_planning))) {
          this.filteredPlannings.push(response);
        }
      
        this.loadPlanningForDate(this.selectedDate);
    
        this.generateCalendar();
      },
      error: (error) => {
        console.error('Error creating planning:', error);
      }
    });
    
    this.closeModal();
  }

  private isDateInRange(date: Date): boolean {
    if (!this.filterStartDate || !this.filterEndDate) return true;
    const start = new Date(this.filterStartDate);
    const end = new Date(this.filterEndDate);
    return date >= start && date <= end;
  }

  selectPeriod(period: 'matin' | 'midi' | 'soir') {
    // Implementation needed
  }

  resetFilters(): void {
    this.initializeFilters();
  }

  deletePlanning(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette planification ?')) {
      this.planningService.deletePlanning(id).subscribe({
        next: () => {
        
          this.allPlannings = this.allPlannings.filter(p => p.id !== id);
       
          this.filteredPlannings = this.filteredPlannings.filter(p => p.id !== id);
          
        
          this.loadPlanningForDate(this.selectedDate);
          
        
          this.generateCalendar();
        },
        error: (error) => {
          console.error('Error deleting planning:', error);
        }
      });
    }
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  editPlanning(planning: PlanningResponse): void {
    this.selectedDate = new Date(planning.date_planning);
    this.currentView = 'new';
    
   
    this.planningLines = [{
      date: new Date(planning.date_planning),
      dish: planning.refdishes.toString(),
      quantity: planning.quantite,
      startTime: planning.heuredebut,
      endTime: planning.heurefin,
      period: planning.periode
    }];
  }

  loadDishes(): void {
    this.planningService.getDishes().subscribe({
      next: (dishes) => {
        this.dishes = dishes;
      },
      error: (error) => {
        console.error('Error loading dishes:', error);
      }
    });
  }

  startEditing(planning: PlanningResponse): void {
    this.editingPlanning = { ...planning };
  }

  cancelEditing(): void {
    this.editingPlanning = null;
  }

  saveEditing(): void {
    if (!this.editingPlanning) return;

    const payload: PlanningPayload = {
      refdishes: this.editingPlanning.refdishes,
      quantite: this.editingPlanning.quantite,
      date_planning: new Date(this.editingPlanning.date_planning),
      heuredebut: this.editingPlanning.heuredebut,
      heurefin: this.editingPlanning.heurefin,
      periode: this.editingPlanning.periode,
      refcompteuser: 1
    };

    this.planningService.updatePlanning(this.editingPlanning.id, payload).subscribe({
      next: (response) => {
       
        const allIndex = this.allPlannings.findIndex(p => p.id === response.id);
        if (allIndex !== -1) {
          this.allPlannings[allIndex] = response;
        }

        const filteredIndex = this.filteredPlannings.findIndex(p => p.id === response.id);
        if (filteredIndex !== -1) {
          this.filteredPlannings[filteredIndex] = response;
        }

        this.loadPlanningForDate(this.selectedDate);
      
        this.generateCalendar();

        this.editingPlanning = null;
      },
      error: (error) => {
        console.error('Error updating planning:', error);
      }
    });
  }

  getDishName(dishId: string): string {
    const dish = this.dishes.find(d => d.id === dishId);
    return dish ? dish.name : `Plat ${dishId}`;
  }

  getDishCategory(dishId: string): string {
    const dish = this.dishes.find(d => d.id === dishId);
    return dish?.category || 'Non spécifié';
  }

  private initializeFilters(): void {
   
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    this.filterStartDate = this.formatDateForInput(firstDay);
    this.filterEndDate = this.formatDateForInput(lastDay);
    
    this.loadAllPlannings();
  }

  private loadAllPlannings(): void {
    this.planningService.getAllPlannings().subscribe(plannings => {
      this.allPlannings = plannings;
      this.applyDateFilter();
    });
  }

  applyDateFilter(): void {
    if (!this.filterStartDate || !this.filterEndDate) {
      this.filteredPlannings = this.allPlannings;
      return;
    }

    const start = new Date(this.filterStartDate);
    const end = new Date(this.filterEndDate);
    
  
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    this.filteredPlannings = this.allPlannings.filter(planning => {
      const planningDate = new Date(planning.date_planning);
      planningDate.setHours(0, 0, 0, 0);
      return planningDate >= start && planningDate <= end;
    });
  }

  closeDishPopup() {
    this.showDishPopup = false;
    this.selectedDish = null;
  }
} 