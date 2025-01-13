import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarModule } from 'angular-calendar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { Product } from 'src/app/entity/Product';
import { Address } from 'src/app/services/address/Address';
import { AddressService } from 'src/app/services/address/address.service';
import { Category } from 'src/app/services/category/Category';
import { CategoryService } from 'src/app/services/category/category.service';
import { Currency } from 'src/app/services/currency/Currency';
import { CurrencyService } from 'src/app/services/currency/currency.service';
import { DetailsPurchasing } from 'src/app/services/detailspurchasing/DetailsPurchasing';
import { DetailspurchasingService } from 'src/app/services/detailspurchasing/detailspurchasing.service';
import { Price } from 'src/app/services/price/Price';
import { PriceService } from 'src/app/services/price/price.service';
import { ProductService } from 'src/app/services/product/product.service';
import { Purchase } from 'src/app/services/purchase/Purchase';
import { PurchaseService } from 'src/app/services/purchase/purchase.service';
import { Shop } from 'src/app/services/shop/Shop';
import { ShopService } from 'src/app/services/shop/shop.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { Unit } from 'src/app/services/unit/Unit';
import { UnitService } from 'src/app/services/unit/unit.service';
import { ModalAddProductComponent } from '../modal-add-product/modal-add-product.component';
import { TokenService } from 'src/app/services/token/token.service';
import { use } from 'echarts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';

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

  ref: DynamicDialogRef | undefined;

  shops:Shop[]=[]
  addresss:Address[]=[]
  categorys:Category[]=[]
  currencys:Currency[]=[]

  datePurchase:Date
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
    realQuantity:''
  }
]

detailPurchasesForms2:any=[]

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,private shopService:ShopService,private tokenService: TokenService,
    private dialogService:DialogService,public config: DynamicDialogConfig,  private detailpurchaseService:DetailspurchasingService,private cdref: ChangeDetectorRef,
    private purchaseService:PurchaseService,public tableShort:TableShortService,private addressService:AddressService,private categoryService:CategoryService,
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
          unit:detail.price.product.unit,
          realQ:detail.quantity,
          distinctUnit:false,
          realQuantity:''
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
          realQuantity:''
        }
      )



    })
  }


  getAllShop(){
    const user = this.tokenService.getUser()
    this.shopService.getAll(user.id).then(data =>{
      console.log(data)

      this.shops=data
      this.data.shop=this.shops[0]

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


    this.data.datePurchase=new Date(this.datePurchase);
    this.purchaseService.update(this.data.id,this.data).then(async (data) =>{
      //this.getAll();

      this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: "Modification effectuée"});

      await this.saveAllDetail(data.data)

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
}
