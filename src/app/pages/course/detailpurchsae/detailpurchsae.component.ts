import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CalendarModule } from 'angular-calendar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { Product } from 'src/app/entity/Product';
import { CurrencyService } from 'src/app/services/currency/currency.service';
import { DetailsPurchasing } from 'src/app/services/detailspurchasing/DetailsPurchasing';
import { DetailspurchasingService } from 'src/app/services/detailspurchasing/detailspurchasing.service';
import { Price } from 'src/app/services/price/Price';
import { PriceService } from 'src/app/services/price/price.service';
import { ProductService } from 'src/app/services/product/product.service';
import { Purchase } from 'src/app/services/purchase/Purchase';
import { PurchaseService } from 'src/app/services/purchase/purchase.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { Unit } from 'src/app/services/unit/Unit';
import { UnitService } from 'src/app/services/unit/unit.service';

@Component({
  selector: 'app-detailpurchsae',
  standalone: true,
  imports: [ ConfirmDialogModule,CalendarModule,
    TablerIconsModule,DialogModule,ToastModule,
    CommonModule,TableModule,PaginatorModule,DividerModule,
    MatButtonModule, MatDialogModule,TabViewModule,OverlayPanelModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './detailpurchsae.component.html',
  styleUrl: './detailpurchsae.component.scss'
})
export class DetailpurchsaeComponent {

  activeIndex: number = 0;

  detailPurchases:DetailsPurchasing[]=[]
  positionModalConfirm:any
  motRecherche=''

  quantity:number=0;
  value:number=0
  totalPrice:number=0;

  purchase :Purchase=new Purchase();
  // prices:Price[]
  products:Product[]
  product:Product
  price:Price=new Price()

  // currencys:Currency[]
  // currency:Currency

  units:Unit[]
  unit?:Unit

  distinctUnit=false
  distinctUnitEdit=false
  realQuantity:any
  realQuantityEdit:any
  realQ:number
  detailPurchase: DetailsPurchasing=new DetailsPurchasing();
  // description:string

  isError:boolean
  isSuccess:boolean
  erreur:string
  sucess:string
  loading: boolean = false;

  detailPurchaseClicked: DetailsPurchasing=new DetailsPurchasing();
  position:string
  isEditdetailPurchaseDialogVisible:boolean=false
  isErrorEdit:boolean
  isSuccessEdit:boolean
  erreurEdit:string
  sucessEdit:string

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,private route:ActivatedRoute,private purchaseService:PurchaseService,
    private detailPurchaseService:DetailspurchasingService,private priceService:PriceService,private productService:ProductService,public tableShort:TableShortService,
    private currencyService:CurrencyService,private unitService:UnitService) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.purchaseService.getById(id).then(data =>{
      console.log(data)
      this.purchase=data
      this.detailPurchase.purchase=this.purchase
      this.getAll()

    })
    // this.getPrices()
    this.getProducts()
    this.getUnits()
    //this.getCurrencys()
  }

  //recuperation de valeurs
  getAll(){
    this.detailPurchaseService.byPurchase(this.purchase.id).then(data =>{
      console.log(data)
      this.detailPurchases=data
    })
  }


  // getPrices(){
  //   this.priceService.byShop(this.purchase.shop.id).then(data =>{
  //     console.log(data)
  //     this.prices=data
  //   })
  // }

  getProducts(){
    this.productService.getAllValidated().then(data =>{
      console.log(data)
      this.products=data
    })
  }

  getUnits(){
    this.unitService.getAllUnits().then(data =>{
      console.log(data)
      this.units=data
    })
  }

  // getCurrencys(){
  //   this.currencyService.getAll().then(data =>{
  //     console.log(data)
  //     this.currencys=data
  //   })
  // }


  ///save
  async save(){
    console.log("hello")
    this.isError=false
    this.isSuccess=false
    this.loading=true

    this.detailPurchase.purchase=this.purchase
    this.detailPurchase.product=this.price.product

    //recup des valeurs et attribution

    var price=new Price()
    price.currency=this.purchase.currency
    price.product=this.product
    price.value=this.value
    price.shop=this.purchase.address.shop
    await this.findOrCreatePrice(price)

    this.detailPurchase.totalPrice=this.totalPrice
    this.detailPurchase.price=this.price
    if(this.distinctUnit){
      this.detailPurchase.quantity=this.realQ
    }else this.detailPurchase.quantity=this.quantity

    this.detailPurchaseService.create(this.detailPurchase).then((data) =>{
      this.getAll();
      this.loading=false
      //this.isSuccess=true
      this.sucess="Ligne créée!"
      // this.price=0
      // this.geolocation=0
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
      this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: this.erreurEdit });

    });
  }

  openModifier(position:string,info:any){
    this.realQ=0
    this.distinctUnit=false
    this.isErrorEdit=false
    this.isSuccessEdit=false
    this.detailPurchaseClicked=info
    this.position = position;
    this.isEditdetailPurchaseDialogVisible = true
    console.log(this.detailPurchaseClicked)

    this.changeEditUnit()
    this.changeProduct()
    this.changeEditUnit()

  }

  async update(){
    this.isErrorEdit=false
    this.isSuccessEdit=false
    this.loading=true
    console.log(this.detailPurchaseClicked)
    if(this.distinctUnitEdit){
      this.detailPurchaseClicked.quantity=this.realQ
    }else this.detailPurchaseClicked.quantity

    console.log(this.detailPurchaseClicked.price);
    await this.findOrCreatePrice(this.detailPurchaseClicked.price)

    this.detailPurchaseClicked.price=this.price
    this.detailPurchaseService.update(this.detailPurchaseClicked.id,this.detailPurchaseClicked).then(data=>{
      this.loading=false
      //this.isSuccessEdit=true
      this.sucessEdit="Ligne modifiée"
      this.getAll()
      this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucessEdit});
      this.isEditdetailPurchaseDialogVisible = false

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
  delete(position: string,detailPurchase:DetailsPurchasing) {
    this.positionModalConfirm = position;

    this.confirmationService.confirm({
        message: 'Veuillez confirmer la suppresion de  '+detailPurchase?.product?.name,
        header: 'Comfirm delete',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.detailPurchaseService.delete(detailPurchase.id).then(data=>{this.getAll()})
          this.messageService.add({ severity: 'error', summary: 'Confirm', detail: 'Ligne supprimée' });
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
  changeProduct(){
    //this.totalPrice=value*this.quantity
    this.unit=this.product.unit
    //this.changeUnit()
  }

  changeValue(value: any ){
    this.totalPrice=value*this.quantity
    //this.unit=this.product.unit
    this.changeUnit()
  }

  async findOrCreatePrice(price:Price){
    await this.priceService.loadOrCreate(price).then(data=>{
      console.log(data);
      this.price=data.data
    })
  }

  changeUnit(){
    if(this.product?.unit?.code?.toUpperCase()=="KG" || this.product?.unit?.code?.toUpperCase()=="G" || this.product?.unit?.code?.toUpperCase()=="L" || this.product?.unit?.code?.toUpperCase()=="ML"){
      if(this.product.unit!=this.unit){
        this.distinctUnit=true
        if(this.unit?.code?.toUpperCase()=="KG"){
          this.realQ=this.quantity*1000
          this.realQuantity=this.realQ+ " Gramme"
        }else if(this.unit?.code?.toUpperCase()=="G"){
          this.realQ=this.quantity/1000
          this.realQuantity=this.realQ+ " Kilogramme"

        }else if(this.unit?.code?.toUpperCase()=="L"){
          this.realQ=this.quantity*1000
          this.realQuantity=this.realQ+ " Millilitre"
        }
        else if(this.unit?.code?.toUpperCase()=="ML"){
          this.realQ=this.quantity/1000
          this.realQuantity=this.realQ+ " Litre"

        }else{
          this.realQuantity="Conversion impossible"
        }

      }else this.distinctUnit=false
    }

  }

  changeEditUnit(){
    if(this.detailPurchaseClicked?.price.product?.unit?.code?.toUpperCase()=="KG" || this.detailPurchaseClicked?.price.product?.unit?.code?.toUpperCase()=="G" ){
      //if(this.detailPurchaseClicked?.price.product.unit!=this.unit){
        this.distinctUnitEdit=true
        if(this.detailPurchaseClicked?.price?.product?.unit?.code?.toUpperCase()=="KG"){
          this.distinctUnitEdit=false
          this.realQ=this.detailPurchaseClicked?.quantity*1000
          this.realQuantityEdit=this.realQ+ " Gramme"
        }else if(this.detailPurchaseClicked?.price?.product?.unit?.code?.toUpperCase()=="G"){
          this.realQ=this.detailPurchaseClicked?.quantity/1000
          this.realQuantityEdit=this.realQ+ " Kilogramme"

        }else{
          this.realQuantityEdit="Conversion impossible"
        }

      // }
    }else {
      this.distinctUnitEdit=false,console.log("fffff");
    }

  }



  changeEditValue(value: any ){
    this.detailPurchaseClicked.totalPrice=value*this.detailPurchaseClicked.quantity
    //this.unit=this.product.unit
    this.changeEditUnit()
  }


}
