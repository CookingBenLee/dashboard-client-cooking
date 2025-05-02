export interface MealPlanning {
  id?: number;           
  refdishes: number;     
  quantite: number;     
  date_planning: Date;   
  heuredebut: string;   
  heurefin: string;      
  periode: 'Matin' | 'Midi' | 'Soir';  
  refcompteuser: number; 
} 