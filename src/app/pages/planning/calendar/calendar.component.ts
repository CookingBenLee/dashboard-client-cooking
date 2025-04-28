import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() selectedDate: Date = new Date();
  @Output() dateSelected = new EventEmitter<Date>();

  weeks: Date[][] = [];
  currentMonth: Date = new Date();
  weekDays: string[] = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];

  constructor() {}

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
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
  }

  onDateClick(date: Date) {
    this.selectedDate = date;
    this.dateSelected.emit(date);
  }

  isSelectedDate(date: Date): boolean {
    return date.toDateString() === this.selectedDate.toDateString();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth.getMonth();
  }

  previousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  getMonthAndYear(): string {
    return this.currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  }
} 