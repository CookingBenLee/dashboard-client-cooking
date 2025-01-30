import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { CategoryDishes } from 'src/app/services/categorydishes/CategoryDishes';
import { CategorydishesService } from 'src/app/services/categorydishes/categorydishes.service';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { ModalcategoryrecipeComponent } from '../../recipe/categoryrecipe/modalcategoryrecipe/modalcategoryrecipe.component';

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


@Component({
  selector: 'app-categoydishes',
  standalone: true,
 imports: [MaterialModule, MatButtonModule, MatDialogModule,CommonModule,
           RouterModule,CalendarModule ,ConfirmDialogModule,InputNumberModule,InputTextareaModule, DialogModule,ToastModule,InputTextModule,
           TableModule,PaginatorModule,DividerModule, TabViewModule,OverlayPanelModule,
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
  templateUrl: './categoydishes.component.html',
  styleUrl: './categoydishes.component.scss'
})
export class CategoydishesComponent {
//pagination attributs
rows=6
totalRows=0
page=0;
count=0;
//first: number = 1;
//maxS=8;
totalPages=0
resClient:any
//
@ViewChild('op',{static:true}) op: OverlayPanel;

activeIndex: number = 0;
ref: DynamicDialogRef | undefined;
categorySelected:CategoryDishes=new CategoryDishes()

categorys:CategoryDishes[]=[]
positionModalConfirm:any
motRecherche=''

name:string
code:string

detail:string

category: CategoryDishes=new CategoryDishes();

isError:boolean
isSuccess:boolean
erreur:string
sucess:string
loading: boolean = false;

categoryClicked: CategoryDishes=new CategoryDishes();
position:string
isEditCategoryDialogVisible:boolean=false
isErrorEdit:boolean
isSuccessEdit:boolean
erreurEdit:string
sucessEdit:string
onSearch=false;

constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
  private dialogService:DialogService, private paginateService:PaginateService,
  private categoryService:CategorydishesService,public tableShort:TableShortService) {}


  ngOnInit(): void {
    this.getAll()
  }

  //recuperation de valeurs
  getAll(){
    const params=this.paginateService.getRequestParams(this.page,this.rows)
    console.log(params);
    this.categoryService.getAllCategorysPage(params).then(data =>{
      console.log(data)
      //this.menus=data
      console.log(data)
      //this.infos=data
      console.log(data)
      //this.contenus=data

      this.totalPages=data.totalPages
        if(this.categorys.length==0 || this.page==0){
          this.resClient=data
          console.log(this.resClient)
          this.categorys=data.content
          console.log(this.totalPages)
          this.totalRows=data.totalElements
          console.log(this.count)

        }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
          this.resClient.number =data.number
          this.categorys=data.content
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
      this.categoryService.rechercheParPage(this.motRecherche, params).then(data =>{
        console.log(data)
        //this.menus=data
        console.log(data)
        //this.infos=data
        console.log(data)
        //this.contenus=data

        this.totalPages=data.totalPages
          if(this.categorys.length==0 || this.page==0){
            this.resClient=data
            console.log(this.resClient)
            this.categorys=data.content
            console.log(this.totalPages)
            this.totalRows=data.totalElements
            console.log(this.count)

          }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
            this.resClient.number =data.number
            this.categorys=data.content
            console.log(data)

          }
      }, error => {
        //console.log(error)
      })
    }
  }
  ///save
  save(){
    console.log(this.name)
    this.isError=false
    this.isSuccess=false
    this.loading=true

    //recup des valeurs et attribution
    this.category.name=this.name
    this.category.detail=this.detail
    this.category.code=this.code

    console.log(this.category)

    this.categoryService.createCategory(this.category).then((data) =>{
      this.getAll();
      this.loading=false
      //this.isSuccess=true
      this.sucess="Category créée !"
      this.name=""
      this.detail=""
      this.activeIndex=0
      this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucess});

    },
    (error: any)=>{
      //this.isError=true
      if(error.error.message=='ko'){
        this.erreur=error.error.data
        }else{
        this.erreur="Erreur liée au serveur"
      }
      this.loading=false
      this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: this.erreur });

    });
  }

  openModifier(position:string,info:any){
    this.isErrorEdit=false
    this.isSuccessEdit=false
    this.categoryClicked=info
    this.position = position;
    this.isEditCategoryDialogVisible = true
    console.log(this.categoryClicked)
  }

  update(){
    this.loading=true
    console.log(this.categoryClicked)
    this.categoryService.updateCategory(this.categoryClicked.id,this.categoryClicked).then(data=>{
      this.loading=false
      //this.isSuccessEdit=true
      this.sucessEdit="Category modifiée"
      this.getAll()
      this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucessEdit});
      this.isEditCategoryDialogVisible = false

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
  delete(position: string,category:CategoryDishes) {
    this.positionModalConfirm = position;
    console.log(category);

    this.confirmationService.confirm({
        message: 'Veuillez confirmer la supppression de '+category.name,
        header: 'Comfirm delete',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.categoryService.deleteCategory(category.id).then(data=>{this.getAll()})
          this.messageService.add({ severity: 'error', summary: 'Confirm', detail: 'Category supprimée' });
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
  show(e:any,category:CategoryDishes) {
    this.ref = this.dialogService.open(ModalcategoryrecipeComponent, {
        header: 'Category '+category.name,
        //width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data:category,
    });
  //   this.categorySelected=category
  // this.op.toggle(e)

    // this.ref.onClose.subscribe((shop: Shop) => {
    //     if (shop) {
    //         this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: shop.name });
    //     }
    // });

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
