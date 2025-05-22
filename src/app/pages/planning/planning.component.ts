import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localeFr from '@angular/common/locales/fr';
import { PlanningPayload, PlanningResponse } from '../../services/planning/planning.interface';
import { NouvellePlanificationComponent } from './nouvelle-planification/nouvelle-planification.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList, faPlus, faInfoCircle, faSearch, faEdit, faTrash, faCheck, faTimes, faUtensilSpoon } from '@fortawesome/free-solid-svg-icons';
import { DishDetailsPopupComponent } from '../plat/dish-details-popup/dish-details-popup.component';
import { PlanningService } from 'src/app/services/planning/planning.service';
import { DishesService } from 'src/app/services/dishes/dishes.service';
import { Dishes } from 'src/app/services/dishes/Dishes';
import { TokenService } from 'src/app/services/token/token.service';
import { CompositiondishesService } from 'src/app/services/compositiondishes/compositiondishes.service';
import { PicturesDishes } from 'src/app/services/picturedishes/PicturesDishes';
import { CompositionDishes } from 'src/app/services/compositiondishes/CompositionDishes';
import { PictiuredishesService } from 'src/app/services/picturedishes/pictiuredishes.service';
import { DetailsRecipe } from 'src/app/services/detailsrecipe/DetailsRecipe';
import { Recipe } from 'src/app/services/recipe/Recipe';
import { FileSaverService } from 'src/app/services/fileSaver/file-saver.service';
import { DetailsrecipeService } from 'src/app/services/detailsrecipe/detailsrecipe.service';
import { DetaildishesComponent } from '../plat/detaildishes/detaildishes.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModaldishesComponent } from '../plat/modaldishes/modaldishes.component';
import { DetailEstimationComponent } from '../planification/detail-estimation/detail-estimation.component';

registerLocaleData(localeFr);


