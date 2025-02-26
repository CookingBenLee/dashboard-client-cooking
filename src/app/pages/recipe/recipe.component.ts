import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Product } from 'src/app/entity/Product';
import { CategoryRecipe } from 'src/app/services/categoryrecipe/CategoryRecipe';
import { CurrencyService } from 'src/app/services/currency/currency.service';
import { DetailsRecipe } from 'src/app/services/detailsrecipe/DetailsRecipe';
import { DetailsrecipeService } from 'src/app/services/detailsrecipe/detailsrecipe.service';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
import { PriceService } from 'src/app/services/price/price.service';
import { ProductService } from 'src/app/services/product/product.service';
import { Recipe } from 'src/app/services/recipe/Recipe';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { Unit } from 'src/app/services/unit/Unit';
import { UnitService } from 'src/app/services/unit/unit.service';
import { ModalrecipeComponent } from './modalrecipe/modalrecipe.component';
import { Category } from 'src/app/services/category/Category';
import { DetailrecipeComponent } from './detailrecipe/detailrecipe.component';
import { RouterModule } from '@angular/router';

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
import { DetailsPurchasing } from 'src/app/services/detailspurchasing/DetailsPurchasing';
import { TokenService } from 'src/app/services/token/token.service';
import { CountryService } from 'src/app/services/country/country.service';
import { PaginatorModule } from 'primeng/paginator';
import { MaterialModule } from 'src/app/material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { PreparationRecipe } from 'src/app/services/preparationRecipe/PreparationRecipe';
import { PreparationrecipeComponent } from './preparationrecipe/preparationrecipe.component';
import { Dishes } from 'src/app/services/dishes/Dishes';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [MaterialModule, MatButtonModule, MatDialogModule,CommonModule,TablerIconsModule,
    RouterModule,CalendarModule ,ConfirmDialogModule,InputNumberModule,InputTextareaModule, DialogModule,ToastModule,InputTextModule,
    TableModule,PaginatorModule,DividerModule, TabViewModule,OverlayPanelModule],
    providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss'
})
export class RecipeComponent {
//number for according active
index=0

rows=10
totalRows=0
page=0;
count=0;


totalPages=0
resClient:any
//

showAddCategory=false
///
detailRecipes:DetailsRecipe[]=[]
detailRecipesProvisoire:DetailsRecipe[]=[]


@ViewChild('op',{static:true}) op: OverlayPanel;

activeIndex: number = 0;
ref: DynamicDialogRef | undefined;


productSelected:Product=new Product()
products:Product[]=[]


categorySelected:CategoryRecipe=new CategoryRecipe()
CategoryRecipes:CategoryRecipe[]=[]

recipes:Recipe[]=[]
positionModalConfirm:any
motRecherche=''
onSearch=false

code: string;
name: string;
ratio: number=0;
//poids: number=0;
quantite: number=0;
//qte: number;
// cout: number=0;
// brut: number=0;
// net: number=0;
detailCuisine: string;
preparationInitial: number=0;
preparationIngredient: string;
unit: Unit;


recipe: Recipe=new Recipe();
baserecipe: boolean
isError:boolean
isSuccess:boolean
erreur:string
sucess:string
loading: boolean = false;

recipeClicked: Recipe=new Recipe();
position:string
isEditRecipeDialogVisible:boolean=false
isErrorEdit:boolean
isSuccessEdit:boolean
erreurEdit:string
sucessEdit:string

showAddDetailRecipe=false

maxRatio=100
// this.totalProportion+=detail.proportion
totalProportion=0

constructor(private confirmationService: ConfirmationService, private messageService: MessageService,private priceService:PriceService,
  private paginateService:PaginateService,private unitService:UnitService,private productService:ProductService,private cdref: ChangeDetectorRef,
  private dialogService:DialogService,private currencyService:CurrencyService,private tokenService: TokenService,
  private recipeService:RecipeService,private detailRecipeService:DetailsrecipeService,
 //  private categoryRecipeService:CategoryrecipeService,
  public tableShort:TableShortService) {}

async ngOnInit(): Promise<void> {

  this.getAll()
  //this.getAllAdress()
  await this.getAllCategory()
  //this.getProductCategory(this.category)
  // this.detailPurchasings.push(new DetailsPurchasing())

  //for details
  await this.getProducts()
  this.getUnits()
  this.cdref.detectChanges();

  this.reciss = [
    { name: 'OUI' },
    { name: 'NON' }
];

}
reciss: { name: string }[] = [];
//recuperation de valeurs
getAll(){
  const params=this.paginateService.getRequestParams(this.page,this.rows)
  console.log(params);
  const user = this.tokenService.getUser();
  this.recipeService.getAllPage(params,user.id).then(data =>{
    console.log(data)
    //this.menus=data
    console.log(data)
    //this.infos=data
    console.log(data)
    //this.contenus=data

    this.totalPages=data.totalPages
      if(this.recipes.length==0 || this.page==0){
        this.resClient=data
        console.log(this.resClient)
        this.recipes=data.content
        console.log(this.totalPages)
        this.totalRows=data.totalElements
        console.log(this.count)

      }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
        this.resClient.number =data.number
        this.recipes=data.content
        console.log(data)

      }
  }, error => {
    //console.log(error)
  })
}
  ///
  recherche(){

    if(this.motRecherche==""){
      this.onSearch=false
      this.page=0
      this.getAll()

    }else{
      this.onSearch=true
      const params=this.paginateService.getRequestParams(this.page,this.rows)
      console.log(params);
      this.recipeService.rechercheParPage(this.motRecherche, params).then(data =>{
      console.log(data)
      //this.menus=data
      console.log(data)
      //this.infos=data
      console.log(data)
      //this.contenus=data

      this.totalPages=data.totalPages
        if(this.recipes.length==0 || this.page==0){
          this.resClient=data
          console.log(this.resClient)
          this.recipes=data.content
          console.log(this.totalPages)
          this.totalRows=data.totalElements
          console.log(this.count)

        }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
          this.resClient.number =data.number
          this.recipes=data.content
          console.log(data)

        }
    }, error => {
      //console.log(error)
    })
    }

  }

  showPrepa(dishes: Dishes) {
    //this.purchaseSelected=purchase
    
  
     this.ref = this.dialogService.open(PreparationrecipeComponent, {
         header: 'Preparation',
         width: '100%',
         height:'100%',
         contentStyle: { overflow: 'auto' },
         baseZIndex: 10000,
         maximizable: true,
         data:dishes,
     });
    //  this.op.toggle(e)
  
      //  this.ref.onClose.subscribe((shop: Shop) => {
      //      if (shop) {
      //          this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: shop.name });
      //      }
      //  });
  
       // this.ref.onMaximize.subscribe((value) => {
       //     this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
       // });
   }



