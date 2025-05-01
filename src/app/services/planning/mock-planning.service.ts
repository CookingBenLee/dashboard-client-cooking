import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IPlanningService, PlanningPayload, PlanningResponse } from './planning.interface';
import { Dishes } from '../dishes/Dishes';

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

interface DishIngredient {
  name: string;
  quantity: number;
  proportion: number;
  cout: number;
}

interface DishData {
  name: string;
  category: string;
  detail: string;
  poids: number;
  cout: number;
  ingredients: DishIngredient[];
}

interface MockDishesData {
  [key: string]: DishData;
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

  getDishes(): Observable<Array<{ id: string; name: string; category: string }>> {
    const mockDishes = [
      { id: '1', name: 'Salade César', category: 'Entrée' },
      { id: '2', name: 'Poulet Rôti', category: 'Plat Principal' },
      { id: '3', name: 'Tiramisu', category: 'Dessert' },
      { id: '4', name: 'Soupe à l\'oignon', category: 'Entrée' },
      { id: '5', name: 'Steak Frites', category: 'Plat Principal' },
      { id: '6', name: 'Mousse au Chocolat', category: 'Dessert' },
      { id: '7', name: 'Fruits Frais', category: 'Collation' },
      { id: '8', name: 'Pâtes Carbonara', category: 'Plat Principal' },
      { id: '9', name: 'Tarte aux Pommes', category: 'Dessert' },
      { id: '10', name: 'Yaourt Nature', category: 'Collation' }
    ];
    return of(mockDishes).pipe(delay(300));
  }

