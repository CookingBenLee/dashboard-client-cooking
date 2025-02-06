import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { CurrencyService } from 'src/app/services/currency/currency.service';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
import { Price } from 'src/app/services/price/Price';
import { PriceService } from 'src/app/services/price/price.service';
import { ProductService } from 'src/app/services/product/product.service';
import { PurchaseService } from 'src/app/services/purchase/purchase.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UnitService } from 'src/app/services/unit/unit.service';
import { TabViewModule } from 'primeng/tabview';
import { use } from 'echarts';
import { Product } from 'src/app/entity/Product';
@Component({
  selector: 'app-catalogue-de-prix',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    CommonModule,
    MatButtonModule, MatDialogModule,TabViewModule
  ],
  templateUrl: './catalogue-de-prix.component.html',
  styleUrl: './catalogue-de-prix.component.scss'
})
export class CatalogueDePrixComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
  Object.create(null);
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('dialogTemplateDelete') dialogTemplateDelete!: TemplateRef<any>

  rows=10
  totalRows=0
  page=0;
  count=0;
  //first: number = 1;
  //maxS=8;
  totalPages=0
  resClient:any
  //

  prices:Price[]=[]
  positionModalConfirm:any
  motRecherche=''
  products: Product[] = []

  // quantity:number=0;
  // value:number=0
  // totalPrice:number=0;


  // isError:boolean
  // isSuccess:boolean
  // erreur:string
  // sucess:string
  // loading: boolean = false;

  // priceClicked: Price=new Price();
  // position:string
  // isEditpriceDialogVisible:boolean=false
  // isErrorEdit:boolean
  // isSuccessEdit:boolean
  // erreurEdit:string
  // sucessEdit:string
  onSearch=true
  constructor(private route:ActivatedRoute,private purchaseService:PurchaseService,
    private priceService:PriceService,private productService:ProductService,
    private paginateService:PaginateService,private tokenService: TokenService,
    public dialog: MatDialog,private snackBar: MatSnackBar,
    private currencyService:CurrencyService,private unitService:UnitService) {}

  ngOnInit(): void {
    this.user = this.tokenService.getUser();
    console.log(this.user.id);
    
    this.getAll()

  }

  user: any
  displayedColumns?: string[] = [
    'nom produit',
    'categorie',
    'action',
    // 'fournisseur',
    // 'prix',
  ];

  dataSource = new MatTableDataSource<Price>([]);
  priceData: any = {};
  price: any = {}


  getAll(){
    const user = this.tokenService.getUser();
    this.user=user
    const params=this.paginateService.getRequestParams(this.page,this.rows)
    console.log(params);
    this.productService.getActivePage(params, user.id).then(data =>{
      console.log(data)
      //this.menus=data
      console.log(data)
      //this.infos=data
      console.log(data)
      //this.contenus=data

      this.totalPages=data.totalPages
      if (this.products.length === 0 || this.page === 0) {
        this.resClient = data;
        this.products = data.content;
        this.totalRows = data.totalElements;
        this.dataSource.data = data.content; // Ajoutez cette ligne
        console.log("new call")

      } else if (
        this.resClient.totalElements < data.totalElements ||
        this.resClient.number !== data.number
      ) {

        this.resClient.number = data.number;
        this.products=data.content;
        this.dataSource.data=data.content; // Ajoutez cette ligne
        console.log("added call")
        console.log(this.dataSource.data)
        console.log(this.products)

      }
      console.log(this.dataSource.data)

    }, error => {
      //console.log(error)
    })
  }

  // getAll(){
  //   const user= this.tokenService.getUser();
  //   const params=this.paginateService.getRequestParams(this.page,this.rows)
  //   console.log(params);
  //   this.priceService.getAllPage(params, user.id).then(data =>{
  //     console.log(data)
  //       //this.menus=data
  //       console.log(data)
  //       //this.infos=data
  //       console.log(data)
  //       //this.contenus=data

  //       this.totalPages=data.totalPages
  //         if(this.prices.length==0 || this.page==0){
  //           this.resClient=data
  //           // console.log(this.resClient)
  //           this.prices=data.content
  //           // console.log(this.totalPages)
  //           this.totalRows=data.totalElements
  //           // console.log(this.count)
  //           this.dataSource.data = data.content;
  //           console.log(this.dataSource);

  //         }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
  //           this.resClient.number =data.number
  //           this.prices=data.content
  //           // console.log(data)
  //           this.dataSource.data = data.content;
  //           console.log(this.dataSource);
  //         }
  //     }, error => {
  //       //console.log(error)
  //     })
  // }

  recherche(){

    if(this.motRecherche==""){
      this.onSearch=false
      this.page=0
      this.getAll()

    }else{
      this.onSearch=true

      const params=this.paginateService.getRequestParams(this.page,this.rows)
      console.log(params);
      this.priceService.rechercheParPage(this.motRecherche,params).then(data =>{
        console.log(data)
          //this.menus=data
          console.log(data)
          //this.infos=data
          console.log(data)
          //this.contenus=data

          this.totalPages=data.totalPages
            if(this.prices.length==0 || this.page==0){
              this.resClient=data
              console.log(this.resClient)
              this.prices=data.content
              console.log(this.totalPages)
              this.totalRows=data.totalElements
              console.log(this.count)
              this.dataSource.data = data.content;
            }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
              this.resClient.number =data.number
              this.prices=data.content
              console.log(data)
              this.dataSource.data = data.content;
            }
        }, error => {
          //console.log(error)
        })

    }
  }


  openDialog(product: Product) {
    // this.resetFields();
    console.log(product, "id du produit");
    
    
    this.priceService.byProductAndUser(product.id,this.user.id).then(
      (data: any) => {
        this.price = data;
        console.log(this.price);
      },
      (error) => {
        console.error('Error fetching price data', error);
      }
    );


    this.dialog.open(this.dialogTemplate, {
      width: '1200px', height: '300px'
    });
  }

  onPageChange(event: any): void {
    console.log(event);

    this.page = event.pageIndex;
    this.rows = event.pageSize;
    console.log(`Page: ${this.page}, Rows per page: ${this.rows}`);
    this.getAll();
  }

  openDialogDetails(price: Price) {
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
}
