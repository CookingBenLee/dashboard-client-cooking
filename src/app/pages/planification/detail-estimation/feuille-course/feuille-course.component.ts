import { Component } from '@angular/core';
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
import { DishesService } from 'src/app/services/dishes/dishes.service';
import { CategoryOperation } from 'src/app/services/categoryOperation/category-operation';
import { CategoryOperationService } from 'src/app/services/categoryOperation/category-operation.service';
import { ECategoryOperation } from 'src/app/services/categoryOperation/ECategoryOperation';
import { PriceFormaterDirective } from 'src/app/directives/priceFormater/price-formater.directive';
import { SimulationEmploye } from 'src/app/services/simulationEmploye/simulation-employe';
import { EstimationVente } from 'src/app/services/estimationVente/estimation-vente';
import { SimulationOperation } from 'src/app/services/simulationOperation/simulation-operation';
import { SimulationOperationService } from 'src/app/services/simulationOperation/simulation-operation.service';
import { EstimationVenteService } from 'src/app/services/estimationVente/estimation-vente.service';
import { SimulationEmployeService } from 'src/app/services/simulationEmploye/simulation-employe.service';
import { MapService } from 'src/app/services/map/map.service';
import { DetailsRecipe } from 'src/app/services/detailsrecipe/DetailsRecipe';
import { CompositionDishes } from 'src/app/services/compositiondishes/CompositionDishes';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-feuille-course',
  standalone: true,
  imports: [FormsModule,RouterModule,CalendarModule,ProgressSpinnerModule,
      InputTextModule,InputTextareaModule,PriceFormaterDirective,
      ConfirmDialogModule,DialogModule,ToastModule,SliderModule,
        CommonModule,TableModule,PaginatorModule,DividerModule,TabViewModule,OverlayPanelModule],
    providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './feuille-course.component.html',
  styleUrl: './feuille-course.component.scss'
})
export class FeuilleCourseComponent {
  detailRecipeList:DetailsRecipe[];
  total:number=0

  constructor(private messageService: MessageService,public config: DynamicDialogConfig,
    private dialogService:DialogService){

    this.detailRecipeList=this.config.data

    }
  ngOnInit(): void {

    console.log("*************************************************");
    console.log(this.detailRecipeList);

    this.detailRecipeList.sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name));  

    this.detailRecipeList.forEach(detail=>{
      detail.stockApres=Math.abs(detail.stockApres)
      // detail.totalPrice=Math.abs(detail.stockApres)*detail.ingredient.price
      if(detail.ingredient.price) this.total+=detail.totalPrice
    })
    
    
      
  }
  generating=false

  loadingPage=false
  public async generate(): Promise<void> {


    //   html2canvas(DATA).then((canvas) => {
    //     let fileWidth = 210;
    //     let fileHeight = (canvas.height * fileWidth) / canvas.width;
    //     const FILEURI = canvas.toDataURL('image/png');
    //     let PDF = new jsPDF('portrait', 'mm', 'a4',true);
    //     let position = 0;
    //     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
    //     PDF.save(nom);
    //   });
  
      try{
        this.loadingPage=true
        this.generating = true;
        var div = await <HTMLDivElement>document.querySelector(".bouttonn");
        await div.classList.add("d-none");
  
        var nom = 'feuille de course.pdf';
  
  
        // Supposons que votre élément #invoice est le conteneur principal à convertir en PDF
        let DATA: any = await document.getElementById('invoice');
  
        html2canvas(DATA).then((canvas) => {
          let fileWidth = 210;
          //let pageHeight = 297; // A4 dimensions
          let pageHeight = fileWidth * 1.414; // Aspect ratio of A4
          //let pageHeight = (canvas.height * pdfWidth) / canvas.width;
  
          let fileHeight = (canvas.height * fileWidth) / canvas.width;
          const FILEURI = canvas.toDataURL('image/png');
          let PDF = new jsPDF('portrait', 'mm', 'a4',true);
          let position = 0;
          PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
          PDF.save(nom);
    
            this.loadingPage=false
            this.generating = false;
            div.classList.remove("d-none")
    
          },(error:any)=>{
            this.generating = false;
            div.classList.remove("d-none")
            this.loadingPage=false
            this.messageService.add({key:'tc', severity: 'error', summary: 'Info', detail: `Erreur lors de la géneration du fichier.` });
          });
        }catch(e){
          this.loadingPage=false
          this.messageService.add({key:'tc', severity: 'error', summary: 'Info', detail: `Erreur lors de la géneration du fichier.` });
    
        }
  
    }
}
