import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MaterialModule } from 'src/app/material.module';
import { Address } from 'src/app/services/address/Address';
import { AddressService } from 'src/app/services/address/address.service';
import { Country } from 'src/app/services/country/Country';
import { CountryService } from 'src/app/services/country/country.service';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
import { Shop } from 'src/app/services/shop/Shop';
import { ShopService } from 'src/app/services/shop/shop.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';

@Component({
  selector: 'app-fournisseur',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    CommonModule,
    MatButtonModule, MatDialogModule
  ],
  providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './fournisseur.component.html',
  styleUrl: './fournisseur.component.scss'
})
export class FournisseurComponent implements OnInit{
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
  Object.create(null);
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('dialogTemplateDelete') dialogTemplateDelete!: TemplateRef<any>
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

 activeIndex: number = 0;
 ref: DynamicDialogRef | undefined;

 shops:Shop[]=[]
 addresses:Address[]=[]
 //addressesSelected:Address[]=[]

 addresse:Address=new Address()

 positionModalConfirm:any
 motRecherche=''

 name:string
 acronym:string
 contact:string
 email:string

 shop: Shop=new Shop();

 isError:boolean
 isSuccess:boolean
 erreur:string
 sucess:string
 loading: boolean = false;

 shopClicked: Shop=new Shop();
 position:string
 isEditShopDialogVisible:boolean=false
 isErrorEdit:boolean
 isSuccessEdit:boolean
 erreurEdit:string
 sucessEdit:string

 countrys:Country[]

 onSearch=true
 constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
   private dialogService:DialogService,public dialog: MatDialog,
   private paginateService:PaginateService,
   private adressService:AddressService,private countryService:CountryService,
   private shopService:ShopService,public tableShort:TableShortService) {}

   displayedColumns: string[] = [
    'nom',
    'acronym',
    'adresse',
    'action',
  ];

  dataSource = new MatTableDataSource<Shop>([]);
  shopData: any = {};

 ngOnInit(): void {
   this.getAll();
   this.getAllAdress();
   this.getCountrys()
 }

 openDialogAdd() {
  this.resetFields();
  this.dialog.open(this.dialogTemplate, {
    width: '1200px', height: '400px'
  });
}

onPageChange(event: any): void {
  console.log(event);

  this.page = event.pageIndex;
  this.rows = event.pageSize;
  console.log(`Page: ${this.page}, Rows per page: ${this.rows}`);
  this.getAll();
}