interface SimplifiedDish {
  id: string;
  name: string;
  category: string;
}

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
  ],
  providers: [DialogService]
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
  faUtensilSpoon = faUtensilSpoon;

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
  allPlanningss: any;
  filteredPlannings: PlanningResponse[] = [];
  editingPlanning: PlanningResponse | null = null;
  dishes: Array<{ id: string; name: string; category: string }> = [];

  planningLines: { date: Date; dish: string; quantity: number; startTime: string; endTime: string; period: string }[] = [];

  categories: string[] = ['Entrée', 'Plat Principal', 'Dessert', 'Collation'];

  showDishPopup = false;
  picturesDishes: PicturesDishes[] = []
  picture: PicturesDishes = new PicturesDishes()
  compositionDishes: CompositionDishes[] = []
  plat: Dishes = new Dishes()
  constructor(private planningService: PlanningService, private dishService: DishesService, private tokenService: TokenService, private compositionDishesService: CompositiondishesService,
    private pictureDishesService: PictiuredishesService, private fileSaverService: FileSaverService, private detailRecipeService: DetailsrecipeService,
    private dialogService: DialogService,
  ) {
    this.generateCalendar();
    this.initializeFilters();
    this.loadDishes();
  }

  ngOnInit(): void {
    this.planningService.getAll().subscribe({
      next: (plannings) => {
        this.allPlanningss = plannings;
        // console.log("all planning", this.allPlanningss);

        this.allPlannings = this.mapBackendResponseToPlanning(plannings);
        this.generateCalendar();
        this.loadTodayPlanning();
      },
      error: (error) => {
        console.error('Error loading plannings:', error);
      }
    });


  }

  loadTodayPlanning() {
    // Load today's planning by default
    this.onDateSelect(new Date());
  }
  ref: DynamicDialogRef | undefined;
  async showDishDetails(e: any, dishe: any) {
    const dish = await this.dishService.getById(dishe.id);
    // try {
    //   const dish = await this.dishService.getById(dishId);
    //   console.log('================================got the following Dish:', dish);
    //   this.getAll(dish.id);
    //   this.selectedDish = dish;
    //   this.showDishPopup = true;
    // } catch (error) {
    //   console.error('Error loading dish details:', error);
    // }
    // console.log("dishe",dishe);

    this.ref = this.dialogService.open(DishDetailsPopupComponent, {
      header: 'Plat ' + dishe?.dishesId.name,
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: dishe,
    });


    this.ref.onClose.subscribe((retour: any) => {
      if (retour == "edit") {
        this.show(e, dishe);
        // this.messageService.add({ severity: 'success',key:'product', summary: 'Produit Crée ', detail: "Produit ajouté avec success" });
        // this.getProducts()
      } else {
        this.ref?.close
        //this.messageService.add({ severity: 'info',key:'product', summary: 'Produit non ajouté ', detail: "Ajout de Produit non effectué" });

      }
    });

  }

  show(e: any, dishe: Dishes) {
    this.ref = this.dialogService.open(ModaldishesComponent, {
      header: "Modification d'un plat",
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: dishe,
    });


    this.ref.onClose.subscribe((retour: any) => {
      // console.log("hhhhhhhhhhhh....///jkjhghf");

    });
  }

  switchView(view: 'list' | 'details' | 'new') {
    this.currentView = view;
    this.ngOnInit();
    if (view === 'list') {
      this.selectedDish = null;
    }
     this.ngOnInit();
  }

  onDateSelect(date: Date): void {
    // console.log('Date selected:', date);
    this.selectedDate = date;
    this.getHasPlanning(date);
    // this.loadPlanningForDate(date);
  }

  private loadPlanningForDate(date: Date): void {
    // console.log('Loading planning for date:', date);

    const planningsForDate = this.allPlannings.filter(p => {
      const planningDate = new Date(p.date_planning);
      return planningDate.toDateString() === date.toDateString();
    });

    // console.log('Found plannings:', planningsForDate);

    if (planningsForDate.length > 0) {
      this.updateCurrentPlanning(planningsForDate);
    } else {
      this.planningService.getByDate(date).subscribe({
        next: (plannings) => {
          // console.log('Fetched plannings from service:', plannings);
          this.updateCurrentPlanning(plannings);
        },
        error: (error) => {
          console.error('Error loading planning for date:', error);
        }
      });
    }
  }

  private updateCurrentPlanning(plannings: any[]): void {
    // console.log('Starting updateCurrentPlanning with:', plannings);

    this.currentPlanning = {
      matin: plannings
        .filter(p => p.periode === 'Matin')
        .map(p => ({
          id: p.refdishes.toString(),
          number: p.quantite.toString(),
          type: p.category,
          timeSlot: `${p.heuredebut}-${p.heurefin}`,
          date: new Date(p.date_planning)
        })),
      midi: plannings
        .filter(p => p.periode === 'Midi')
        .map(p => ({
          id: p.refdishes.toString(),
          number: p.quantite.toString(),
          type: p.category,
          timeSlot: `${p.heuredebut}-${p.heurefin}`,
          date: new Date(p.date_planning)
        })),
      soir: plannings
        .filter(p => p.periode === 'Soir')
        .map(p => ({
          id: p.refdishes.toString(),
          number: p.quantite.toString(),
          type: p.category,
          timeSlot: `${p.heuredebut}-${p.heurefin}`,
          date: new Date(p.date_planning)
        }))
    };

    // console.log('Updated currentPlanning:', this.currentPlanning);
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // getDay(): 0 (dimanche) à 6 (samedi)
    // Pour commencer par lundi, on transforme dimanche (0) en 7
    const startOffset = (firstDay.getDay() + 6) % 7;

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startOffset);

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
      const hasPlanning = this.hasPlanning(date);
      this.updatePlanningStatus(date, hasPlanning);
    });
  }


  private planningStatus = new Map<string, boolean>();

  private updatePlanningStatus(date: Date, hasPlanning: boolean): void {
    const dateKey = date.toISOString().split('T')[0];
    this.planningStatus.set(dateKey, hasPlanning);
  }

  planning: any;
  matin: any[] = [];
  midi: any[] = [];
  soir: any[] = [];
  getHasPlanning(selectedDate: Date): void {
    // console.log('Date selected:', selectedDate);
    // console.log("All Planning", this.allPlanningss);

    const currentUser = this.tokenService.getUser();
    const userId = currentUser.id;
    // console.log("userId", userId);

    this.matin = [];
    this.midi = [];
    this.soir = [];

    this.planning = this.allPlanningss.filter((e: any) => {
      const planningDate = new Date(e.datePlanning);
      return planningDate.toDateString() === selectedDate.toDateString() &&
        e.userId.id === userId;
    });

    // console.log("His Planning", this.planning);

    this.planning.forEach((item: any) => {
      switch (item.periode) {
        case 'Matin':
          this.matin.push(item);
          break;
        case 'Midi':
          this.midi.push(item);
          break;
        case 'Soir':
          this.soir.push(item);
          break;
      }
    });

    // console.log("Matin:", this.matin);
    // console.log("Midi:", this.midi);
    // console.log("Soir:", this.soir);

    this.currentPlanning = {
      matin: this.matin,
      midi: this.midi,
      soir: this.soir
    };

  }



  // getHasPlanning(date: Date): void {
  //   console.log('Date selected:', date);
  //   console.log("All Planing", this.allPlannings);

  //   const currentUser = this.tokenService.getUser();
  //   const userId = currentUser.id;

  //   console.log("userId", userId);


  //   this.planning = this.allPlannings.filter(e => {
  //     const planningDate = new Date(e.date_planning);
  //     return (
  //       planningDate.toDateString() === date.toDateString() &&
  //       e.refcompteuser === userId
  //     );
  //   });

  //   console.log("His Planing", this.planning);

  // }


  public hasPlanning(date: Date): boolean {
    // Check if there are any plannings for this date
    // console.log("All planning", this.allPlannings);
    const currentUser = this.tokenService.getUser();
    const userId = currentUser.id;
    // console.log("USER ID",userId);

    // console.log("ALL Planning",this.allPlannings);

    this.allPlannings = this.allPlannings.filter(p => p.refcompteuser === userId);


    // console.log("My ALL Planning",this.allPlannings);

    return this.allPlannings.some(planning => {
      // console.log('Initial Planning:',planning)
      // console.log('Initial planning date is :', planning.date_planning);
      const planningDate = new Date(planning.date_planning);
      let result = planningDate.toDateString() === date.toDateString();
      // console.log('planningDate:', planningDate);
      // console.log('date:', date);
      // console.log('hasPlanning result:', result);
      return result;
    });
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

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
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

    this.planningService.create(payload).subscribe({
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


    // Reload all plannings
    this.planningService.getAll().subscribe({
      next: (plannings) => {
        this.allPlannings = this.mapBackendResponseToPlanning(plannings);
        // Refresh the calendar
        this.generateCalendar();
        // Reload today's planning or the selected date's planning
        this.loadPlanningForDate(this.selectedDate);
      },
      error: (error) => {
        console.error('Error reloading plannings:', error);
      }
    });
    this.closeModal();
    this.switchView('list');

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
      this.planningService.delete(id).subscribe({
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

  async loadDishes(): Promise<void> {
    try {
      // Assuming you have access to the current user's ID
      const currentUser = this.tokenService.getUser();
      const userId = currentUser.id; // The us/ You'll need to implement this or get it from your auth service
      const dishes = await this.dishService.getAll(userId);
      this.dishes = this.mapDishesToSimplifiedFormat(dishes);
      // console.log('================================got the following Dishes:', this.dishes);
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

  startEditing(planning: PlanningResponse): void {
    this.editingPlanning = { ...planning };
  }

  cancelEditing(): void {
    this.editingPlanning = null;
  }

  saveEditing(): void {
    if (!this.editingPlanning) return;

    const currentUser = this.tokenService.getUser();

    // Map to match backend PlanningDishes structure
    const payload = {
      quantite: this.editingPlanning.quantite,
      datePlanning: new Date(this.editingPlanning.date_planning).toISOString(),
      heureDebut: this.editingPlanning.heuredebut,
      heureFin: this.editingPlanning.heurefin,
      periode: this.editingPlanning.periode,
      dishesId: {
        id: this.editingPlanning.refdishes
      },
      userId: {
        id: currentUser.id
      },
      isDeleted: false
    };

    // console.log('Sending update payload:', payload);

    this.planningService.update(this.editingPlanning.id, payload).subscribe({
      next: (response) => {
        // console.log('Update response:', response);
        // Update the planning in the list
        const index = this.allPlannings.findIndex(p => p.id === this.editingPlanning!.id);
        if (index !== -1) {
          // Map the response back to our frontend format
          this.allPlannings[index] = this.mapBackendResponseToPlanning([response])[0];
        }
        this.editingPlanning = null;
        this.applyDateFilter('filter'); // Refresh the filtered list
      },
      error: (error) => {
        console.error('Error updating planning:', error);
      }
    });
  }

  getDishName(dishId: string): string | undefined {
    // console.log('getDishName - dishId:', dishId);
    // console.log('getDishName - allPlannings:', this.allPlannings);
    const planning = this.allPlannings.find(p => p.refdishes.toString() === dishId);
    // console.log('getDishName - found planning:', planning);
    const dish = this.dishes.find(d => d.id === dishId);
    // console.log('getDishName - found dish:', dish);
    return dish ? dish.name : `Plat ${dishId}`;
  }

  getDish(e: any, planningg: any) {
    const planning = this.allPlanningss.find((p: any) => p.id === planningg.id);
    this.showDishDetails(e, planning);
  }

  getDishCategory(dishId: string): string | undefined {
    const planning = this.allPlannings.find(p => p.refdishes.toString() === dishId);
    return planning ? planning.category : 'Non spécifié';
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
    this.planningService.getAll().subscribe({
      next: (backendResponse) => {
        this.allPlannings = this.mapBackendResponseToPlanning(backendResponse);
        // console.log('Mapped plannings:', this.allPlannings);

        // Update the planning status for the calendar
       this.allPlannings
        .sort((a, b) => {
          const dateA = new Date(a.date_planning).getTime();
          const dateB = new Date(b.date_planning).getTime();
          return dateB - dateA; // Descending order
        })
        .forEach(planning => {
          const date = new Date(planning.date_planning);
          this.updatePlanningStatus(date, true);
        });



        // Apply any existing date filters
        this.applyDateFilter('filter');
      },
      error: (error) => {
        console.error('Error loading plannings:', error);
      }
    });
  }

  lesPlats: Dishes[] = [];
  applyDateFilter(parametre: string): void {
    this.lesPlats = [];
    const currentUser = this.tokenService.getUser();
    const userId = currentUser.id;
    if (!this.filterStartDate || !this.filterEndDate) {
      this.filteredPlannings = this.allPlannings.filter(p => p.refcompteuser === userId);
      return;
    }

    const start = new Date(this.filterStartDate);
    const end = new Date(this.filterEndDate);


    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    this.filteredPlannings = this.allPlannings
  .filter(planning => {
    const planningDate = new Date(planning.date_planning);
    planningDate.setHours(0, 0, 0, 0);

    const planningTime = planningDate.getTime();
    const startTime = start.getTime();
    const endTime = end.getTime();

    return planningTime >= startTime && planningTime <= endTime;
  })
  .sort((a, b) => {
    const dateA = new Date(a.date_planning).getTime();
    const dateB = new Date(b.date_planning).getTime();
    return dateB - dateA;
  });



    if (parametre === "preparation") {
      const uniqueRefDishes = Array.from(
        new Set(this.filteredPlannings.map(p => p.refdishes))
      );

      console.log("RefDishes uniques :", uniqueRefDishes);

      uniqueRefDishes.forEach(element=>{
        console.log("element", element);
        
        this.dishService.getById(element).then(data=>{
          console.log("les data response", data);
          
          this.lesPlats.push(data);
        })
      })
       console.log("les plats",this.lesPlats);

        console.log("-------------------detail estimation ------plat-------------------");
        
        this.ref = this.dialogService.open(DetailEstimationComponent, {
          // header: "Programme du " + this.filterStartDate + " au " + this.filterEndDate,
          width: '100%',
          height: '100%',
    
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: true,
    
          data:{
            lesPlast:this.lesPlats,
            planning:this.filteredPlannings,
            startDate:this.filterStartDate,
            endDate:this.filterEndDate,
          },
        });
      
      
        this.ref.onClose.subscribe((retour: any) => {
          console.log("hhhhhhhhhhhh....///jkjhghf");
    
        });
    }
   

    //  showDetailAllEstimation(){
       
      
    //   }
    

  }

  closeDishPopup() {
    this.showDishPopup = false;
    this.selectedDish = null;
  }

  private mapBackendResponseToPlanning(backendResponse: any[]): PlanningResponse[] {
    // console.log('================================got the following backendResponse:', backendResponse);
    const currentUser = this.tokenService.getUser();
    const userId = currentUser.id;
    // Filter out any planning entries that have null values in required fields
    return backendResponse
      .filter(item =>
        item &&
        item.id != null &&
        item.dishesId?.id != null &&
        item.quantite != null &&
        item.datePlanning != null &&
        item.heureDebut != null &&
        item.heureFin != null &&
        item.periode != null &&
        item.userId?.id == userId
      )
      .map(item => ({
        id: item.id,
        refdishes: item.dishesId.id,
        quantite: item.quantite,
        date_planning: item.datePlanning,
        heuredebut: item.heureDebut,
        heurefin: item.heureFin,
        periode: item.periode,
        refcompteuser: item.userId.id,
        created_at: item.dishesId.createdDate,
        updated_at: item.dishesId.createdDate,
        category: item.dishesId.categoryMenu?.name || null
      }));
  }

  //recuperation de valeurs
  async getAll(id: any) {
    await this.compositionDishesService.byDishes(id).then(data => {
      // console.log(data)
      this.compositionDishes = data

    }).finally(async () => {
      await this.updateCompoPrice()
      this.calculPlat()
    })
    // console.log("composition Dish",this.compositionDishes);

    await this.pictureDishesService.byDishes(id).then(async data => {
      // console.log(data)
      this.picturesDishes = data


    }).finally(async () => {
      //this.updateCompoPrice()
      //this.calculPlat()
      // console.log((this.picturesDishes));
    })
    // for(const p inn PicturesDishes){

    // }

    await this.picturesDishes.forEach(p => {
      // console.log(p.link);
      this.fileSaverService.getFile(p.link).then(data => {
        // console.log(data)
        p.file = data.data
      }).finally(() => {

      })
    })
    // console.log((this.picturesDishes));
    //this.detailRecipe2=this.detailRecipeProvisoire2
  }

  //calcul total infos pour le plat
  calculPlat() {
    this.plat.poids = 0
    this.plat.cout = 0
    this.compositionDishes.forEach(cp => {
      this.plat.poids += cp.quantity
      this.plat.cout += cp.cout

      // console.log(cp.cout);

    })
  }

  async getCompoPrice(composition: CompositionDishes): Promise<number> {

    var recipe: Recipe = composition.recipe
    recipe.cout = 0
    var detailRecipes: DetailsRecipe[] = recipe.detailList;
    var brut = (composition.quantity / 1000) * recipe.ratio
    // console.log("----------------------------------------------------------------{}", composition);
    // console.log("----------------------------------------------------------------{}", brut);



    await this.detailRecipeService.byRecipe(recipe.id).then(data => {
      // console.log(data);
      detailRecipes = data
    }).finally(async () => {
      for (const detail of detailRecipes) {
        // console.log(detail);

        // console.log(detail.net);
        // console.log(detail.proportion);

        detail.net = (brut * (detail.proportion)) / 100
        ////
        var perte = detail.ingredient.lossPercentage

        if (perte != null) {
          // console.log(perte);
          detail.brut = detail.net / (1 - (perte))
        }
        ///
        var price = detail.ingredient.price
        if (price != null) {
          //detail.floatingCout=detail.floatingBrut*price
          detail.cout = detail.brut * price
          // console.log(detail.brut);
          // console.log(price);
        } else detail.cout = 0
        ///
        // console.log(detail.cout);
        recipe.cout = (recipe.cout + detail.cout)
      }


    })
    // console.log(recipe.cout);
    // console.log(detailRecipes);
    return recipe.cout;

  }

  async updateCompoPrice() {
    for (const cp of this.compositionDishes) {
      //console.log(await this.getCompoPrice(cp));
      cp.cout = await this.getCompoPrice(cp);
      // console.log(cp);
    }

  }
} 