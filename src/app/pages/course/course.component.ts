import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Product } from 'src/app/entity/Product';
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
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { TreeModule } from 'primeng/tree';
import { AccordionModule } from 'primeng/accordion';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ChipModule } from 'primeng/chip';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DetailsPurchasing } from 'src/app/services/detailspurchasing/DetailsPurchasing';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { PaginatorModule } from 'primeng/paginator';
import { ModalAddProductComponent } from './modal-add-product/modal-add-product.component';
import { ModalpurchaseComponent } from './modalpurchase/modalpurchase.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TokenService } from 'src/app/services/token/token.service';
import { CountryService } from 'src/app/services/country/country.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [ MaterialModule,
    FormsModule,RouterModule,CalendarModule,
    ReactiveFormsModule,ConfirmDialogModule,
    TablerIconsModule,DialogModule,ToastModule,
    CommonModule,TableModule,PaginatorModule,DividerModule,
    MatButtonModule, MatDialogModule,TabViewModule,OverlayPanelModule],
    providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent implements OnInit {
 //number for according active
 index=0
 ///gestion des detailspurchazing
 // detailsPurchases:DetailsPurchasing[]=[]

 //pagination attributs
 rows=4
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
 ///
 detailPurchasesForms=[
   {
   quantity:0,
   value:0,
   totalPrice:0,
   product:new Product(),
   unit:new Unit(),
   realQ:0,
   distinctUnit:false,
   realQuantity:''
 }
]

detailPurchasesForms2:any=[]
 // quantitys:any[]=[];
 // values:any[]=[]
 // totalPrices:any[]=[];
 // productes:Product[]=[]//=[new Product()]
 unitys:Unit[]=[]//=[new Unit()]
 @ViewChild('op',{static:true}) op: OverlayPanel;

 activeIndex: number = 0;
 ref: DynamicDialogRef | undefined;

 purchaseSelected:Purchase=new Purchase()
 purchases:Purchase[]=[]
 positionModalConfirm:any
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
 // detailPurchasings:DetailsPurchasing[]=[]


 purchase: Purchase=new Purchase();

 isError:boolean
 isSuccess:boolean
 erreur:string
 sucess:string
 loading: boolean = false;

 purchaseClicked: Purchase=new Purchase();
 position:string
 isEditpurchaseDialogVisible:boolean=false
 isErrorEdit:boolean
 isSuccessEdit:boolean
 erreurEdit:string
 sucessEdit:string
  usercurrency: [] = []


  displayedColumns: string[] = [
    'name',
    'category',
    'stock',
    'action',
  ];

  dataSource = new MatTableDataSource<Product>([]);

 constructor(private confirmationService: ConfirmationService, private messageService: MessageService,private priceService:PriceService,
   private paginateService:PaginateService,private unitService:UnitService,private productService:ProductService,private cdref: ChangeDetectorRef,
   private addressService:AddressService,private dialogService:DialogService,private currencyService:CurrencyService,private route: ActivatedRoute,
   private detailPurchaseService:DetailspurchasingService,private categoryService:CategoryService,private tokenService: TokenService,
   private countryService: CountryService,
   private purchaseService:PurchaseService,public tableShort:TableShortService,private shopService:ShopService) {}
   
   utilisateurC: any;
countryss: any[] = []; // Ensure this is initialized as an array
selectedCountry: any; // To store the retrieved country


 async ngOnInit(): Promise<void> {

  this.route.queryParams.subscribe(params => {
    if (params['activeTab'] === 'new') {
        this.activeIndex = 1; 
    } else {
        this.activeIndex = 0; 
    }
});

  this.utilisateurC =this.tokenService.getUser();
  this.usercurrency = this.utilisateurC.compteUser.address.country.currency
  console.log("currency", this.usercurrency);
  
  // console.log("courrency",.name);
  
  
  // this.countryService.getAll().then(
  //   (data: any) => {
  //       this.countryss = data;
  //       console.log(this.countryss);

  //       this.selectedCountry = this.countryss.find(
  //           (country: any) => country.id === this.utilisateurC.compteUser.country.id
  //       );
  //       console.log("selected", this.selectedCountry);
  //   }
// );


  
   //await this.addNewDetails()
 
   //ajout dun produit par defaut
   //initialisation et ajout des premier element par default
   // this.quantitys.push(0);
   // this.values.push(0)
   // this.totalPrices.push(0);
   // this.productes.push(new Product())
   // this.unitys.push(new Unit())
   // var detail=new DetailsPurchasing()
   //detail.product.name="Nouveau "+this.detailsPurchases.length+1

   //this.detailsPurchases.push(detail)
   //
   this.getAll()
   this.getAllShop()
   //this.getAllAdress()
   this.getAllCurrency()
   await this.getAllCategory()
   //this.getProductCategory(this.category)
   // this.detailPurchasings.push(new DetailsPurchasing())

   //for details
   this.getProducts()
   this.getUnits()
   this.cdref.detectChanges();

 }

 // Function to retrieve country by ID
retrieveCountryById(): void {
  if (this.countryss && this.utilisateurC) {
    const countryId = this.utilisateurC.compteUser.country.id;

    // Find the country in the list
    this.selectedCountry = this.countryss.find(
      (country: any) => country.id === countryId
    );

    // Log the selected country
    if (this.selectedCountry) {
      console.log("Selected Country:", this.selectedCountry);
    } else {
      console.error("Country not found for ID:", countryId);
    }
  } else {
    console.error("Countries list or user data not loaded.");
  }
}
 //recuperation de valeurs
 getAll(){
   const user= this.tokenService.getUser();
   const params=this.paginateService.getRequestParams(this.page,this.rows)
   console.log(params);
   this.purchaseService.getAllPage(params, user.id).then(data =>{
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

 getAllShop(){
  const user = this.tokenService.getUser();
   this.shopService.getAll(user.id).then(data =>{
     console.log(data)

     this.shops=data
     this.shop=this.shops[0]
     console.log(this.shop);

     this.changeShop()
   })

 }

 showAddProductForm(){
   this.showAddProduct=!this.showAddProduct
 }

 firstSaveForDetail(detail:any){
   this.detailPurchasesForms2.push(detail)
   this.detailPurchasesForms.push(
     {
       quantity:0,
       value:0,
       totalPrice:0,
       product:new Product(),
       unit:new Unit(),
       realQ:0,
       distinctUnit:false,
       realQuantity:''
     }
   )
 }

 confirmDeleteDetail(detail:any,i:number){
   console.log(i);

   this.confirmationService.confirm({
     message: 'Veuillez confirmer la suppresion de  '+detail.product.name+'('+detail.product.category?.name+')',
     header: 'Comfirm delete',
     icon: 'pi pi-info-circle',
     accept: () => {
       //this.purchaseService.delete(purchase.id).then(data=>{this.getAll()})
       this.detailPurchasesForms2 = this.detailPurchasesForms2.filter((item: any) => item !== detail)
       this.detailPurchasesForms = this.detailPurchasesForms.filter((item: any) => item !== detail)

       // this.detailPurchasesForms2.splice(i,i)
       // this.detailPurchasesForms.splice(i,i)

       this.messageService.add({ severity: 'success', summary: 'Confirm', detail: 'Produit supprimé' });
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

 getAllCurrency(){
   this.currencyService.getAll().then(data=>{
     this.currencys=data
   })
 }

 ///save
 save(){
   console.log(this.reference)
   this.isError=false
   this.isSuccess=false
   this.loading=true

   //recup des valeurs et attribution
   this.purchase.address=this.address
   this.purchase.shop=this.shop

   this.purchase.reference=this.reference
   this.purchase.currency=this.currency
   // this.purchase.quantity=this.quantity
   this.purchase.montant=this.montant
   this.purchase.datePurchase=this.datePurchase
  const user = this.tokenService.getUser();
    this.purchase.user = {id: user.id}
   console.log(this.purchase)

   this.purchaseService.create(this.purchase).then(async (data) =>{
     this.getAll();
     this.loading=false
     console.log(data);

     //this.isSuccess=true
     this.sucess="Commande créée !"
     this.reference=""
     // this.quantity=
     // this.montant=null
     this.datePurchase=new Date()
     this.activeIndex=1
     this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucess});

     await this.saveAllDetail(data.data)
     this.init()

   },
   (error: any)=>{
     //this.isError=true
     console.log(error);
     
     if(error.error.message=='ko'){
       this.erreur=error.error.data
       }else{
       this.erreur="Erreur lié au serveur"
     }
     this.loading=false
     this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: this.erreur });

   });
 }

 openModifier(position:string,info:any){
   this.isErrorEdit=false
   this.isSuccessEdit=false
   this.purchaseClicked=info
   this.position = position;
   this.isEditpurchaseDialogVisible = true
   console.log(this.purchaseClicked)
 }

 update(){
   this.loading=true
   console.log(this.purchaseClicked)
   this.purchaseService.update(this.purchaseClicked.id,this.purchaseClicked).then(data=>{
     this.loading=false
     //this.isSuccessEdit=true
     this.sucessEdit="Commande Modifiée"
     this.getAll()
     this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucessEdit});
     this.isEditpurchaseDialogVisible = false

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
 delete(position: string,purchase:Purchase) {
   this.positionModalConfirm = position;
   console.log(purchase);

   this.confirmationService.confirm({
       message: 'Veuillez confirmer la suppresion de  '+purchase.reference,
       header: 'Comfirm delete',
       icon: 'pi pi-info-circle',
       accept: () => {
         this.purchaseService.delete(purchase.id).then(data=>{this.getAll()})
         this.messageService.add({ severity: 'error', summary: 'Confirm', detail: 'Commande supprimer' });
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

 changeShop(){
   // this.addressService.byShop(this.shop.id).then(data=>{

   //   this.addresss=data

   //   this.addresss.splice(0,0,this.shop.addressPrincipale)
   // })
 }

 // getAllAdress(){
 //   this.addressService.getAll().then(data=>{
 //     this.addresss=data
 //   })
 // }


 show(e:any,purchase:Purchase) {
   this.ref = this.dialogService.open(ModalpurchaseComponent, {
       header: 'Produit '+purchase.reference,
       width: '90%',
       contentStyle: { overflow: 'auto' },
       baseZIndex: 10000,
       maximizable: true,
       data:purchase,
   });
   this.purchaseSelected=purchase
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

 ////////////////////
 products:Product[]=[]
 units:Unit[]=[]

 //add new details purchazing
 async addNewDetails(){
   // var detail=new DetailsPurchasing()

   // await this.detailsPurchases.push(detail)

   if(this.index==undefined || this.index==null){
     this.index=0
   }else this.index=this.index+1

   // console.log((this.quantitys));

   // this.quantitys.push(this.quantitys,0);
   // this.values.push(0)
   // this.totalPrices.push(0);
   // this.productes.push(new Product())
   // this.unitys.push(new Unit())
   // //detail.product.name="Nouveau "+this.detailsPurchases.length+1
   // console.log("##########################################################################");
   // console.log((this.quantitys));

   this.detailPurchasesForms.push({
     quantity:0,
     value:0,
     totalPrice:0,
     product:new Product(),
     unit:new Unit(),
     realQ:0,
     distinctUnit:false,
     realQuantity:''
   })
 }

 async RemoveLastDetail(){
   if(this.index==undefined || this.index==null){
     this.index=0
   }else this.index=this.index-1
   await this.detailPurchasesForms.pop();

   this.montant=0

   for(let i=0;i<this.detailPurchasesForms.length;i++){
     this.montant+=this.detailPurchasesForms[i].totalPrice
   }
 }

 changeProduct(product:Product,i:any){
   ////this.totalPrice=value*this.quantity
   this.detailPurchasesForms[i].unit=this.detailPurchasesForms[i].product?.unit
   //this.unitys[i]=this.productes[i]?.unit
   //////this.changeUnit()
 }

 changeValue(value: any,i:any ){
  console.log(i);

  this.detailPurchasesForms[i].value=this.detailPurchasesForms[i].totalPrice/this.detailPurchasesForms[i].quantity
  //this.totalPrices[i]=this.values[i]*this.quantitys[i]
  ////this.unit=this.product.unit
  this.changeUnit(i)
  this.montant=0

  for(let i=0;i<this.detailPurchasesForms.length;i++){
    this.montant+=this.detailPurchasesForms[i].totalPrice
  }
}

 async findOrCreatePrice(price:Price){
   await this.priceService.loadOrCreate(price).then(data=>{
     console.log(data);
     this.price=data.data
   })
 }

 changeUnit(i:any){
   console.log(i);
   console.log(this.products);


   if(this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()=="KG" || this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()=="G" || this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()=="L" || this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()=="ML"){
     console.log(this.detailPurchasesForms[i].product.unit);
     console.log(this.detailPurchasesForms[i].unit);

     if(this.detailPurchasesForms[i]?.product?.unit?.name!=this.detailPurchasesForms[i].unit.name){
       this.detailPurchasesForms[i].distinctUnit=true
       if(this.detailPurchasesForms[i].unit?.code?.toUpperCase()=="KG"){
         this.detailPurchasesForms[i].realQ=this.detailPurchasesForms[i].quantity*1000
         this.detailPurchasesForms[i].realQuantity=this.detailPurchasesForms[i].realQ+ " Gramme"
       }else if(this.detailPurchasesForms[i].unit?.code?.toUpperCase()=="G"){
         this.detailPurchasesForms[i].realQ=this.detailPurchasesForms[i].quantity/1000
         this.detailPurchasesForms[i].realQuantity=this.detailPurchasesForms[i].realQ+ " Kilogramme"

       }else if(this.detailPurchasesForms[i].unit?.code?.toUpperCase()=="L"){
         this.detailPurchasesForms[i].realQ=this.detailPurchasesForms[i].quantity*1000
         this.detailPurchasesForms[i].realQuantity=this.detailPurchasesForms[i].realQ+ " Millilitre"
       }
       else if(this.detailPurchasesForms[i].unit?.code?.toUpperCase()=="ML"){
         this.detailPurchasesForms[i].realQ=this.detailPurchasesForms[i].quantity/1000
         this.detailPurchasesForms[i].realQuantity=this.detailPurchasesForms[i].realQ+ " Litre"

       }else{
         this.detailPurchasesForms[i].realQuantity="Conversion impossible"
       }

     }else this.detailPurchasesForms[i].distinctUnit=false
   }
   console.log(this.products);


 }

 updateUnitPrice(index: number): void {
  const detail = this.detailPurchasesForms[index];
  if (detail.quantity > 0) {
    detail.value = detail.totalPrice / detail.quantity;
  } else {
    detail.value = 0; 
  }
}

 async getAllCategory(){
   await this.categoryService.getAllCategorys().then(data=>{
     this.categorys=data
   })
 }

 async getProductCategory(category:Category){
   await this.productService.byCategory(category.id).then(data=>{
     this.products=data
   })
 }
 async getProducts(){
    const user= this.tokenService.getUser();
   await this.productService.getAllProduct().then(data =>{
     
     this.products=data
     
     //this.productes[0]=this.products[0]
     //this.unitys[0]=this.products[0].unit
   })
 }
 getUnits(){
   this.unitService.getAllUnits().then(data =>{
     console.log(data)
     this.units=data
   })
 }

 //save all  detailUnit
 async saveAllDetail(purchase:Purchase){
   console.log(purchase);

   this.detailPurchasesForms2.forEach(async (form:any)=>{
     console.log(form)


   var detail=new DetailsPurchasing()
   detail.purchase=purchase

   //recup des valeurs et attribution
   var price=new Price()
   price.currency=purchase.currency
   price.product=form.product
   price.value=form.value
   price.shop=purchase.shop
   await this.findOrCreatePrice(price)

   detail.product=this.price.product

   detail.totalPrice=form.totalPrice
   detail.price=this.price
   if(form.distinctUnit){
     detail.quantity=form.realQ
   }else detail.quantity=form.quantity


   this.detailPurchaseService.create(detail).then((data) =>{
     this.getAll();
     console.log(data);

     this.loading=false
     //this.isSuccess=true
     this.sucess="detailPurchase created !"
     // this.price=0
     // this.geolocation=0
     this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail:detail?.product?.name+' ' +detail.quantity+' '+ detail.product.code+' creer'});


   },
   (error: any)=>{
     //this.isError=true
     if(error.error.message=='ko'){
       this.erreur=error.error.data
       }else{
       this.erreur="Server related error"
     }
     this.loading=false
     this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail:this.erreurEdit+detail?.product?.name+' ' +detail.quantity+' '+ detail.product.code });

   }
   );

 })

 }

 //////////
 //Ajout de produit etant dans approvisionnement
 showProductAddForm(){
   this.ref = this.dialogService.open(ModalAddProductComponent, {
     header: 'Ajouter un produit',
     width: '70%',
     contentStyle: { overflow: 'auto' },
     baseZIndex: 10000,
       maximizable: true
   });

   this.ref.onClose.subscribe((retour: any) => {
       if (retour=="ok") {
           this.messageService.add({ severity: 'success',key:'product', summary: 'Produit Crée ', detail: "Produit ajouté avec success" });
           this.getProducts()
       }else{
         this.messageService.add({ severity: 'info',key:'product', summary: 'Produit non ajouté ', detail: "Ajout de Produit non effectué" });

       }
   });

   // this.ref.onMaximize.subscribe((value) => {
   //     this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
   // });
 }


 init(){
   this.detailPurchasesForms=[
     {
     quantity:0,
     value:0,
     totalPrice:0,
     product:new Product(),
     unit:new Unit(),
     realQ:0,
     distinctUnit:false,
     realQuantity:''
   }
 ]

 this.detailPurchasesForms2=[]
 this.purchase=new Purchase()
 this.ngOnInit()
 }

 visibleSelect: boolean = false;
 showDialogSelect(){

  console.log("test");
  
    this.visibleSelect = true;
    
 }
}