openDialogEdit(shop: Shop){}
deleteShop(shop: Shop){}
addProduct(){}
closeDialog() {
  this.dialog.closeAll();
}
resetFields() {}
 //recuperation de valeurs
 getAll(){
   const params=this.paginateService.getRequestParams(this.page,this.rows)
   console.log(params);
   this.shopService.getAllPage(params).then(data =>{
     console.log(data)
       //this.menus=data
       console.log(data)
       //this.infos=data
       console.log(data)
       //this.contenus=data

       this.totalPages=data.totalPages
         if(this.shops.length==0 || this.page==0){
           this.resClient=data
           console.log(this.resClient)
           this.shops=data.content
           console.log(this.totalPages)
           this.totalRows=data.totalElements
           console.log(this.count)
           this.dataSource.data = data.content;
         }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
           this.resClient.number =data.number
           this.shops=data.content
           console.log(data)
           this.dataSource.data = data.content;
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
   this.shopService.rechercheParPage(this.motRecherche,params).then(data =>{
     console.log(data)
       //this.menus=data
       console.log(data)
       //this.infos=data
       console.log(data)
       //this.contenus=data

       this.totalPages=data.totalPages
         if(this.shops.length==0 || this.page==0){
           this.resClient=data
           console.log(this.resClient)
           this.shops=data.content
           console.log(this.totalPages)
           this.totalRows=data.totalElements
           console.log(this.count)

         }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
           this.resClient.number =data.number
           this.shops=data.content
           console.log(data)

         }
     }, error => {
       //console.log(error)
     })
   }

 }
 getAllAdress(){
   this.adressService.getAll().then(data=>{
     this.addresses=data
   })
 }
 ///save
 save(){
   console.log(this.name)
   this.isError=false
   this.isSuccess=false
   this.loading=true

   //recup des valeurs et attribution
  //  this.shop.name=this.name
  //  this.shop.acronym=this.acronym
   //this.shop.contact=this.contact
   //this.shop.email=this.email
   this.shopData.addressPrincipale=this.addresse
  //this.shop.adressList=this.addressesSelected

   //console.log(this.addressesSelected);

   console.log(this.shopData)
   this.adressService.create(this.shop.addressPrincipale).then(data1=>{
     this.shop.addressPrincipale=data1.data
     this.shopService.create(this.shop).then((data) =>{
       this.getAll();
       this.loading=false
       //this.isSuccess=true
       this.sucess="Boutique créée !"
       this.name=""
       this.acronym=""
       this.contact=""
       this.email=""
       this.activeIndex=0
       //this.addressesSelected=[]
       this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucess});
     },
     (error: any)=>{
       //this.isError=true
       if(error.error.message=='ko'){
         this.erreur=error.error.data
         }else{
         this.erreur="Erreur liée au serveur"
       }
       this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: this.erreur });

       this.loading=false
     });
   },
   (error: any)=>{
     //this.isError=true
     if(error.error.message=='ko'){
       this.erreur=error.error.data
       }else{
       this.erreur="Erreur liée au serveur"
     }
     this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: this.erreur });

     this.loading=false
   });


 }

 openModifier(position:string,info:any){
   this.isErrorEdit=false
   this.isSuccessEdit=false
   this.shopClicked=info
   this.position = position;
   this.isEditShopDialogVisible = true
   console.log(this.shopClicked)
 }

 update(){
   this.loading=true
   console.log(this.shopClicked)
   this.shopService.update(this.shopClicked.id,this.shopClicked).then(data=>{
     this.loading=false
     //this.isSuccessEdit=true
     this.sucessEdit="Boutique modifiée"
     this.getAll()
     this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucessEdit});
     this.isEditShopDialogVisible = false

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
 delete(position: string,shop:Shop) {
   this.positionModalConfirm = position;
   console.log(shop);

   this.confirmationService.confirm({
       message: 'Veuillez confirmer la suppresion de '+shop.name,
       header: 'Comfirm delete',
       icon: 'pi pi-info-circle',
       accept: () => {
         this.shopService.delete(shop.id).then(data=>{this.getAll()})
         this.messageService.add({ severity: 'error', summary: 'Confirm', detail: 'Boutique modifiée' });
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

 show(shop:Shop) {
  //  this.ref = this.dialogService.open(ModalshopComponent, {
  //      header: 'Shop '+shop.name,
  //      width: '70%',
  //      height:'70%',
  //      contentStyle: { overflow: 'auto' },
  //      baseZIndex: 10000,
  //      maximizable: true,
  //      data:shop,
  //  });

  //  this.ref.onClose.subscribe((shop: Shop) => {
  //      if (shop) {
  //          this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: shop.name });
  //      }
  //  });

   // this.ref.onMaximize.subscribe((value) => {
   //     this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
   // });
 }

 ngOnDestroy() {
     if (this.ref) {
         this.ref.close();
     }
 }



 //////////
 //Ajout de d'address etant dans shop
 showAdressAddForm(){
  //  this.ref = this.dialogService.open(NewadressodalComponent, {
  //    header: 'Ajouter une filiale',
  //    //width: '70%',
  //    contentStyle: { overflow: 'auto' },
  //    baseZIndex: 10000,
  //      maximizable: true
  //  });

  //  this.ref.onClose.subscribe((retour: any) => {
  //      if (retour=="ok") {
  //          this.messageService.add({ severity: 'success',key:'adress', summary: 'Filiale Créée ', detail: "Filiale ajoutée avec success" });
  //          this.getAll()
  //      }else{
  //        this.messageService.add({ severity: 'info',key:'adress', summary: 'Produit non ajouté ', detail: "Ajout de filiale non effectué" });

  //      }
  //  });

   // this.ref.onMaximize.subscribe((value) => {
   //     this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
   // });
 }


 getCountrys(){
   this.countryService.getAll().then(data =>{
     console.log(data)
     this.countrys=data
   })
 }
}