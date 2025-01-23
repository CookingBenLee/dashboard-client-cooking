import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Brand } from 'src/app/services/brand/Brand';
import { BrandService } from 'src/app/services/brand/brand.service';
import { Category } from 'src/app/services/category/Category';
import { CategoryService } from 'src/app/services/category/category.service';
import { Conditioning } from 'src/app/services/conditioning/Conditioning';
import { ConditioningService } from 'src/app/services/conditioning/conditioning.service';
import { ProductService } from 'src/app/services/product/product.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { Unit } from 'src/app/services/unit/Unit';
import { UnitService } from 'src/app/services/unit/unit.service';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
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

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [FormsModule,RouterModule,CalendarModule,
    InputTextModule,InputTextareaModule,
    ConfirmDialogModule,DialogModule,ToastModule,
      CommonModule,TableModule,PaginatorModule,DividerModule,TabViewModule,OverlayPanelModule],
  providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent implements OnInit {
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
  @ViewChild('op',{static:true}) op: OverlayPanel;


  activeIndex: number = 0;
  


  products:Product[]=[]
  brands:Brand[]
  categorys:Category[]
  units:Unit[]
  conditionings:Conditioning[]

  positionModalConfirm:any
  motRecherche=''
  onSearch=false

  name:string
  code:string
  description:string
  price:number
  lostpercentage:number

  unit:Unit
  brand:Brand
  category:Category
  conditioning:Conditioning

  product: any = {};

  isError:boolean
  isSuccess:boolean
  erreur:string
  sucess:string
  loading: boolean = false;

  productClicked: Product=new Product();
  position:string
  isEditproductDialogVisible:boolean=false
  isErrorEdit:boolean
  isSuccessEdit:boolean
  erreurEdit:string
  sucessEdit:string

  productSelected:Product

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
    private dialogService:DialogService,public ref: DynamicDialogRef,
    private paginateService:PaginateService,private tokenService: TokenService,
    private brandService:BrandService,private conditioningService:ConditioningService,private unitService:UnitService,private categoryService:CategoryService,
    private productService:ProductService,public tableShort:TableShortService) {}


    ngOnInit(): void {
      this.getBrands()
      this.getCategorys()
      this.getConditioning()
      this.getUnit()
    }

    

   

    getBrands(){
      this.brandService.getAllBrands().then(data =>{
        console.log(data)
        this.brands=data})
    }
    getCategorys(){
      this.categoryService.getAllCategorys().then(data =>{
        console.log(data)
        this.categorys=data})
    }
    getConditioning(){
      this.conditioningService.getAllConditionings().then(data =>{
        console.log(data)
        this.conditionings=data})
    }
    getUnit(){
      this.unitService.getAllUnits().then(data =>{
        console.log(data)
        this.units=data})
    }

    ///save
    save(){
      console.log(this.name)
      this.isError=false
      this.isSuccess=false
      this.loading=true

      //recup des valeurs et attribution
      this.product.name=this.name
      this.product.description=this.description
      this.product.price=this.price
      this.product.lossPercentage=this.lostpercentage

      this.product.brand=this.brand
      this.product.category=this.category
      this.product.conditioning=this.conditioning
      this.product.unit=this.unit
      this.product.code=this.name


      console.log(this.product)
      const user = this.tokenService.getUser();
      this.product.user = { id: user.id };
      this.productService.create(this.product).then((data) =>{
        this.loading=false
        //this.isSuccess=true
        this.sucess="Produit crée !"
        this.name=""
        this.description=""
        this.activeIndex=0
        this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucess});
        this.ref?.close();

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
      this.productClicked=info
      this.position = position;
      this.isEditproductDialogVisible = true
      console.log(this.productClicked)
    }

   

   
   
  ngOnDestroy() {
      if (this.ref) {
          this.ref.close();
      }
  }

 
}
