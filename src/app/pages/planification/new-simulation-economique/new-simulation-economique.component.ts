import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';
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
import { EstimationVente } from 'src/app/services/estimationVente/estimation-vente';
import { SimulationEmploye } from 'src/app/services/simulationEmploye/simulation-employe';
import { SimulationOperation } from 'src/app/services/simulationOperation/simulation-operation';
import { Profil } from 'src/app/services/profil/profil';
import { ProfilService } from 'src/app/services/profil/profil.service';
import { SimulationEmployeService } from 'src/app/services/simulationEmploye/simulation-employe.service';
import { SimulationOperationService } from 'src/app/services/simulationOperation/simulation-operation.service';
import { EstimationVenteService } from 'src/app/services/estimationVente/estimation-vente.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DetailEstimationComponent } from '../detail-estimation/detail-estimation.component';

@Component({
  selector: 'app-new-simulation-economique',
  standalone: true,
  imports: [FormsModule,RouterModule,CalendarModule,
    InputTextModule,InputTextareaModule,PriceFormaterDirective,
    ConfirmDialogModule,DialogModule,ToastModule,SliderModule,ProgressSpinnerModule,
      CommonModule,TableModule,PaginatorModule,DividerModule,TabViewModule,OverlayPanelModule],
  providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './new-simulation-economique.component.html',
  styleUrl: './new-simulation-economique.component.scss'
})
export class NewSimulationEconomiqueComponent {
  nbreEmploye=0
  nbreMois=0
  // facteurMultiplicatif=0
  salaireBrut=0
  passifTypeOperations:CategoryOperation[]=[]
  actifTypeOperations:CategoryOperation[]=[]
  // notOperationTypeOperations:CategoryOperation[]=[]

  totalEstimation=0
  coutDeRevient=0
  totalSalaire=0
  dishesList:Dishes[]=[]

  dateDebut:Date=new Date()
  dateFin:Date=new Date()
  frequence:String

  totalDepenses:number=0
  totalRevenus:number=0
  coutPlat=0
  loadingSave=false
  loadingPage=false

  simulation:Simulation=new Simulation()
  frequenceList=['JOURNALIER','HEBDOMADAIRE', 'MENSUEL','ANNUEL']

  estimationVente:EstimationVente=new EstimationVente()
  simulationEmployeList:SimulationEmploye[]=[]
  simulationOperationList:SimulationOperation[]=[]

