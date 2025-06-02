import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
import { Simulation } from 'src/app/services/simulation/simulation';
import { SimulationService } from 'src/app/services/simulation/simulation.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { Brand } from 'src/app/services/brand/Brand';
import { BrandService } from 'src/app/services/brand/brand.service';
import { Category } from 'src/app/services/category/Category';
import { CategoryService } from 'src/app/services/category/category.service';
import { Conditioning } from 'src/app/services/conditioning/Conditioning';
import { ConditioningService } from 'src/app/services/conditioning/conditioning.service';
import { ProductService } from 'src/app/services/product/product.service';
import { Unit } from 'src/app/services/unit/Unit';
import { Stock } from 'src/app/services/stock/Stock';
import { UnitService } from 'src/app/services/unit/unit.service';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Product } from 'src/app/entity/Product';

// prime
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { TokenService } from 'src/app/services/token/token.service';
import { Dishes } from 'src/app/services/dishes/Dishes';
import { DishesPriceService } from 'src/app/services/dishes/dishes-price.service';
import { DetailsRecipe } from 'src/app/services/detailsrecipe/DetailsRecipe';
import { CompositionDishes } from 'src/app/services/compositiondishes/CompositionDishes';
import { FeuilleCourseComponent } from './feuille-course/feuille-course.component';
interface AggregatedRecipe {
  id: number;
  name: string;
  totalPlannedQuantity: number;
  stockInitial: number;
  stockAvant: number;
  stockApres: number;
}

@Component({
  selector: 'app-detail-estimation',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CalendarModule,
    InputTextModule,
    InputTextareaModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
    SliderModule,
    CommonModule,
    TableModule,
    PaginatorModule,
    DividerModule,
    TabViewModule,
    OverlayPanelModule,
    PanelModule // <== AJOUTE CETTE LIGNE
  ],
  providers: [ConfirmationService, MessageService, DialogService],
  templateUrl: './detail-estimation.component.html',
  styleUrl: './detail-estimation.component.scss'
})

export class DetailEstimationComponent implements OnInit {
  data: any = [];
  recipesList: any[] = [];
  data2:Dishes[]=[]

  filteredList: CompositionDishes[] = [];
  listFeuille:DetailsRecipe[]=[]


  constructor(public config: DynamicDialogConfig, private dishesPriceService:DishesPriceService,private messageService: MessageService,

    private dialogService:DialogService
    ) {
      console.log("config",this.config.data);
      this.data = this.config.data;
  }

  ngOnInit(): void {
    console.log("Test NGon");
    console.log("Les Plats NGon :", this.data)
  }

  async filterItemsOfType(compositionList: CompositionDishes[]): Promise<CompositionDishes[]> {

    const updatedList = await Promise.all(
      compositionList.map(async (x) => {
        x.recipe.net=x.recipe.stockApres*-1
        const recipeDetail = await this.dishesPriceService.getDetailRecipeWithRecipeInfos(x.recipe);
        x.recipe = recipeDetail;
        console.log('DetailList for recipe:', x.recipe.detailList);
        x.recipe.detailList.forEach(detail=>{
          detail.brut*=1000
          const totalQuantity = detail.ingredient.stock.reduce((acc, s) => acc + (s.quantity || 0), 0);
          detail.stockApres = totalQuantity - detail.brut;

          if(detail.stockApres<0 && x.recipe.stockApres < 0){
            const detailRecipe: DetailsRecipe = new DetailsRecipe();
            detailRecipe.ingredient = detail.ingredient;
            detailRecipe.stockApres = detail.stockApres;
            this.updateOrAddToIngredientList(detailRecipe)
          }
        })
        return x.recipe.stockApres < 0 ? x : null;
      })
    );

    console.log("_______________________________ingredient list___________________________________");
    console.log(this.listFeuille);



    return updatedList.filter((item) => item !== null) as CompositionDishes[];
  }


  visible: boolean = false;

  ref: DynamicDialogRef | undefined;

  showDialog() {

    //this.visible = true;
    this.ref = this.dialogService.open(FeuilleCourseComponent, {
      header: '',
      width: '100%',
      height:'100%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: this.data['negativeProducts'],
    });

    this.ref.onClose.subscribe(() => {

    });
  }
  async updateOrAddToIngredientList(detail: DetailsRecipe) {
    let found = false;
    for (let x of this.listFeuille) {
      if (x.ingredient.name === detail.ingredient.name) {
        x.stockApres += detail.stockApres;
        found = true;
        break;
      }
    }
    if (!found) {
      this.listFeuille.push(detail);
    }
  }

getQuantite(id: number) {
  const data = this.config.data.planning.filter((p: any) => p.refdishes === id);

  let quantity = 0;
  data.forEach((element: any) => {
    quantity += element.quantite || 0;
  });

  return quantity;
}

}
