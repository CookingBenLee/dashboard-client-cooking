import { Component } from '@angular/core';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { CategoryDishes } from 'src/app/services/categorydishes/CategoryDishes';
import { CurrencyService } from 'src/app/services/currency/currency.service';
import { DetailDishes } from 'src/app/services/detaildishes/DetailDishes';
import { DetaildishesService } from 'src/app/services/detaildishes/detaildishes.service';
import { Dishes } from 'src/app/services/dishes/Dishes';
import { DishesService } from 'src/app/services/dishes/dishes.service';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
import { PicturesDishes } from 'src/app/services/picturedishes/PicturesDishes';
import { PriceService } from 'src/app/services/price/price.service';
import { ProductService } from 'src/app/services/product/product.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { UnitService } from 'src/app/services/unit/unit.service';
import { CategoryMenuService } from 'src/app/services/categotyMenu/category-menu.service';

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
import { DetailsPurchasing } from 'src/app/services/detailspurchasing/DetailsPurchasing';
import { TokenService } from 'src/app/services/token/token.service';
import { CountryService } from 'src/app/services/country/country.service';
import { PaginatorModule } from 'primeng/paginator';
import { MaterialModule } from 'src/app/material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { TreeModule } from 'primeng/tree';
import { AccordionModule } from 'primeng/accordion';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ChipModule } from 'primeng/chip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { ModaldishesComponent } from 'src/app/pages/plat/modaldishes/modaldishes.component';
import { NewdishesComponent } from './newdishes/newdishes.component';
import { DetaildishesComponent } from './detaildishes/detaildishes.component';

@Component({
  selector: 'app-plat',
  standalone: true,
  imports: [MaterialModule, MatButtonModule, MatDialogModule,CommonModule,
          RouterModule,CalendarModule ,ConfirmDialogModule,InputNumberModule,InputTextareaModule, DialogModule,ToastModule,InputTextModule,
          TableModule,PaginatorModule,DividerModule, TabViewModule,OverlayPanelModule,NewdishesComponent,
        //prime module
        InputTextModule,
        TreeSelectModule,
        DropdownModule,
        CardModule,
        PasswordModule,
        PanelModule,
        SidebarModule,
        CheckboxModule,
        TabViewModule,
        ConfirmDialogModule,
        ToastModule,
        InputNumberModule,
        InputTextareaModule,
        TableModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        DialogModule,
        OverlayPanelModule,
        EditorModule,
        ListboxModule,
        CalendarModule,
        DynamicDialogModule,
        DividerModule,
        FieldsetModule,
        TreeModule,
        AccordionModule,
        PanelMenuModule,
        ChipModule,
        ProgressSpinnerModule,
        SplitButtonModule,
        FileUploadModule,
        PaginatorModule],
          providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './plat.component.html',
  styleUrls: ['./plat.component.scss','./brand.component.scss']
})
export class PlatComponent {
//number for according active
index=0

rows=10
totalRows=0
page=0;
count=0;


totalPages=0
resClient:any
//

showAddCategory=false
///
compositionDishe:DetailDishes[]=[]
detailDisheProvisoire:DetailDishes[]=[]

pictureDishes:PicturesDishes;

@ViewChild('op',{static:true}) op: OverlayPanel;

activeIndex: number = 0;
ref: DynamicDialogRef | undefined;


dishes:Dishes[]=[]
categoryDishes:CategoryDishes[]=[]

positionModalConfirm:any
motRecherche=''
onSearch=false

constructor(private confirmationService: ConfirmationService, private messageService: MessageService,private priceService:PriceService,
  private paginateService:PaginateService,private unitService:UnitService,private productService:ProductService,private cdref: ChangeDetectorRef,
  private dialogService:DialogService,private currencyService:CurrencyService,
  private dishesService:DishesService,private detailDishesService:DetaildishesService,private categoryMenuService:CategoryMenuService,
  public tableShort:TableShortService) {}


