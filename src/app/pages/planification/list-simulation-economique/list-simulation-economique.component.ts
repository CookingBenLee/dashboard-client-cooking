import { Component } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
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
import { DetailSimulationEconomiqueComponent } from '../detail-simulation-economique/detail-simulation-economique.component';
@Component({
  selector: 'app-list-simulation-economique',
  standalone: true,
  imports: [FormsModule,RouterModule,CalendarModule,
      InputTextModule,InputTextareaModule,PriceFormaterDirective,
      ConfirmDialogModule,DialogModule,ToastModule,SliderModule,
        CommonModule,TableModule,PaginatorModule,DividerModule,TabViewModule,OverlayPanelModule],
    providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './list-simulation-economique.component.html',
  styleUrl: './list-simulation-economique.component.scss'
})
export class ListSimulationEconomiqueComponent {
   //pagination attributs
   rows=5
   totalRows=0
   page=0;
   count=0;
   //first: number = 1;
   //maxS=8;
   totalPages=0
   resClient:any
   //

  activeIndex: number = 0;
  ref: DynamicDialogRef | undefined;

  

  positionModalConfirm:any
  motRecherche=''

  name:string
  acronym:string
  contact:string
  email:string

  simulation: Simulation=new Simulation();

  isError:boolean
  isSuccess:boolean
  erreur:string
  sucess:string
  loading: boolean = false;

  simulationClicked: Simulation=new Simulation();
  position:string
  isEditShopDialogVisible:boolean=false
  isErrorEdit:boolean
  isSuccessEdit:boolean
  erreurEdit:string
  sucessEdit:string

  simulationList:Simulation[]=[]

  onSearch=true
  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
    private dialogService:DialogService,
    private paginateService:PaginateService,private tokenService: TokenService,
    private simulationService:SimulationService,public tableShort:TableShortService) {}

  ngOnInit(): void {
    this.getAll();
    
  }

  //recuperation de valeurs
  getAll(){
    const params=this.paginateService.getRequestParams(this.page,this.rows)
    console.log(params);
    const user = this.tokenService.getUser();
    this.simulationService.getAllPage(user.id,params).then(data =>{
      console.log(data)
        //this.menus=data
        console.log(data)
        //this.infos=data
        console.log(data)
        //this.contenus=data

        this.totalPages=data.totalPages
          if(this.simulationList.length==0 || this.page==0){
            this.resClient=data
            console.log(this.resClient)
            this.simulationList=data.content
            console.log(this.totalPages)
            this.totalRows=data.totalElements
            console.log(this.count)

          }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
            this.resClient.number =data.number
            this.simulationList=data.content
            console.log(data)

          }
      }, error => {
        //console.log(error)
      })
  }

  recherche(){

    if(this.motRecherche==""){
      this.onSearch=false
      this.page=0
      this.getAll()

    }else{
      this.onSearch=true

      const params=this.paginateService.getRequestParams(this.page,this.rows)
      console.log(params);
      this.simulationService.rechercheParPage(this.motRecherche,params).then(data =>{
        console.log(data)
          //this.menus=data
          console.log(data)
          //this.infos=data
          console.log(data)
          //this.contenus=data

          this.totalPages=data.totalPages
            if(this.simulationList.length==0 || this.page==0){
              this.resClient=data
              console.log(this.resClient)
              this.simulationList=data.content
              console.log(this.totalPages)
              this.totalRows=data.totalElements
              console.log(this.count)

            }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
              this.resClient.number =data.number
              this.simulationList=data.content
            console.log(data)

          }
      }, error => {
        //console.log(error)
      })
    }

  }

 
  openModifier(position:string,info:any){
    this.isErrorEdit=false
    this.isSuccessEdit=false
    this.simulationClicked=info
    this.position = position;
    this.isEditShopDialogVisible = true
    console.log(this.simulationClicked)
  }

  update(){
    this.loading=true
    console.log(this.simulationClicked)
    this.simulationService.update(this.simulationClicked.id,this.simulationClicked).then(data=>{
      this.loading=false
      //this.isSuccessEdit=true
      this.sucessEdit="simulation modifiée"
      this.getAll()
      this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucessEdit});
      this.isEditShopDialogVisible = false

    },
    (error: any)=>{
      //this.isErrorEdit=true
      if(error.error.message=='ko'){
        //erreurNumero
        this.erreurEdit=error.error.data
        }else{
        this.erreurEdit=error.error.data
        //this.erreur="Erreur lié au serveur"
      }
      this.loading=false
      this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: this.erreurEdit });
      this.getAll()

    });
  }

  ///delete
  //quand on appui sur le bouton supprimer
  delete(position: string,simulation:Simulation) {
    this.positionModalConfirm = position;
    console.log(simulation);

    this.confirmationService.confirm({
        message: 'Veuillez confirmer la suppresion de la simulation à la date du '+simulation.date,
        header: 'Comfirm delete',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.simulationService.delete(simulation.id).then(data=>{this.getAll()})
          this.messageService.add({ severity: 'error', summary: 'Confirm', detail: 'Simulation modifiée' });
        },
        reject: (type:any) => {
            switch (type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({ severity: 'info', summary: 'Cancel', detail: 'Suppression annulée' });
                    break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({ severity: 'warn', summary: 'Cancel', detail: 'Suppression annulée' });
                    break;
            }
        },
        key: 'positionDialog'
    });
  }

  show(simulation:Simulation) {
    this.ref = this.dialogService.open(DetailSimulationEconomiqueComponent, {
        header: 'Simulation '+simulation.date,
        width: '70%',
        height:'100%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data:simulation,
    });

    this.ref.onClose.subscribe((simulation: Simulation) => {
        if (simulation) {
            this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: "Simulation date "+simulation.date });
        }
    });

    // this.ref.onMaximize.subscribe((value) => {
    //     this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    // });
  }

  ngOnDestroy() {
      if (this.ref) {
          this.ref.close();
      }
  }

  onPageChange(e:any){
    this.page=e.page;
    console.log(e);

    this.rows=e.rows
    console.log(this.page);
    if(this.onSearch==false){
      this.getAll()
    }else this.recherche()
  }

}
