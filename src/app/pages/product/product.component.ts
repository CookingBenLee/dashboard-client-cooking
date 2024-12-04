import { AppAddEmployeeComponent } from './../apps/employee/add/add.component';
import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
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
import da from 'date-fns/locale/da';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    CommonModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
  Object.create(null);

  rows=10
  totalRows=0
  page=0;
  count=0;
  //first: number = 1;
  //maxS=8;
  totalPages=0
  resClient:any
  searchText: any;
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

  product: Product=new Product();

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

  displayedColumns: string[] = [
    '#',
    'name',
    'code',
    'stock',
    'unit',
    'category',
    'brand',
    'conditioning',
    'price',
    'lossPercentage',
    'description',
    'action',
  ];

  dataSource = new MatTableDataSource<Product>([]);


  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
  //  Object.create(null);

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private brandService:BrandService,private conditioningService:ConditioningService,private unitService:UnitService,private categoryService:CategoryService,
    private productService:ProductService ,private paginateService:PaginateService,
  ) {}

  ngOnInit(): void {
    // this.loadEmployees();
    this.getAll();
  }

  getAll(){
    const params=this.paginateService.getRequestParams(this.page,this.rows)
    console.log(params);
    this.productService.getActivePage(params).then(data =>{
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

  onPageChange(event: any): void {
    console.log(event);
    
    this.page = event.pageIndex; // Index de la nouvelle page
    this.rows = event.pageSize; // Taille de la page
    console.log(`Page: ${this.page}, Rows per page: ${this.rows}`);
    this.getAll(); // Charger les données de la nouvelle page
  }


  // loadEmployees(): void {
  //   const employee = this.employeeService.getEmployees();
  //   this.dataSource.data = employee;
  //   this.dataSource = new MatTableDataSource(employee);
  // }
  ngAfterViewInit(): void {
    //this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  recherche(){

    console.log(this.motRecherche);
    
    if(this.motRecherche==""){
      this.onSearch=false
      this.page=0
      this.getAll()

    }else{
      this.onSearch=true

      const params=this.paginateService.getRequestParams(this.page,this.rows)
      console.log(params);
      this.productService.rechercheParPage(this.motRecherche,params).then(data =>{
      console.log(data)
        //this.menus=data
        console.log(data)
        //this.infos=data
        console.log(data)
        //this.contenus=data

        this.totalPages=data.totalPages
          if(this.products.length==0 || this.page==0){
            this.resClient = data;
            this.products = data.content;
            this.totalRows = data.totalElements;
            this.dataSource.data = data.content; // Ajoutez cette ligne
            console.log("new call")

          }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
             this.resClient.number = data.number;
            this.products=data.content;
            this.dataSource.data=data.content; // Ajoutez cette ligne
            console.log("added call")
            console.log(this.dataSource.data)
            console.log(this.products)

          }
      }, error => {
        //console.log(error)
      })
    }
  }

  openDialog(action: string, employee: Employee | any): void {
    const dialogRef = this.dialog.open(AppEmployeeDialogContentComponent, {
      data: { action, employee },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.dataSource.data = this.employeeService.getEmployees();
      // if (result && result.event === 'Refresh') {
      //   this.loadEmployees(); // Refresh the employee list if necessary
      // }
    });
  }
}

interface DialogData {
  action: string;
  employee: Employee;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: '/employee-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppEmployeeDialogContentComponent {
action: string | any;
  // tslint:disable-next-line - Disables all
  local_data: Employee;
  selectedImage: any = '';
  joiningDate = new FormControl();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppEmployeeDialogContentComponent>,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,

    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.action = data.action;
    this.local_data = { ...data.employee };

    this.joiningDate = new FormControl();

    if (this.local_data.DateOfJoining) {
      this.joiningDate.setValue(
        new Date(this.local_data.DateOfJoining).toISOString().split('T')[0]
      ); //  existing date
    } else {
      // Set to today's date if no existing date is available
      this.joiningDate.setValue(new Date().toISOString().split('T')[0]);
    }

    // Set default image path if not already set
    if (!this.local_data.imagePath) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

  doAction(): void {
    this.local_data.DateOfJoining = this.joiningDate.value;

    if (this.action === 'Add') {
      this.employeeService.addEmployee(this.local_data);
      this.dialogRef.close();
      // Open success dialog
      const successDialogRef = this.dialog.open(AppAddEmployeeComponent);
      successDialogRef.afterClosed().subscribe(() => {
        this.dialogRef.close({ event: 'Refresh' });
        this.openSnackBar('Employee added successfully!', 'Close');
      });
    } else if (this.action === 'Update') {
      this.employeeService.updateEmployee(this.local_data);
      this.dialogRef.close({ event: 'Update' });
      this.openSnackBar('Employee updated successfully!', 'Close');
    } else if (this.action === 'Delete') {
      this.employeeService.deleteEmployee(this.local_data.id);
      this.dialogRef.close({ event: 'Delete' });
      this.openSnackBar('Employee deleted successfully!', 'Close');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      return; // No file selected
    }

    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return; // Not an image file
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      if (typeof reader.result === 'string') {
        this.local_data.imagePath = reader.result; // Set selected image path
      }
    };
  }

}
