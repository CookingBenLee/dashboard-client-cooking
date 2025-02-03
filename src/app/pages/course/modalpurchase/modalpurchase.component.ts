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
import { DialogService, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DetailsPurchasing } from 'src/app/services/detailspurchasing/DetailsPurchasing';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { PaginatorModule } from 'primeng/paginator';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TokenService } from 'src/app/services/token/token.service';
import { CountryService } from 'src/app/services/country/country.service';
import { ModalAddProductComponent } from '../modal-add-product/modal-add-product.component';


@Component({
  selector: 'app-modalpurchase',
  standalone: true,
  imports: [ MaterialModule,
      FormsModule,RouterModule,CalendarModule,
      ReactiveFormsModule,ConfirmDialogModule,
      TablerIconsModule,DialogModule,ToastModule,
      CommonModule,TableModule,PaginatorModule,DividerModule,
      MatButtonModule, MatDialogModule,TabViewModule,OverlayPanelModule],
    providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './modalpurchase.component.html',
  styleUrl: './modalpurchase.component.scss'
})
export class ModalpurchaseComponent {

  data:Purchase;
  //detailpurchases:DetailsPurchasing[]=[]

  shops:Shop[]=[]
  addresss:Address[]=[]
  categorys:Category[]=[]
  currencys:Currency[]=[]

  datePurchase:any;
  products:Product[]=[]
  units:Unit[]=[]

  isError:boolean
  isSuccess:boolean
  erreur:string
  sucess:string
  loading: boolean = false;
  // ref: DynamicDialogRef | undefined;
  showAddProduct=false

  price:Price;
  positionModalConfirm:any

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
    realQuantity:'',
    realtotalPrice:0,
    realUnit:""
  }
]