showAddCategoryForm(){
  this.showAddCategory=!this.showAddCategory
}

showAddDetailDishesForm(){
  this.showAddDetailRecipe=!this.showAddDetailRecipe
  this.detailRecipesProvisoire.push(new DetailsRecipe())
  var length=this.detailRecipesProvisoire.length
  console.log(length+"------------------");

  this.detailRecipesProvisoire[length-1].ingredient=this.products[0]
  // console.log(this.detailDishesProvisoire[length-1].unit.code+"------------------");
  console.log(this.detailRecipesProvisoire[length-1].ingredient?.unit.code+"------------------");

  //this.detailDishesProvisoire[length-1].unit=this.detailDishesProvisoire[length-1].ingredient?.unit
}

async firstSaveForDetail(detail:DetailsRecipe){
  //var oldMax=this.maxRatio;

 //this.maxRatio=1000000000000;


  var somme=0
  await this.detailRecipesProvisoire.forEach(detail=>{
      somme+=detail.proportion
  })

  if(somme>100){
    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible d\'ajouter ce détail, la proportion totale est dépassée.' });
  }else{
    this.detailRecipes.push(detail)
    this.detailRecipesProvisoire.push(new DetailsRecipe())
    this.totalProportion=somme
  }


}

confirmDeleteDetail(detail:DetailsRecipe,i:number){
  console.log(i);

  this.confirmationService.confirm({
    message: 'Veuillez confirmer la suppresion de  '+detail?.ingredient?.name,
    header: 'Comfirm delete',
    icon: 'pi pi-info-circle',
    accept: async () => {
      //this.purchaseService.delete(purchase.id).then(data=>{this.getAll()})
      console.log(this.detailRecipes);
      console.log(this.detailRecipesProvisoire);

      this.detailRecipes = this.detailRecipes.filter((item: any) => item !== detail)
      this.detailRecipesProvisoire = this.detailRecipesProvisoire.filter((item: any) => item !== detail)
      this.messageService.add({ severity: 'success', summary: 'Confirm', detail: 'Detail de commande supprimé' });
      console.log(this.detailRecipes);
      console.log(this.detailRecipesProvisoire);
      this.calculInfo()

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


///save
save(){
  //console.log(this.reference)
  this.isError=false
  this.isSuccess=false
  this.loading=true

  //recup des valeurs et attribution


  //this.dishe.code=this.code
  this.recipe.code=this.name
  this.recipe.name=this.name
  // this.recipe.poids=this.poids
  // this.recipe.quantite=this.quantite
  this.recipe.ratio=this.ratio

  // this.recipe.cout=this.cout
  // this.recipe.brut=this.brut
  // this.recipe.net=this.net
  this.recipe.detailCuisine=this.detailCuisine
  // this.recipe.preparationInitial=this.preparationInitial
  // this.recipe.preparationIngredient=this.preparationIngredient
  // this.recipe.unit=this.unit
  this.recipe.categoryRecipe=this.categorySelected
    const user = this.tokenService.getUser();
    this.recipe.user = {id: user.id}

  console.log(this.recipe)

  this.recipeService.create(this.recipe).then(async (data) =>{
    this.getAll();
    this.loading=false
    console.log(data);


    this.recipe.code=""
    this.recipe.name=""
    this.recipe.ratio=0
    // this.recipe.quantite=0
    // this.recipe.cout=0
    // this.recipe.brut=0
    // this.recipe.net=0


    this.activeIndex=1
    this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucess});

    await this.saveAllDetail(data.data)
    //this.ngOnInit()
    this.activeIndex=0

    this.recipe=new Recipe()
    // this.detailDishes=[]
    // this.detailDishesProvisoire=[]
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

openModifier(position:string,info:any){
  this.isErrorEdit=false
  this.isSuccessEdit=false
  this.recipeClicked=info
  this.position = position;
  this.isEditRecipeDialogVisible = true
  console.log(this.recipeClicked)
}

update(){
  this.loading=true
  console.log(this.recipeClicked)
  this.recipeService.update(this.recipeClicked.id,this.recipeClicked).then(data=>{
    this.loading=false
    //this.isSuccessEdit=true
    this.sucessEdit="Recette Modifiée"
    this.getAll()
    this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucessEdit});
    this.isEditRecipeDialogVisible = false

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
delete(position: string,recipe:Recipe) {
  this.positionModalConfirm = position;
  console.log(recipe);

  this.confirmationService.confirm({
      message: 'Veuillez confirmer la suppresion de  '+recipe.code,
      header: 'Comfirm delete',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.recipeService.delete(recipe.id).then(data=>{this.getAll()})
        this.messageService.add({ severity: 'error', summary: 'Confirm', detail: 'Recette supprimée' });
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

changeCategory(){
  // this.addressService.byShop(this.shop.id).then(data=>{

  //   this.addresss=data

  //   this.addresss.splice(0,0,this.shop.addressPrincipale)
  // })
}




show(e:any,recipe:Recipe) {
  this.ref = this.dialogService.open(ModalrecipeComponent, {
    header: 'Recette '+recipe?.code,
    width: '90%',
    contentStyle: { overflow: 'auto' },
    baseZIndex: 10000,
    maximizable: true,
    data:recipe,
  });


  this.ref.onClose.subscribe((retour: any) => {
    console.log("hhhhhhhhhhhh....///jkjhghf");

  });
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
units:Unit[]=[]






async getAllCategory(){
 //  await this.categoryRecipeService.getAllCategorys().then(data=>{
 //    this.CategoryRecipes=data
 //  })
}

async getProductCategory(category:Category){
  await this.productService.byCategory(category.id).then(data=>{
    this.products=data
  })
}
async getProducts(){
  const user = this.tokenService.getUser();
  await this.productService.getAll(user.id).then(data =>{
    console.log(data)
    this.products=data
    this.products= this.products.sort((a, b) => (a.name < b.name ? -1 : 1));

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


showDishesDetail(e:any,recipe:Recipe){
  this.ref = this.dialogService.open(DetailrecipeComponent, {
    header: 'Recette '+recipe?.code,
    width: '90%',
    contentStyle: { overflow: 'auto' },
    baseZIndex: 10000,
    maximizable: true,
    data:recipe,
  });


  this.ref.onClose.subscribe((retour: any) => {
    if (retour=="edit") {
      this.show(e,recipe);
        // this.messageService.add({ severity: 'success',key:'product', summary: 'Produit Crée ', detail: "Produit ajouté avec success" });
        // this.getProducts()
    }else{
      this.ref?.close
      //this.messageService.add({ severity: 'info',key:'product', summary: 'Produit non ajouté ', detail: "Ajout de Produit non effectué" });

    }
});
}



saveAllDetail(recipe:Recipe){
  this.detailRecipes.forEach(detail=>{
    detail.recipe=recipe;
    this.detailRecipeService.create(detail).then(data=>{

      this.getAll();
      console.log(data);

      this.loading=false
      //this.isSuccess=true
      this.sucess="detailPurchase created !"
      // this.price=0
      // this.geolocation=0
      this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail:detail?.ingredient?.name+' ' +detail.proportion+' '+ detail.ingredient.code+' creer'});
    },(error: any)=>{
      //this.isError=true
      if(error.error.message=='ko'){
        this.erreur=error.error.data
        }else{
        this.erreur="Server related error"
      }
      this.loading=false
      this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail:this.erreurEdit+detail?.ingredient?.name+' ' +detail.proportion+' '+ detail.ingredient.code });
    });

  })
}


changeValue(value: any,i:any ){
  // console.log(i);

  // this.detailPurchasesForms[i].totalPrice=this.detailPurchasesForms[i].value*this.detailPurchasesForms[i].quantity
  // //this.totalPrices[i]=this.values[i]*this.quantitys[i]
  // ////this.unit=this.product.unit
  // this.changeUnit(i)
  // this.montant=0

  // for(let i=0;i<this.detailPurchasesForms.length;i++){
  //   this.montant+=this.detailPurchasesForms[i].totalPrice
  // }
}

changeProduct(product:Product,i:any){
  console.log(product);
  // if(product?.stock?.quantity <=0){
  //   //this.messageService.add({ severity: 'info', summary: 'Cancel', detail: "Ce produit n'a pas de stock disponible" });
  // }

  //this.unit=product.unit
  ////this.totalPrice=value*this.quantity
  //this.detailDishesProvisoire[i].unit=this.detailDishesProvisoire[i].ingredient?.unit
  //this.unitys[i]=this.productes[i]?.unit
  //////this.changeUnit()
}

async RemoveLastDetail(){
  this.showAddDetailRecipe=!this.showAddDetailRecipe
  await this.detailRecipesProvisoire.pop();
  this.calculInfo()
}


////


changeDetailPoids(detail:any,i:any,edit:Boolean){
  //this.poids=0

  // if(edit){
  //   //calcul du net
  //  var poids=this.detailDishesProvisoire[i].poids
  //  var qte=this.detailDishesProvisoire[i].quantite
  //  this.detailDishesProvisoire[i].net=poids*qte/100
  // }
  // this.detailDishesProvisoire.forEach(detail=>{
  //   //this.poids+=detail.poids
  // })

  // this.changeDetailNet(detail,i,true)
}

changeDetailCout(detail:any,i:any,edit:Boolean){
  //this.cout=0
  this.detailRecipesProvisoire.forEach(detail=>{
    //this.cout+=detail.cout
  })
}
changeDetailBrut(detail:any,i:any,edit:Boolean){
  //this.brut=0
//   if(edit){
//     //calcul du net
//    var brut=this.detailDishesProvisoire[i].brut
//    var price=this.detailDishesProvisoire[i]?.ingredient?.price
//    if(price) this.detailDishesProvisoire[i].cout=brut*price
//    else this.detailDishesProvisoire[i].cout=brut
//  }
//   this.detailDishesProvisoire.forEach(detail=>{
//     //this.brut+=detail.brut
//   })
//   this.changeDetailCout(detail,i,true)
}
changeDetailNet(detail:any,i:any,edit:Boolean){
  console.log("nnetttttttttt");

//   this.net=0
//   if(edit){
//     //calcul du net
//    var net=this.detailDishesProvisoire[i].net
//    var perte=this.detailDishesProvisoire[i]?.ingredient?.lossPercentage
//    if(perte) this.detailDishesProvisoire[i].brut=net/(1-(perte/100))
//    else this.detailDishesProvisoire[i].brut=net/(1)
//  }
//   this.detailDishesProvisoire.forEach(detail=>{
//     this.net+=detail.net
//   })
//   this.changeDetailBrut(detail,i,true)


}
async changeDetailQuantite(detail:any,i:any,edit:Boolean){
  this.quantite=0
  this.detailRecipesProvisoire.forEach(detail=>{
    this.quantite+=detail.proportion
  })

  if(edit){
    //verification de la somme des details sa doit etre <= 100
    var somme=0
    //this.totalProportion=0
    await this.detailRecipesProvisoire.forEach(detail=>{
        somme+=detail.proportion
       // this.totalProportion+=detail.proportion
    })

    if(somme>100){
      this.messageService.add({ severity: 'info', summary: 'Total Proportion', detail: "La somme des proportions ne doit pas depassé 100." });
      //this.maxRatio=Math.abs(100-somme%100)
    }

    if(detail.proportion<100){
      this.maxRatio=100-(somme-detail.proportion)
    }else{
      somme-=detail.proportion
      var m=detail.proportion%100
      somme+=m
      this.maxRatio=100-(somme-m)
      //this.detailDishesProvisoire[this.detailDishesProvisoire.length-1].proportion=this.maxRatio
    }


    //calcul du net
    //  var poids=this.detailDishesProvisoire[i].poids
    //  var qte=this.detailDishesProvisoire[i].proportion
    //  this.detailDishesProvisoire[i].net=poids*qte/100

   ///////
    var p=this.detailRecipesProvisoire[i].ingredient
    console.log(p);
    // if(p?.stock?.quantity <=0){
    //   this.messageService.add({ severity: 'info', summary: 'Cancel', detail: "Ce produit n'a pas de stock disponible" });
    // }
    // if(this.detailDishesProvisoire[i].quantite>p?.stock?.quantity){
    //   this.messageService.add({ severity: 'info', summary: 'Cancel', detail: "Stock du produit insufisant !" });
    // }
  }
  this.changeDetailNet(detail,i,true)




  //this.unit=product.unit
  ////this.totalPrice=value*this.quantity
  //this.detailDishesProvisoire[i].unit=this.detailDishesProvisoire[i].ingredient?.unit
}
changeDetailPrepaInit(detail:any,i:any,edit:Boolean){
  // this.preparationInitial=0
  // this.detailDishesProvisoire.forEach(detail=>{
  //   this.preparationInitial+=detail.preparationInitial
  // })
}


async calculInfo(){
  await this.changeDetailPoids(null,null,false)
  await this.changeDetailCout(null,null,false)
  await this.changeDetailBrut(null,null,false)
  await this.changeDetailNet(null,null,false)
  await this.changeDetailQuantite(null,null,false)
  await this.changeDetailPrepaInit(null,null,false)
}


}
