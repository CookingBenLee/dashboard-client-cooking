import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Address } from 'src/app/services/address/Address';
import { AddressService } from 'src/app/services/address/address.service';
import { Category } from 'src/app/services/category/Category';
import { CategoryService } from 'src/app/services/category/category.service';
import { Currency } from 'src/app/services/currency/Currency';
import { CurrencyService } from 'src/app/services/currency/currency.service';
import { DetailspurchasingService } from 'src/app/services/detailspurchasing/detailspurchasing.service';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
import { Price } from 'src/app/services/price/Price';
import { PriceService } from 'src/app/services/price/price.service';
import { ProductService } from 'src/app/services/product/product.service';
import { Purchase } from 'src/app/services/purchase/Purchase';
import { PurchaseService } from 'src/app/services/purchase/purchase.service';
import { Shop } from 'src/app/services/shop/Shop';
import { ShopService } from 'src/app/services/shop/shop.service';
import { Unit } from 'src/app/services/unit/Unit';
import { UnitService } from 'src/app/services/unit/unit.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [ MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    CommonModule,
    MatButtonModule, MatDialogModule],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
  Object.create(null);
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('dialogTemplateDelete') dialogTemplateDelete!: TemplateRef<any>;
  @ViewChild('dialogTemplateEdit') dialogTemplateEdit!: TemplateRef<any>;

  rows=5
  totalRows=0
  page=0;
  count=0;
  //first: number = 1;
  //maxS=8s;
  totalPages=0
  resClient:any
  //
  price:Price;

  showAddProduct=false

  motRecherche=''
  onSearch=false
  // distinctUnits:any[]=[]
  // realQs:any[]=[]
  // realQuantitys:any[]=[]


  reference:string
  quantity:number
  montant:any=0
  datePurchase:Date

  shop:Shop=new Shop()
  shops:Shop[]=[]
  addresss:Address[]=[]
  categorys:Category[]=[]
  category:Category=new Category()
  address:Address=new Address()

  currency:Currency=new Currency()
  currencys:Currency[]=[]

  detailPurchasesForms2:any=[]
  // quantitys:any[]=[];
  // values:any[]=[]
  // totalPrices:any[]=[];
  // productes:Product[]=[]//=[new Product()]
  unitys:Unit[]=[]//=[new Unit()]

  activeIndex: number = 0;


  purchases:Purchase[]=[]
  positionModalConfirm:any

  purchaseSelected:Purchase

  displayedColumns: string[] = [
    'date course',
    'fournisseur',
    'montant',
    'date de saisie',
    'action',
  ];

  dataSource = new MatTableDataSource<Purchase>([]);
  purchaseData: any = {};

  ngOnInit(): void {
    this.getAll()
  }

  constructor( private priceService:PriceService,public dialog: MatDialog,private snackBar: MatSnackBar,
    private paginateService:PaginateService,private unitService:UnitService,private productService:ProductService,private cdref: ChangeDetectorRef,
    private addressService:AddressService,private currencyService:CurrencyService,
    private detailPurchaseService:DetailspurchasingService,private categoryService:CategoryService,
    private purchaseService:PurchaseService,private shopService:ShopService) {}



    getAll(){
      const params=this.paginateService.getRequestParams(this.page,this.rows)
      console.log(params);
      this.purchaseService.getAllPage(params).then(data =>{
        console.log(data)
        //this.menus=data
        console.log(data)
        //this.infos=data
        console.log(data)
        //this.contenus=data

        this.totalPages=data.totalPages
          if(this.purchases.length==0 || this.page==0){
            this.resClient=data
            console.log(this.resClient)
            this.purchases=data.content
            console.log(this.totalPages)
            this.totalRows=data.totalElements
            console.log(this.count)
            this.dataSource.data = data.content;
          }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
            this.resClient.number =data.number
            this.purchases=data.content
            console.log(data)
            this.dataSource.data = data.content;

          }
      }, error => {
        //console.log(error)
      })
    }

    openDialogAdd() {
      this.resetFields();
      this.dialog.open(this.dialogTemplate, {
        width: '1200px', height: '570px'
      });
    }

    onPageChange(event: any): void {
      console.log(event);

      this.page = event.pageIndex;
      this.rows = event.pageSize;
      console.log(`Page: ${this.page}, Rows per page: ${this.rows}`);
      this.getAll();
    }


    applyFilter(filterValue: string): void {
      this.dataSource.filter = filterValue.trim().toLowerCase();
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
        this.purchaseService.rechercheParPage(this.motRecherche, params).then(data =>{
        console.log(data)
        //this.menus=data
        console.log(data)
        //this.infos=data
        console.log(data)
        //this.contenus=data

        this.totalPages=data.totalPages
          if(this.purchases.length==0 || this.page==0){
            this.resClient=data
            console.log(this.resClient)
            this.purchases=data.content
            console.log(this.totalPages)
            this.totalRows=data.totalElements
            console.log(this.count)

          }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
            this.resClient.number =data.number
            this.purchases=data.content
            console.log(data)

          }
      }, error => {
        //console.log(error)
      })
      }
    }



  closeDialog() {
    this.dialog.closeAll();
  }

  openDialogEdit(purchase: Purchase) {
    // this.productData = { ...product };
    // console.log(this.productData);
    // this.productData.category = this.categorys.find(cat => cat.id === product.category?.id);
    // this.productData.brand = this.brands.find(brand => brand.id === product.brand?.id);
    // this.productData.unit = this.units.find(unit => unit.id === product.unit.id);
    // this.productData.conditioning = this.conditionings.find(cond => cond.id === product.conditioning?.id);
    // this.dialog.open(this.dialogTemplateEdit, {
    //   width: '1200px', height: '570px'
    // });
  }

  resetFields() {
    // this.productData = {}; // Réinitialise les données du produit
    // this.name = '';
    // this.code = '';
    // this.description = '';
    // this.price = 0;
    // this.lostpercentage = 0;

    // this.unit = {} as Unit;
    // this.brand = {} as Brand;
    // this.category = {} as Category;
    // this.conditioning = {} as Conditioning;
    // this.stock = 0;
  }

  deletePurchase(purchase: Purchase): void {
    // this.productClicked = product;

    // this.dialog.open(this.dialogTemplateDelete, {
    //   width: '400px',
    // });
  }


  // confirmDelete(): void {
  //   this.productService.deleteProduct(this.productClicked.id).then(() => {
  //     this.snackBar.open('Produit supprimé avec succès !', 'Fermer', {
  //       duration: 3000,
  //       panelClass: ['snackbar-success']
  //     });
  //     this.getAll();
  //     this.closeDialog();
  //   }).catch(err => {
  //     this.snackBar.open('Erreur lors de la suppression du produit.', 'Fermer', {
  //       duration: 3000,
  //       panelClass: ['snackbar-error']
  //     });
  //   });
  // }
}
