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
import { DetailEstimationComponent } from '../detail-estimation/detail-estimation.component';

@Component({
  selector: 'app-detail-simulation-economique',
  standalone: true,
  imports: [FormsModule,RouterModule,CalendarModule,
    InputTextModule,InputTextareaModule,PriceFormaterDirective,
    ConfirmDialogModule,DialogModule,ToastModule,SliderModule,
      CommonModule,TableModule,PaginatorModule,DividerModule,TabViewModule,OverlayPanelModule],
  providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './detail-simulation-economique.component.html',
  styleUrl: './detail-simulation-economique.component.scss'
})
export class DetailSimulationEconomiqueComponent {
  data:Simulation;

  simulationEmployeList:SimulationEmploye[]=[]
  estimationVenteList:EstimationVente[]=[]
  actifTypeOperationsList:SimulationOperation[]=[]
  passifTypeOperationsList:SimulationOperation[]=[]
  typeOperationsList:SimulationOperation[]=[]

  isError:boolean
  isSuccess:boolean
  erreur:string

  sucess:string
  loading: boolean = false;


  totalEstimation=0
  totalSalaire=0
  coutPlat=0
  totalDepenses=0
  totalRevenus=0

  dishesList:any[]=[]



  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
    private dialogService:DialogService,public config: DynamicDialogConfig, private dishesPriceService:DishesPriceService,
    private simulationOperationService:SimulationOperationService,private simulationEmployeService:SimulationEmployeService,
    private estimationVenteService:EstimationVenteService,
    public tableShort:TableShortService,private mapService:MapService) {
      this.data=this.config.data

  }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.getTypeOperations(),
      this.getSimulationEmployeList(),
      this.getEstimationsVenteList()
    ]);
  
    // Les calculs sont effectués après que toutes les données ont été récupérées
    this.calculTotalDepenses();
    this.calculTotalRevenus();
  }



  async getTypeOperations(){
    await this.simulationOperationService.bySimulation(this.data.id).then(data=>{
      console.log(data);
      this.typeOperationsList=data
      

      for (let index = 0; index < this.typeOperationsList.length; index++) {
        const element = this.typeOperationsList[index];
        if(element.refTypeOperation.sens.toUpperCase()=="PASSIF".toUpperCase()){
          this.passifTypeOperationsList.push(element)
        }else if(element.refTypeOperation.sens.toUpperCase()=="ACTIF".toUpperCase()){
          this.passifTypeOperationsList.push(element)
        }


        console.log(element);

      }
      console.log(this.passifTypeOperationsList);
      console.log(this.actifTypeOperationsList);

      
    })
  }

  async getSimulationEmployeList(){
    await this.simulationEmployeService.bySimulation(this.data.id).then(data=>{
      console.log(data);
      this.totalSalaire=0
      this.simulationEmployeList=data

      for (let index = 0; index < this.simulationEmployeList.length; index++) {
        const element = this.simulationEmployeList[index];
        element.total=element.montantUnitaire*element.nombreEmploye

        this.simulationEmployeList[index].total=element.total

        this.totalSalaire+=element.total


      }
      
    })
  }

  async getEstimationsVenteList(){
    await this.estimationVenteService.bySimulation(this.data.id).then(data=>{
      console.log(data);
      this.estimationVenteList=data
      this.totalDepenses=0
      this.coutPlat=0
      this.totalEstimation=0
      

      for (let index = 0; index < this.estimationVenteList.length; index++) {
        const element = this.estimationVenteList[index];

        element.prixRevient=element.prixUnitaire*element.facteurMultiplicatif
        element.total=element.prixUnitaire*element.facteurMultiplicatif*element.nbreEstime

        this.estimationVenteList[index].total=element.total
        this.estimationVenteList[index].prixRevient=element.prixRevient

        this.totalEstimation+=element.total
        this.coutPlat+=element.prixUnitaire*element.nbreEstime

        
      }
      
    })
    this.updateDishesInfos()


  }
  


  calculTotalRevenus(){
    this.totalRevenus=0
    if(this.totalEstimation) this.totalRevenus=this.totalEstimation
    console.log("total estimation");
    console.log(this.totalEstimation);

    this.actifTypeOperationsList.forEach(async (actif) => {
      console.log("actif");

      if (actif.montant) this.totalRevenus += actif.montant;
    })
  }

  calculTotalDepenses(){
    this.totalDepenses=0
    if(this.totalSalaire)this.totalDepenses+=this.totalSalaire
    if(this.coutPlat)this.totalDepenses+=this.coutPlat

    console.log(this.totalDepenses);

   //if(this.coutDeRevient)this.totalDepenses+=this.coutDeRevient

    this.passifTypeOperationsList.forEach(async passif=>{
      console.log("passif");

      if(passif.montant) this.totalDepenses+=passif.montant
    })
  }

  ref: DynamicDialogRef | undefined;
  showDetailAllEstimation(){

    console.log();
    
    console.log("-------------------detail estimation ------plat-------------------");
    
    this.ref = this.dialogService.open(DetailEstimationComponent, {
      header: 'Estimation Details',
      width: '100%',
      height: '100%',

      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,

      data:this.dishesList,
    });
  
  
    this.ref.onClose.subscribe((retour: any) => {
      console.log("hhhhhhhhhhhh....///jkjhghf");

    });
  
  }


  async updateDishesInfos(){

    await this.estimationVenteList.map(async (x,i) => {
      var plat=x.dishesId
      plat=await this.dishesPriceService.getDishesPrice(plat)

      var price=x.prixUnitaire;
      var qte=x.nbreEstime;
      var facteurMultiplicatif=x.facteurMultiplicatif;

      //
      plat.facteurMultiplicatif=facteurMultiplicatif
      plat.cout=price
      plat.nbre=qte

      //




      try{
        if(price && qte && facteurMultiplicatif)plat.totalPrice= price*qte*facteurMultiplicatif;
        if(price && facteurMultiplicatif)plat.prixRevient= price*facteurMultiplicatif;

        else if(price==0 || qte==0 || facteurMultiplicatif==0)plat.totalPrice= 0;
      }catch(e){}


      this.dishesList.push(plat)

    })
  }


  changePlatDetail(i:number){
    var price=this.dishesList[i].cout;
    var qte=this.dishesList[i].nbre;
    
    var facteurMultiplicatif=this.dishesList[i].facteurMultiplicatif;

    try{
      if(price && qte && facteurMultiplicatif)this.dishesList[i].totalPrice= price*qte*facteurMultiplicatif;
      if(price && facteurMultiplicatif)this.dishesList[i].prixRevient= price*facteurMultiplicatif;

      else if(price==0 || qte==0 || facteurMultiplicatif==0)this.dishesList[i].totalPrice= 0;
    }catch(e){}
  }
}