  getDishDetails(dishId: string): Observable<Dishes> {
    const mockDishesData: MockDishesData = {
      '1': { // Salade César
        name: 'Salade César',
        category: 'Entrée',
        detail: 'Salade romaine garnie de croûtons à l\'ail, parmesan et sauce César maison',
        poids: 350,
        cout: 800,
        ingredients: [
          { name: 'Laitue Romaine', quantity: 200, proportion: 0.4, cout: 200 },
          { name: 'Poulet Grillé', quantity: 100, proportion: 0.2, cout: 300 },
          { name: 'Parmesan', quantity: 30, proportion: 0.1, cout: 150 },
          { name: 'Croûtons', quantity: 50, proportion: 0.1, cout: 50 },
          { name: 'Sauce César', quantity: 70, proportion: 0.2, cout: 100 }
        ]
      },
      '2': { // Poulet Rôti
        name: 'Poulet Rôti',
        category: 'Plat Principal',
        detail: 'Poulet fermier rôti aux herbes de Provence, accompagné de pommes de terre',
        poids: 800,
        cout: 1500,
        ingredients: [
          { name: 'Poulet Fermier', quantity: 500, proportion: 0.5, cout: 800 },
          { name: 'Pommes de Terre', quantity: 200, proportion: 0.2, cout: 200 },
          { name: 'Herbes de Provence', quantity: 10, proportion: 0.05, cout: 50 },
          { name: 'Ail', quantity: 20, proportion: 0.05, cout: 50 },
          { name: 'Beurre', quantity: 50, proportion: 0.2, cout: 400 }
        ]
      },
      '3': { // Tiramisu
        name: 'Tiramisu',
        category: 'Dessert',
        detail: 'Dessert italien traditionnel au mascarpone et café',
        poids: 250,
        cout: 600,
        ingredients: [
          { name: 'Mascarpone', quantity: 125, proportion: 0.3, cout: 250 },
          { name: 'Biscuits', quantity: 100, proportion: 0.2, cout: 100 },
          { name: 'Café', quantity: 50, proportion: 0.1, cout: 50 },
          { name: 'Oeufs', quantity: 60, proportion: 0.2, cout: 100 },
          { name: 'Cacao', quantity: 15, proportion: 0.2, cout: 100 }
        ]
      },
      '4': { // Soupe à l'oignon
        name: 'Soupe à l\'oignon',
        category: 'Entrée',
        detail: 'Soupe traditionnelle française aux oignons caramélisés et croûtons gratinés',
        poids: 400,
        cout: 500,
        ingredients: [
          { name: 'Oignons', quantity: 300, proportion: 0.5, cout: 150 },
          { name: 'Bouillon', quantity: 500, proportion: 0.2, cout: 100 },
          { name: 'Fromage', quantity: 50, proportion: 0.1, cout: 150 },
          { name: 'Pain', quantity: 50, proportion: 0.1, cout: 50 },
          { name: 'Beurre', quantity: 30, proportion: 0.1, cout: 50 }
        ]
      },
      '5': { // Steak Frites
        name: 'Steak Frites',
        category: 'Plat Principal',
        detail: 'Steak de boeuf grillé accompagné de frites maison et sauce au poivre',
        poids: 450,
        cout: 2000,
        ingredients: [
          { name: 'Steak de Boeuf', quantity: 200, proportion: 0.4, cout: 1200 },
          { name: 'Pommes de Terre', quantity: 200, proportion: 0.3, cout: 300 },
          { name: 'Sauce au Poivre', quantity: 50, proportion: 0.1, cout: 200 },
          { name: 'Beurre', quantity: 30, proportion: 0.1, cout: 200 },
          { name: 'Huile', quantity: 100, proportion: 0.1, cout: 100 }
        ]
      }
    };

    // Get the specific dish data or use a default if not found
    const dishData = mockDishesData[dishId] || mockDishesData['1'];

    const mockDish = new Dishes();
    mockDish.id = parseInt(dishId);
    mockDish.reference = `DISH-${dishId}`;
    mockDish.name = dishData.name;
    mockDish.createdDate = new Date();
    mockDish.isDeleted = false;
    mockDish.detail = dishData.detail;
    mockDish.categoryMenu = {
      id: 1,
      name: dishData.category,
      code: dishData.category.substring(0, 2).toUpperCase()
    };

    // Create composition list with proper references
    mockDish.compositionList = dishData.ingredients.map((ingredient: DishIngredient, index: number) => ({
      id: index + 1,
      code: `COMP-${index + 1}`,
      detail: ingredient.name,
      quantity: ingredient.quantity,
      proportion: ingredient.proportion,
      cout: ingredient.cout,
      quantityKg: ingredient.quantity / 1000,
      isDeleted: false,
      dishe: mockDish,
      recipe: {
        id: index + 1,
        code: `REC-${index + 1}`,
        name: ingredient.name,
        ratio: 1,
        principaleRecipe: true,
        createdDate: new Date(),
        isDeleted: false,
        detailCuisine: `Ingrédient pour ${dishData.name}`,
        categoryRecipe: {
          id: index + 1,
          name: 'Ingrédients',
          code: 'ING',
          detail: 'Ingrédients de base',
          isDeleted: false
        },
        detailList: [],
        compositionList: [],
        cout: ingredient.cout,
        brut: ingredient.quantity * 1.1, // 10% waste assumption
        net: ingredient.quantity,
        stock: 1000,
        stockApres: 1000 - ingredient.quantity,
        qteEstimee: ingredient.quantity,
        user: { id: 1, name: 'Chef' }
      }
    }));

    // Create pictures list with proper references
    mockDish.picturesList = [
      {
        id: 1,
        label: 'Présentation',
        link: 'sample-link',
        description: `Photo de présentation - ${dishData.name}`,
        file: 'base64encodedimage',
        filebase64: 'base64encodedimage',
        createdDate: new Date(),
        isDeleted: false,
        refdishe: mockDish
      }
    ];

    mockDish.poids = dishData.poids;
    mockDish.cout = dishData.cout;
    mockDish.brut = dishData.poids * 1.2; // 20% waste assumption
    mockDish.net = dishData.poids;
    mockDish.estimationPlatAVendre = 20;
    mockDish.platVendu = 15;
    mockDish.nbre = 0;
    mockDish.totalPrice = dishData.cout * 2; // 100% markup
    mockDish.facteurMultiplicatif = 2;
    mockDish.stock = 50;
    mockDish.qteEstimee = 30;
    mockDish.prixRevient = dishData.cout;
    mockDish.user = { id: 1, name: 'Chef' };

    return of(mockDish).pipe(delay(500));
  }
} 