  profilList:Profil[]=[]


  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();


  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
    private dishesPriceService:DishesPriceService,private router:Router,
    private categoryOperationService:CategoryOperationService,private dishesService:DishesService,private cdref: ChangeDetectorRef,
    private dialogService:DialogService,private profilService:ProfilService,
    private simulationService:SimulationService,private simulationEmployeService:SimulationEmployeService,
    private simulationOperationService:SimulationOperationService,private estimationVenteService:EstimationVenteService,
   //  private categoryRecipeService:CategoryrecipeService,
    private tokenService:TokenService,
    public tableShort:TableShortService) {}

  ngOnInit() {

    this.frequence=this.frequenceList[0]
    this.getPassifTypeOperation()
    this.getActifTypeOperation()
    // this.getNotEmployeTypeOperation()
    this.updatetotalSalaire()
    this.getDishes()
   this.getProfils()

    // wait 1 seconde after execute this
    this.estimationVente.dateDebut=new Date()
    this.estimationVente.dateFin=new Date()
    this.estimationVente.frequence=this.frequenceList[0]

  }

  // getNotEmployeTypeOperation(){
  //   this.categoryOperationService.byOperation(true).then(result=>{
  //     console.log(result);
  //     this.notOperationTypeOperations=result

  //   }).catch(error=>{});
  // }

  getPassifTypeOperation(){
    this.categoryOperationService.bySensNotOperation(ECategoryOperation.PASSIF).then(result=>{
      console.log(result);
      this.passifTypeOperations=result

    }).catch(error=>{});
  }

  getActifTypeOperation(){
    this.categoryOperationService.bySensNotOperation(ECategoryOperation.ACTIF).then(result=>{
      console.log(result);
      this.actifTypeOperations=result
    }).catch(error=>{});
  }

  getDishes(){
    const user = this.tokenService.getUser();
    this.dishesService.getAll(user.id).then(async data=>{
      console.log(data);
      this.dishesList=await this.addPriceToPlat(data);

      //
      this.calculTotalRevenus()
      this.calculTotalDepenses()
    }).catch(error=>{});
  }

  addPriceToPlat(platList:Dishes[]):Dishes[]{

    var list:Dishes[]=[]

    platList.forEach(async plat=>{

      plat=await this.dishesPriceService.getDishesPrice(plat)
      list.push(plat);
    })
    return list;
  }

  changePlatDetail(i:number){
    var price=this.dishesList[i].cout;
    var qte=this.dishesList[i].nbre;
    
    var facteurMultiplicatif=this.dishesList[i].facteurMultiplicatif;

    try{
      if(price && qte && facteurMultiplicatif)this.dishesList[i].totalPrice= price*qte*facteurMultiplicatif;
      if(price && facteurMultiplicatif)this.dishesList[i].prixRevient= price*facteurMultiplicatif;

      else if(price==0 || qte==0 || facteurMultiplicatif==0)this.dishesList[i].totalPrice= 0;

      this.updatPlatTotalPrice()
    }catch(e){}
  }


  updatPlatTotalPrice(){
    this.totalEstimation=0
    this.coutPlat=0
    this.dishesList.forEach(async plat=>{
      if(plat.totalPrice) this.totalEstimation+=plat.totalPrice
      if(plat.cout && plat.nbre)this.coutPlat+=plat.cout*plat.nbre;
    })
    this.calculcoutDeRevient()
    this.calculTotalRevenus()
  }

  async updatetotalSalaire(){
    console.log("data");

    // this.salaireBrut =0
    // this.notOperationTypeOperations.forEach(async (operation) => {
    //   if (operation.montant) this.salaireBrut += operation.montant;
    // })

    try{
      if(this.salaireBrut && this.nbreEmploye)this.totalSalaire=this.salaireBrut*this.nbreEmploye
      this.calculTotalDepenses();
    }catch(e){}
  }

  calculTotalDepenses(){
    this.totalDepenses=0
    if(this.totalSalaire)this.totalDepenses+=this.totalSalaire
    if(this.coutPlat)this.totalDepenses+=this.coutPlat


   //if(this.coutDeRevient)this.totalDepenses+=this.coutDeRevient

    this.passifTypeOperations.forEach(async passif=>{
      if(passif.montant) this.totalDepenses+=passif.montant
    })
    this.calculBilan()
  }


  calculTotalRevenus(){
    this.totalRevenus=0
    if(this.totalEstimation) this.totalRevenus=this.totalEstimation

    this.actifTypeOperations.forEach(async actif=>{
      if(actif.montant) this.totalRevenus+=actif.montant
    })
    this.calculBilan()
  }


  calculcoutDeRevient(){
    //calculate the details of the cooks
    // && this.facteurMultiplicatif
    // /this.facteurMultiplicatif

    if(this.totalEstimation  )this.coutDeRevient=this.totalEstimation
    this.calculTotalDepenses()
  }

  calculBilan(){
  }

  updateAllDetail(){
    this.dishesList.forEach(async (passif,i)=>{
     this.changePlatDetail(i)
    })
  }

  ///

  getProfils(){
    this.profilService.getAll().then(data=>{
      this.profilList=data
    })
  }

  
  changeProfilDetail(i:number){
    this.totalSalaire=0

    var salaire=this.profilList[i].salaire
    var nbre=this.profilList[i].nbreEmploye

    if(salaire){
      this.profilList[i].total=salaire*nbre
    }

    //update salaire
    this.profilList.forEach(profil => {
      if(profil.total) this.totalSalaire+=profil.total
    });

    this.updateAllDetail()
   
  }
  //
  ref: DynamicDialogRef | undefined;

  showDetailAllEstimation(){
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


  showDetailEstimation(plat:any){
    console.log("-------------------detail estimation ------plat-------------------");
    
    this.ref = this.dialogService.open(DetailEstimationComponent, {
      header: 'Estimation '+plat.reference,
      width: '100%',
      height: '100%',

      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,

      data:plat,
    });
  
  
    this.ref.onClose.subscribe((retour: any) => {
      console.log("hhhhhhhhhhhh....///jkjhghf");

    });
  
    //this.router.navigate(['../simulation-economique/detail-estimation', {plat: JSON.stringify(plat)}]);
  }

  ////
  saveEstimation(){

    this.loadingSave=true
    //simulation
    //enregistrer la table simulation, simulationemploye, simulationoperation, estimations de vente
    //estimation de vente

    //simulation
    this.simulation.bilan=this.totalRevenus-this.totalDepenses
    this.simulation.date=new Date()
    this.simulation.totalActif=this.totalRevenus
    this.simulation.totalPassif=this.totalDepenses
    var okay=false
    this.loadingPage=true
    const user = this.tokenService.getUser();
    this.simulation.user = {id : user.id}
    this.simulationService.create(this.simulation).then(data=>{
      console.log("data simulation:::::");
      console.log(data);
      var res=data.data

      this.simulation=new Simulation()
      this.saveOtherSimulationDetails(res)
      this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: "Simulation Enregistée"});

      
      okay=true
    },
      (error: any)=>{
        okay=false
    
        this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: "Erreur lors de l'enregistrement de la simulation" });
        
    }).finally(()=>{
      if(okay) {
        this.ngOnInit()
        this.parentFun.emit()

      }
      this.loadingPage=false
      this.loadingSave=false

    })

    

    //Simulation simulationSaved=null
    //go to save simulation

    //simulation employe

    //simulation operation
  }

  saveOtherSimulationDetails(simulationSaved:any){
    //employe
    this.profilList.forEach(profil => {
      var simulation: SimulationEmploye=new SimulationEmploye()
      simulation.montantUnitaire=profil.salaire
      simulation.nombreEmploye=profil.nbreEmploye
      simulation.refProfilEmploye=profil
      simulation.refSimulation=simulationSaved

      this.simulationEmployeService.create(simulation).then(data=>{
        this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: "Simulation employée enregistée : "+profil.libelle});

      },
      (error: any)=>{
    
        this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: "Erreur lors de l'enregistrement de la simulation employé : "+profil.libelle });
        this.loadingSave=false
      });

    });

    //OPERATION 
     this.passifTypeOperations.forEach(passif => {
      var simulation: SimulationOperation=new SimulationOperation()
      simulation.montant=passif.montant
      simulation.refTypeOperation=passif
      simulation.refSimulation=simulationSaved

      this.simulationOperationService.create(simulation).then(data=>{
        this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: "Simulation operation enregistée : "+passif.libelle});

      },
      (error: any)=>{
    
        this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: "Erreur lors de l'enregistrement de la simulation operation : "+passif.libelle });
        this.loadingSave=false
      });

    });

    this.actifTypeOperations.forEach(passif => {
      var simulation: SimulationOperation=new SimulationOperation()
      simulation.montant=passif.montant
      simulation.refTypeOperation=passif
      simulation.refSimulation=simulationSaved

      this.simulationOperationService.create(simulation).then(data=>{
        this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: "Simulation operation enregistée : "+passif.libelle});

      },
      (error: any)=>{
    
        this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: "Erreur lors de l'enregistrement de la simulation operation : "+passif.libelle });
        this.loadingSave=false
      });

    });

    ///estimation de vente
    this.dishesList.forEach(dishes => {
      var estimationVente: EstimationVente=new EstimationVente()
      estimationVente.dateDebut=this.dateDebut
      estimationVente.dateFin=this.dateFin
      estimationVente.frequence=this.frequence

      estimationVente.dishesId=dishes
      estimationVente.facteurMultiplicatif=dishes.facteurMultiplicatif
      estimationVente.prixUnitaire=dishes.cout
      estimationVente.nbreEstime=dishes.nbre
      estimationVente.refSimulation=simulationSaved

      this.estimationVenteService.create(estimationVente).then(data=>{
        this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: "Estimation vente enregistée"});
      },
      (error: any)=>{
        this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: "Erreur lors de l'enregistrement de l'estimation vente" });
        this.loadingSave=false
      });
    });

  }

}