  async ngOnInit(): Promise<void> {
    this.getAll()
    //this.getAllAdress()
    await this.getAllCategory()
    //this.getProductCategory(this.category)
    // this.detailPurchasings.push(new DetailsPurchasing())

    //for details
    this.cdref.detectChanges();

  }



//recuperation de valeurs
getAll(){
const params=this.paginateService.getRequestParams(this.page,this.rows)
console.log(params);
this.dishesService.getAllPage(params).then(data =>{
  console.log(data)
  //this.menus=data
  console.log(data)
  //this.infos=data
  console.log(data)
  //this.contenus=data

  this.totalPages=data.totalPages
    if(this.dishes.length==0 || this.page==0){
      this.resClient=data
      console.log(this.resClient)
      this.dishes=data.content
      console.log(this.totalPages)
      this.totalRows=data.totalElements
      console.log(this.count)

    }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
      this.resClient.number =data.number
      this.dishes=data.content
      console.log(data)

    }
}, error => {
  //console.log(error)
})
}
///
recherche(){

  if(this.motRecherche==""){
    this.onSearch=false
    this.page=0
    this.getAll()

  }else{
    this.onSearch=true
    const params=this.paginateService.getRequestParams(this.page,this.rows)
    console.log(params);
    this.dishesService.rechercheParPage(this.motRecherche, params).then(data =>{
    console.log(data)
    //this.menus=data
    console.log(data)
    //this.infos=data
    console.log(data)
    //this.contenus=data

    this.totalPages=data.totalPages
      if(this.dishes.length==0 || this.page==0){
        this.resClient=data
        console.log(this.resClient)
        this.dishes=data.content
        console.log(this.totalPages)
        this.totalRows=data.totalElements
        console.log(this.count)

      }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
        this.resClient.number =data.number
        this.dishes=data.content
        console.log(data)

      }
  }, error => {
    //console.log(error)
  })
  }

}


show(e:any,dishe:Dishes) {
  this.ref = this.dialogService.open(ModaldishesComponent, {
    header: 'Plat '+dishe?.reference,
    width: '90%',
    contentStyle: { overflow: 'auto' },
    baseZIndex: 10000,
    maximizable: true,
    data:dishe,
  });


  this.ref.onClose.subscribe((retour: any) => {
    console.log("hhhhhhhhhhhh....///jkjhghf");

  });
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





async getAllCategory(){
  await this.categoryMenuService.getAllCategorys().then(data=>{
    this.categoryDishes=data
  })
}


showDishesDetail(e:any,dishe:Dishes){
  this.ref = this.dialogService.open(DetaildishesComponent, {
    header: 'Plat '+dishe?.reference,
    width: '90%',
    contentStyle: { overflow: 'auto' },
    baseZIndex: 10000,
    maximizable: true,
    data:dishe,
  });


  this.ref.onClose.subscribe((retour: any) => {
    if (retour=="edit") {
      this.show(e,dishe);
        // this.messageService.add({ severity: 'success',key:'product', summary: 'Produit Crée ', detail: "Produit ajouté avec success" });
        // this.getProducts()
    }else{
      this.ref?.close
      //this.messageService.add({ severity: 'info',key:'product', summary: 'Produit non ajouté ', detail: "Ajout de Produit non effectué" });

    }
});
}

///delete
//quand on appui sur le bouton supprimer
delete(position: string,dishe:Dishes) {
  this.positionModalConfirm = position;
  console.log(dishe);

  this.confirmationService.confirm({
      message: 'Veuillez confirmer la suppresion de  '+dishe.reference,
      header: 'Comfirm delete',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.dishesService.delete(dishe.id).then(data=>{this.getAll()})
          this.messageService.add({ severity: 'error', summary: 'Confirm', detail: 'Plat supprimée' });
        },
        reject: (type:any) => {
            switch (type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({ severity: 'info', summary: 'Cancel', detail: 'Suppresion annulée' });
                    break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({ severity: 'warn', summary: 'Cancel', detail: 'Suppresion annulée' });
                    break;
            }
        },
        key: 'positionDialog'
    });
}



changeTabs(){
  this.ngOnInit()
  if(this.activeIndex==0) this.activeIndex=1
  else {this.activeIndex=0,this.getAll()}
}
}
