import { AppAddEmployeeComponent } from './../apps/employee/add/add.component';
import {
  Component,
  Inject,
  Optional,
  ViewChild,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Employee } from 'src/app/pages/apps/employee/employee';
import { EmployeeService } from 'src/app/services/apps/employee/employee-service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from 'src/app/entity/Product';
import { Unit } from 'src/app/services/unit/Unit';
import { Brand } from 'src/app/services/brand/Brand';
import { Category } from 'src/app/services/category/Category';
import { Conditioning } from 'src/app/services/conditioning/Conditioning';
import { BrandService } from 'src/app/services/brand/brand.service';
import { ConditioningService } from 'src/app/services/conditioning/conditioning.service';
import { UnitService } from 'src/app/services/unit/unit.service';
import { ProductService } from 'src/app/services/product/product.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
import { MatButtonModule } from '@angular/material/button';
import { TokenService } from 'src/app/services/token/token.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalproductComponent } from './modalproduct/modalproduct.component';
import { CurrencyService } from 'src/app/services/currency/currency.service';
import { Currency } from 'src/app/services/currency/Currency';
import { Router } from '@angular/router';
import { Stock } from 'src/app/services/stock/Stock';
import { StockService } from 'src/app/services/stock/stock.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { MatToolbarModule } from '@angular/material/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { UpdateProductComponent } from 'src/app/pages/product/update-product/update-product.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule, MatFormFieldModule,
    CommonModule, MatInputModule,
    MatButtonModule, MatDialogModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule, DialogModule,
    MatToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    InputNumberModule,
  ],
  providers: [ConfirmationService, MessageService, DialogService],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('dialogTemplateDelete') dialogTemplateDelete!: TemplateRef<any>;
  @ViewChild('dialogTemplateEdit') dialogTemplateEdit!: TemplateRef<any>;

  rows = 10
  totalRows = 0
  page = 0;
  count = 0;
  //first: number = 1;
  //maxS=8;
  totalPages = 0
  resClient: any
  searchText: any;
  products: Product[] = []
  brands: Brand[]
  categorys: Category[]
  units: Unit[]
  conditionings: Conditioning[]

  positionModalConfirm: any
  motRecherche = ''
  onSearch = false

  name: string
  code: string
  description: string
  price: number
  lossPercentage: number

  unit: Unit
  brand: Brand
  category: Category
  conditioning: Conditioning
  stock: number
  product: Product = new Product();
  ref: DynamicDialogRef | undefined;

  isError: boolean
  isSuccess: boolean
  erreur: string
  sucess: string
  loading: boolean = false;

  productClicked: Product = new Product();
  position: string
  isEditproductDialogVisible: boolean = false
  isErrorEdit: boolean
  isSuccessEdit: boolean
  erreurEdit: string
  sucessEdit: string

  productSelected: Product

  displayedColumns: string[] = [
    'name',
    'category',
    'conditioning',
    'stock',
    'action',
  ];

  dataSource = new MatTableDataSource<Product>([]);
  productData: any = {};

  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
  //  Object.create(null);

  constructor(
    public dialog: MatDialog, private currencyService: CurrencyService, private stockSerevice: StockService,
    private brandService: BrandService, private conditioningService: ConditioningService, private unitService: UnitService, private categoryService: CategoryService,
    private productService: ProductService, private paginateService: PaginateService, private snackBar: MatSnackBar,
    private tokenService: TokenService, private dialogService: DialogService,private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAll();
    this.getBrands()
    this.getCategorys()
    this.getConditioning()
    this.getUnit()
    this.getCurrency();
    this.productData.lossPercentage = 10.00;
  }

  getAll() {
    const user = this.tokenService.getUser();
    const params = this.paginateService.getRequestParams(this.page, this.rows)
    console.log(params);
    this.productService.getActivePage(params, user.id).then(data => {
      console.log(data)
      //this.menus=data
      // console.log(data)
      //this.infos=data
      // console.log(data)
      //this.contenus=data

      this.totalPages = data.totalPages
      if (this.products.length === 0 || this.page === 0) {
        this.resClient = data;
        this.products = data.content;
        console.log(this.products);

        this.totalRows = data.totalElements;
        this.dataSource.data = data.content; // Ajoutez cette ligne
        console.log("new call")

      } else if (
        this.resClient.totalElements < data.totalElements ||
        this.resClient.number !== data.number
      ) {

        this.resClient.number = data.number;
        this.products = data.content;
        console.log(this.products);
        this.dataSource.data = data.content; // Ajoutez cette ligne
        console.log("added call")
        console.log(this.dataSource.data)
        console.log(this.products)

      }
      console.log(this.dataSource.data)

    }, error => {
      //console.log(error)
    })
  }

  show(e: any, product: Product) {
    console.log(product)
    this.ref = this.dialogService.open(ModalproductComponent, {
      header: 'Détail produit ',
      //width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: product,
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

  recherche() {

    console.log(this.motRecherche);

    if (this.motRecherche == "") {
      this.onSearch = false
      this.page = 0
      this.getAll()

    } else {
      this.onSearch = true
      const user = this.tokenService.getUser();
      const params = this.paginateService.getRequestParams(this.page, this.rows)
      console.log(params);
      this.productService.rechercheParPage(this.motRecherche, params, user.id).then(data => {
        console.log(data)
        //this.menus=data
        console.log(data)
        //this.infos=data
        console.log(data)
        //this.contenus=data

        this.totalPages = data.totalPages
        if (this.products.length == 0 || this.page == 0) {
          this.resClient = data;
          this.products = data.content;
          this.totalRows = data.totalElements;
          this.dataSource.data = data.content; // Ajoutez cette ligne
          console.log("new call")

        } else if ((this.resClient.totalElements < data.totalElements) || this.resClient.number != data.number) {
          this.resClient.number = data.number;
          this.products = data.content;
          this.dataSource.data = data.content; // Ajoutez cette ligne
          console.log("added call")
          console.log(this.dataSource.data)
          console.log(this.products)

        }
      }, error => {
        //console.log(error)
      })
    }
  }

  // openDialogAdd() {
  //   this.resetFields();
  //   this.dialog.open(this.dialogTemplate, {
  //     width: '1200px', height: '450px'
  //   });
  // }

  camionDialog: boolean= false;
  openDialogAdd() {
    this.resetFields();
    this.camionDialog = true;
    // this.dialog.open(this.dialogTemplate, {
    //   width: '1200px', height: '450px'
    // });
  }

  openCourse() {
    this.router.navigate(['home/course'], { queryParams: { activeTab: 'new' } });
  }

  // currentUser: any;
  // getCurrentUser() {
  //   this.currentUser = this.tokenService.getUser();
  //   console.log('Utilisateur actuel récupéré :', this.currentUser); // Debug
  //   if (!this.currentUser || !this.currentUser.id) {
  //     console.error('Utilisateur non récupéré ou ID manquant.');
  //   }
  // }

  addProduct() {
    const user = this.tokenService.getUser();
      this.productData.user = { id: user.id };
      console.log(this.productData);
      this.productData.baseRecipe = false;
      this.productService.create(this.productData).then((data) =>{
        this.loading=false
        //this.isSuccess=true
        this.sucess="Produit crée !";
        this.camionDialog = false;
        this.messageService.add({severity: 'success', summary: 'Success', detail: this.sucess});
        this.resetFields();
        this.getAll();
      },
      (error: any)=>{
        //this.isError=true
        if(error.error.message=='ko'){
          this.erreur=error.error.data
          }else{
          this.erreur="Erreur liée au serveur"
        }
        this.loading=false
        this.camionDialog = false;
        this.messageService.add({severity: 'error', summary: 'Error', detail: this.erreur });

      });
    // this.productData.user = { id: user.id };
    // console.log("poduit envoye", this.productData);
    // this.productService.create(this.productData).then(() => {
    //   this.snackBar.open('Produit ajouté avec succès !', 'Fermer', {
    //     duration: 3000,
    //     panelClass: ['snackbar-success']
    //   });
    //   this.getAll();
    //   this.dialog.closeAll();
    //   this.resetFields();
    // }).catch(err => {
    //   this.snackBar.open('Erreur lors de l\'ajout du produit.', 'Fermer', {
    //     duration: 3000,
    //     panelClass: ['snackbar-error']
    //   });
    // });
  }

  productUpdate(product: Stock) {
    this.ref = this.dialogService.open(UpdateProductComponent, {
      header: "Modification d'un produit",
      width: '50vw',
      modal: true,
      baseZIndex: 10000,
      // maximizable: true,
      data: product,
      breakpoints: {
        '1960px': '75vw',
        '1640px': '90vw'
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      let summary_and_detail;
      if (data) {
        const buttonType = data?.buttonType;
        summary_and_detail = buttonType ? { summary: 'No Product Selected', detail: `Pressed '${buttonType}' button` } : { summary: 'Product Selected', detail: data?.name };
      } else {
        summary_and_detail = { summary: 'No Product Selected', detail: 'Pressed Close button' };
      }
      // this.messageService.add({ severity: 'info', ...summary_and_detail, life: 3000 });
    });

    this.ref.onMaximize.subscribe((value) => {
      // this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }



closeDialog() {
  this.dialog.closeAll();
}


deleteProduct(product: any): void {
  this.productClicked = product;

  this.dialog.open(this.dialogTemplateDelete, {
    width: '400px',
  });
}


confirmDelete(): void {

  this.stockSerevice.delete(this.productClicked.id).then(() => {
    this.snackBar.open('Stock supprimé avec succès !', 'Fermer', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
    this.getAll();
    this.closeDialog();
  }).catch(err => {
    this.snackBar.open('Erreur lors de la suppression du Stock.', 'Fermer', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  });

  // this.productService.deleteProduct(this.productClicked.id).then(() => {
  //   this.snackBar.open('Produit supprimé avec succès !', 'Fermer', {
  //     duration: 3000,
  //     panelClass: ['snackbar-success']
  //   });
  //   this.getAll();
  //   this.closeDialog();
  // }).catch(err => {
  //   this.snackBar.open('Erreur lors de la suppression du produit.', 'Fermer', {
  //     duration: 3000,
  //     panelClass: ['snackbar-error']
  //   });
  // });
}

productDialog: boolean = false;
openDialogEdit(product: Stock) {

  this.productData = { ...product };
  console.log(this.productData);
  console.log(product);
  this.productData.category = this.categorys.find(cat => cat.id === product.product.category?.id);
  this.productData.brand = this.brands.find(brand => brand.id === product.product.brand?.id);
  this.productData.unit = this.units.find(unit => unit.id === product.product.unit.id);
  this.productData.conditioning = this.conditionings.find(cond => cond.id === product.product.conditioning?.id);
  this.productData.lossPercentage = product.product.lossPercentage;
  this.productData.quantity = product?.quantity;
  this.productData.name = product.product.name;
  console.log(this.productData.quantity);

  this.productDialog = true

  // this.dialog.open(this.dialogTemplateEdit, {
  //   width: '1200px', height: '450px'
  // });
}



editProduct() {
  const user = this.tokenService.getUser();
  this.productData.compteUser = { id: user.idCompteUser };
  this.productData.product.lossPercentage = this.productData.lossPercentage;
  console.log("Produit modifié", this.productData.product);


  this.stockSerevice.update(this.productData.id, this.productData).then(
    () => {
      this.snackBar.open('Stock modifié avec succès !', 'Fermer', {
        duration: 2000,
        panelClass: ['snackbar-success']
      });
      this.getAll();
      this.dialog.closeAll();
      this.resetFields();
    }).catch(err => {
      this.snackBar.open('Erreur lors de la modification du Stock.', 'Fermer', {
        duration: 2000,
        panelClass: ['snackbar-error']
      });
    }
    );



  this.productService.update(this.productData.product.id, this.productData.product).then(() => {
    this.snackBar.open('Produit modifié avec succès !', 'Fermer', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
    this.getAll();
    this.dialog.closeAll();
    this.resetFields();
  }).catch(err => {
    this.snackBar.open('Erreur lors de la modification du produit.', 'Fermer', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  });
}


resetFields() {
  this.productData = {}; // Réinitialise les données du produit
  this.name = '';
  this.code = '';
  this.description = '';
  this.price = 0;
  this.productData.lossPercentage = 10.00;

  this.unit = {} as Unit;
  this.brand = {} as Brand;
  this.category = {} as Category;
  this.conditioning = {} as Conditioning;
  this.stock = 0;
}


getBrands() {
  this.brandService.getAllBrands().then(data => {
    console.log(data)
    this.brands = data
  })
}
getCategorys() {
  this.categoryService.getAllCategorys().then(data => {
    console.log(data)
    this.categorys = data
  })
}
getConditioning() {
  this.conditioningService.getAllConditionings().then(data => {
    console.log(data)
    this.conditionings = data
  })
}
getUnit() {
  this.unitService.getAllUnits().then(data => {
    console.log(data)
    this.units = data
  })
}
currencys: Currency[] = [];

currency: Currency = new Currency();
getCurrency() {
  this.currencyService.getAll().then(data => {
    console.log(data)
    this.currencys = data
  })
}
}