detailPurchasesForms2:any=[]

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,private shopService:ShopService,private tokenService: TokenService,
    private dialogService:DialogService,public config: DynamicDialogConfig,  private detailpurchaseService:DetailspurchasingService,private cdref: ChangeDetectorRef,
    private purchaseService:PurchaseService,public tableShort:TableShortService,private addressService:AddressService,private categoryService:CategoryService,public ref: DynamicDialogRef,
    private currencyService:CurrencyService,private productService:ProductService,private unitService:UnitService,private priceService:PriceService) {
      this.data=this.config.data

      var date  = new Date(this.data.datePurchase).getMonth() + '/' + new Date(this.data.datePurchase).getDate() + '/' + new Date(this.data.datePurchase).getFullYear();

      console.log(date);
      this.data.datePurchase=new Date(this.data.datePurchase)

      //this.datePurchase=new Date(date)
    }


  async ngOnInit(): Promise<void> {
    console.log(this.data);
    this.getAll(this.data.id)

    this.getAllShop()
    //this.getAllAdress()
    this.getAllCurrency()
    await this.getAllCategory()
    //this.getProductCategory(this.category)
    // this.detailPurchasings.push(new DetailsPurchasing())

    //for details
    await this.getProducts()
    this.getUnits()
    this.cdref.detectChanges();

  }


   //recuperation de valeurs
   getAll(id:any){
    this.detailpurchaseService.byPurchase(this.data.id).then(data =>{
      console.log(data)
      //this.detailpurchases=data
      data.forEach((detail: DetailsPurchasing)=>{
        var d={
          quantity:detail.quantity,
          value:detail.price.value,
          totalPrice:detail.totalPrice,
          product:detail.price.product,
          unit:detail?.price?.product?.unit,
          realQ:detail.quantity,
          distinctUnit:false,
          realQuantity:'',
          realtotalPrice:0,
          realUnit:""
        }
        this.detailPurchasesForms.push(d)
        this.detailPurchasesForms2.push(d)
      })
      this.detailPurchasesForms.push(
        {
          quantity:0,
          value:0,
          totalPrice:0,
          product:new Product(),
          unit:new Unit(),
          realQ:0,
          distinctUnit:false,
          realQuantity:'',
          realtotalPrice:0,
          realUnit:""
        }
      )



    })
  }


  getAllShop(){
    const user = this.tokenService.getUser()
    this.shopService.getAll(user.id).then(data =>{
      console.log(data)

      this.shops=data
      //this.data.shop=this.shops[0]

      //this.changeShop()
    })

  }

  // changeShop(){
  //   this.addressService.byShop(this.data.shop.id).then(data=>{

  //     this.addresss=data

  //     this.addresss.splice(0,0,this.data.shop.addressPrincipale)
  //   })
  // }


  getAllCurrency(){
    this.currencyService.getAll().then(data=>{
      this.currencys=data
    })
  }

  async getProducts(){
    const user = this.tokenService.getUser();
    await this.productService.getAllProduct().then(data =>{
      console.log(data)
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

  async getAllCategory(){
    await this.categoryService.getAllCategorys().then(data=>{
      this.categorys=data
    })
  }

  showAddProductForm(){
    this.showAddProduct=!this.showAddProduct
  }

   changeProduct(product:Product,i:any){
   ////this.totalPrice=value*this.quantity
   this.detailPurchasesForms[i].unit=this.detailPurchasesForms[i].product?.unit
   //this.unitys[i]=this.productes[i]?.unit
   this.changeValue(null,i)
   //////this.changeUnit()
 }

 changeValue(value: any,i:any ){
  console.log(i);

  this.detailPurchasesForms[i].value=this.detailPurchasesForms[i].totalPrice/this.detailPurchasesForms[i].quantity
  //this.totalPrices[i]=this.values[i]*this.quantitys[i]
  ////this.unit=this.product.unit
  this.changeUnit(i)
  this.data.montant=0

  for(let i=0;i<this.detailPurchasesForms.length;i++){
    this.data.montant+=this.detailPurchasesForms[i].totalPrice
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
 
    const form = this.detailPurchasesForms[i];
    const productUnit = form.product?.unit?.code?.toUpperCase();
    const inputUnit = form.unit?.code?.toUpperCase();

    // Vérifier si les unités sont distinctes
    if (inputUnit !== "L" && inputUnit !== "KG") {
      form.distinctUnit = true;

      // Initialiser les variables de conversion
      let conversionFactor = 1; // Facteur de conversion
      let targetUnit = ""; // Unité de destination
      let targetUnitCode = "";

      // Conversion en fonction des unités
      switch (inputUnit) {
        case "KG": // Kilogramme
          conversionFactor = 1; // Déjà en kilogramme
          targetUnit = "Kilogramme";
          targetUnitCode="KG";
          break;

        case "G": // Gramme
        case "GR":
          conversionFactor = 1 / 1000; // Convertir en kilogrammes
          targetUnit = "Kilogramme";
          targetUnitCode="KG";
          break;

        case "L": // Litre
          conversionFactor = 1; // Déjà en litre
          targetUnit = "Litre";
          targetUnitCode="L";
          break;

        case "ML": // Millilitre
          conversionFactor = 1 / 1000; // Convertir en litres
          targetUnit = "Litre";
          targetUnitCode="L";
          break;

        default: // Cas où l'unité ne peut pas être convertie
          form.realQuantity = "Conversion impossible";
          return; // Arrêter l'exécution pour cet élément
      }

      // Effectuer la conversion
      form.realQ = form.quantity * conversionFactor;
      form.realUnit=targetUnitCode
      form.realtotalPrice=form.totalPrice*conversionFactor
      form.realQuantity = `${form.realQ} ${targetUnit}`;

      //this.detailPurchasesForms[i].value=this.detailPurchasesForms[i].totalPrice/this.detailPurchasesForms[i].quantity
      //this.detailPurchasesForms[i].value=this.detailPurchasesForms[i].totalPrice/(form.quantity * conversionFactor)

    } else {
      form.distinctUnit = false; // Pas de différence d'unités
    }
 
    /*if(this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()=="KG" || this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()=="G" || this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()=="L" || this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()=="ML"){
      console.log(this.detailPurchasesForms[i].product.unit);
      console.log(this.detailPurchasesForms[i].unit);
 
     
      console.log(this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase());
      
 
      if(this.detailPurchasesForms[i]?.product?.unit?.name!=this.detailPurchasesForms[i].unit.name){
        this.detailPurchasesForms[i].distinctUnit=true
        if(this.detailPurchasesForms[i].unit?.code?.toUpperCase()=="KG"){
          this.detailPurchasesForms[i].realQ=this.detailPurchasesForms[i].quantity*1000
          this.detailPurchasesForms[i].realQuantity=this.detailPurchasesForms[i].realQ+ " Gramme"
        }else if(this.detailPurchasesForms[i].unit?.code?.toUpperCase()=="G" || this.detailPurchasesForms[i].unit?.code?.toUpperCase()=="GR"){
          this.detailPurchasesForms[i].realQ=this.detailPurchasesForms[i].quantity/1000
          this.detailPurchasesForms[i].realQuantity=this.detailPurchasesForms[i].realQ+ " Kilogramme"
 
        }else if(this.detailPurchasesForms[i].unit?.code?.toUpperCase()=="L"){
          if(this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()!="KG") {
            this.detailPurchasesForms[i].realQ=this.detailPurchasesForms[i].quantity*1000
            this.detailPurchasesForms[i].realQuantity=this.detailPurchasesForms[i].realQ+ " Gramme"

          }else if(this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()=="KG" || this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()=="L") {
            this.detailPurchasesForms[i].realQ=this.detailPurchasesForms[i].quantity
            this.detailPurchasesForms[i].realQuantity=this.detailPurchasesForms[i].realQ+ ""+this.detailPurchasesForms[i].product?.unit?.name || ""

          }
          else {
            this.detailPurchasesForms[i].realQ=this.detailPurchasesForms[i].quantity
            this.detailPurchasesForms[i].realQuantity=this.detailPurchasesForms[i].realQ+ " Millilitre"
          }
        }
        else if(this.detailPurchasesForms[i].unit?.code?.toUpperCase()=="ML"){
          if(this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()!="GR" && this.detailPurchasesForms[i].product?.unit?.code?.toUpperCase()!="G") {
            this.detailPurchasesForms[i].realQ=this.detailPurchasesForms[i].quantity/1000
            this.detailPurchasesForms[i].realQuantity=this.detailPurchasesForms[i].realQ+ " Kilogramme"

          }
          else {
            this.detailPurchasesForms[i].realQ=this.detailPurchasesForms[i].quantity
           this.detailPurchasesForms[i].realQuantity=this.detailPurchasesForms[i].realQ+ " Litre"
        }
 
        }else{
          this.detailPurchasesForms[i].realQuantity="Conversion impossible"
        }
 
      }else this.detailPurchasesForms[i].distinctUnit=false
    }*/
    console.log(this.products);
 
 
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
        realQuantity:'',
        realtotalPrice:0,
        realUnit:""
      }
    )
  }


  confirmDeleteDetail(detail:any,i:number){
    console.log(detail);

    this.confirmationService.confirm({
      message: 'Veuillez confirmer la suppresion de  '+detail.product.name+'('+detail.product.category?.name+')',
      header: 'Comfirm delete',
      icon: 'pi pi-info-circle',
      accept: () => {
        //this.purchaseService.delete(purchase.id).then(data=>{this.getAll()})
        this.detailPurchasesForms2 = this.detailPurchasesForms2.filter((item: any) => item !== detail)
        this.detailPurchasesForms = this.detailPurchasesForms.filter((item: any) => item !== detail)
        this.data.montant = (this.data.montant || 0) - (detail?.totalPrice || 0);


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



   ///save
   save(){
    this.isError=false
    this.isSuccess=false
    this.loading=true

    //recup des valeurs et attribution


    //this.data.datePurchase=new Date(this.datePurchase);
    this.purchaseService.update(this.data.id,this.data).then(async (data) =>{
      //this.getAll();

      this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: "Modification effectuée"});

      await this.saveAllDetail(data.data)
      this.ref.close;

    },
    (error: any)=>{
      //this.isError=true
      if(error.error.message=='ko'){
        this.erreur=error.error.data
        }else{
        this.erreur="Erreur lié au serveur"
      }
      this.loading=false
      this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: this.erreur });

    });
  }



  //save all  detailUnit
  saveAllDetail(purchase:Purchase){
    this.detailPurchasesForms2.forEach(async (form:any)=>{

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


    this.detailpurchaseService.create(detail).then((data) =>{
      //this.getAll();
      this.loading=false
      //this.isSuccess=true
      this.sucess="detailPurchase created !"
      // this.price=0
      // this.geolocation=0
      this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail:detail?.product?.name+' ' +detail.quantity+' '+ detail.product.code+' creer'});
      this.ref?.close

    },
    (error: any)=>{
      //this.isError=true
      if(error.error.message=='ko'){
        this.erreur=error.error.data
        }else{
        this.erreur="Server related error"
      }
      this.loading=false
      this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail:this.erreur+" "+detail?.product?.name+' ' +detail.quantity+' '+ detail.product.code });

    }
    );

  })

  }

  /*ngAfterContentChecked() {
    this.sampleViewModel.DataContext = this.DataContext;
    this.sampleViewModel.Position = this.Position;
    this.cdref.detectChanges();
 }*/
}
