import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Category } from 'src/app/services/category/Category';
import { CurrencyService } from 'src/app/services/currency/currency.service';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
import { PriceService } from 'src/app/services/price/price.service';
import { ProductService } from 'src/app/services/product/product.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { Unit } from 'src/app/services/unit/Unit';
import { UnitService } from 'src/app/services/unit/unit.service';
import { DetailsRecipe } from 'src/app/services/detailsrecipe/DetailsRecipe';
import { Recipe } from 'src/app/services/recipe/Recipe';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { DetailsrecipeService } from 'src/app/services/detailsrecipe/detailsrecipe.service';
import { CategoryrecipeService } from 'src/app/services/categoryrecipe/categoryrecipe.service';
import { CategoryRecipe } from 'src/app/services/categoryrecipe/CategoryRecipe';
import { Product } from 'src/app/entity/Product';

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
import { RouterModule } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-modalrecipe',
  standalone: true,
  imports: [MaterialModule, MatButtonModule, MatDialogModule,CommonModule,
      RouterModule,CalendarModule ,ConfirmDialogModule,InputNumberModule,InputTextareaModule, DialogModule,ToastModule,InputTextModule,
      TableModule,PaginatorModule,DividerModule, TabViewModule,OverlayPanelModule],
      providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './modalrecipe.component.html',
  styleUrls: ['./modalrecipe.component.scss',]
})
export class ModalrecipeComponent {
//number for according active


resClient:any
//

showAddCategory=false
///
detailRecipe2:DetailsRecipe[]=[]
detailRecipeProvisoire2:DetailsRecipe[]=[]


@ViewChild('op',{static:true}) op: OverlayPanel;

activeIndex: number = 0;


productSelected:Product=new Product()
products:Product[]=[]


categorySelected:CategoryRecipe=new CategoryRecipe()
categoryRecipes:CategoryRecipe[]=[]

positionModalConfirm:any
motRecherche=''


recipe: Recipe=new Recipe();

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

showAddDetailsRecipe=false

quantite:any

maxRatio=100

totalProportion=0

constructor(private confirmationService: ConfirmationService, private messageService: MessageService,private priceService:PriceService,
  private paginateService:PaginateService,private unitService:UnitService,private productService:ProductService,private cdref: ChangeDetectorRef,
  private dialogService:DialogService,private currencyService:CurrencyService,private ref: DynamicDialogRef,
  private categoryService: CategoryService,private tokenService: TokenService,
  private recipeService:RecipeService,private detaiRecipeService:DetailsrecipeService,
  // private categoryRecipeService:CategoryrecipeService,
  public tableShort:TableShortService,public config: DynamicDialogConfig,) {
    this.recipe=this.config.data
    if (this.recipe.baseRecipe) {
      this.base = { name: 'OUI' }
    }
    if (!this.recipe.baseRecipe) {
      this.base = { name: 'NON' }
    }
  }

  reciss: { name: string }[] = [];
async ngOnInit(): Promise<void> {
  await this.getAllCategory()


  await this.getAll(this.recipe.id)
  //for details
  await this.getProducts()
  this.getUnits();
  this.getCategorys();
  this.cdref.detectChanges();
  this.reciss = [
    { name: 'OUI' },
    { name: 'NON' }
  ];
}

categorys: Category[] = [];
  getCategorys(){
    this.categoryService.getAllCategorys().then(data =>{
      console.log(data)
      this.categorys=data})
  }

  resetFields() {
      this.productData = {}; 
      this.productData.name = '';
      this.productData.code = '';
      this.productData.description = '';
      this.productData.price = 0;
      this.productData.lostpercentage = 0;
    
      this.productData.unit = {} as Unit;
      this.productData.category = {} as Category;
      this.productData.stock = 0;
    }

  addProduct(){
    const user = this.tokenService.getUser();
      this.productData.user = { id: user.id };
      console.log(this.productData);
      
      this.productService.create(this.productData).then((data) =>{
        this.loading=false
        //this.isSuccess=true
        this.sucess="Produit crée !";
        this.productDialog = false;
        this.getProducts();
        this.messageService.add({severity: 'success', summary: 'Success', detail: this.sucess});
        this.resetFields();
      },
      (error: any)=>{
        //this.isError=true
        if(error.error.message=='ko'){
          this.erreur=error.error.data
          }else{
          this.erreur="Erreur liée au serveur"
        }
        this.loading=false
        this.productDialog = false;
        this.messageService.add({severity: 'error', summary: 'Error', detail: this.erreur });

      });
  }

base: any = {}
productData: any = {}
productDialog: boolean = false;
openDialogProduct(event: any){
  console.log(event.value);
  if (event.value.name === 'OUI') {
    this.productData.name = this.recipe.name;
    // console.log("product name",this.productData.name);
    this.productData.unit = this.units.find(item => item.code === 'Kg') || null;
    // console.log("Product unit:", this.productData.unit);
    this.productData.category = this.categorys.find(element => element.code === 'I017') || null;
    // console.log("Product category:", this.productData.category);
    this.productData.lostpercentage = 0;
    this.productDialog = true;
    this.recipe.baseRecipe = true;
  }
  if (event.value.name === 'OUI') {
    this.recipe.baseRecipe = true;  
    this.recipeService.update(this.recipe.id,this.recipe).then( async data=>{
      this.loading=false
      //this.isSuccessEdit=true
      this.sucessEdit="Recette Modifié"
      this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucessEdit});
      console.log("part11111111111");

       this.saveAllDetail(data.data)
      console.log("part1111111111122222222222222");

      this.isEditRecipeDialogVisible = false
      await this.getAll(this.recipe.id)
      console.log("part1111111111122222222222222333333333333");


      console.log("part11111111111222222222222223333333333334444444444444");
  
      this.ref?.close()
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
    }); 
  }
}

   //recuperation de valeurs
   async getAll(id:any){
    await this.detaiRecipeService.byRecipe(this.recipe.id).then(data =>{
      console.log(data)

      data.forEach(detail => {
        this.detailRecipe2.push(detail)
        this.detailRecipeProvisoire2.push(detail)
        this.totalProportion+=detail.proportion

      });
      this.detailRecipeProvisoire2.push(new DetailsRecipe())

      //this.detailpurchases=data
      //this.detailRecipeProvisoire2=data
      //this.detailRecipeProvisoire2=this.detailRecipe2
      //this.detailRecipeProvisoire2.push(new DetailsRecipe())
    })
      //this.detailRecipe2=this.detailRecipeProvisoire2



  }


  showAddCategoryForm(){
    this.showAddCategory=!this.showAddCategory
  }

  showAddDetailDishesForm(){
    console.log("++++++++++++++++++++++++++++++++++++++++");

    this.showAddDetailsRecipe=!this.showAddDetailsRecipe
    this.detailRecipeProvisoire2.push(new DetailsRecipe())
    console.log(this.detailRecipe2);
    console.log(this.detailRecipeProvisoire2);
  }

  async firstSaveForDetail(detail:DetailsRecipe){

    var somme=0;
    await this.detailRecipeProvisoire2.forEach(detail=>{
      somme+=detail.proportion

    })

    if(somme>100){
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible d\'ajouter ce détail, la proportion totale est dépassée.' });
    }else{
      this.totalProportion=somme
      console.log(
        '=============================================='
      );
      this.detailRecipe2.push(detail)
      this.detailRecipeProvisoire2.push(new DetailsRecipe())
    }


  }

  confirmDeleteDetailEdit(detail:DetailsRecipe,i:number){
    console.log(i);

    this.confirmationService.confirm({
      message: 'Veuillez confirmer la suppresion de  '+detail?.ingredient?.name,
      header: 'Comfirm delete',
      icon: 'pi pi-info-circle',
      accept: async () => {
        //this.purchaseService.delete(purchase.id).then(data=>{this.getAll()})
        console.log(this.detailRecipe2);
        console.log(this.detailRecipeProvisoire2);

        this.detailRecipe2 = this.detailRecipe2.filter((item: any) => item !== detail)
        this.detailRecipeProvisoire2 = this.detailRecipeProvisoire2.filter((item: any) => item !== detail)
        this.messageService.add({ severity: 'success', summary: 'Confirm', detail: 'Detail de commande supprimé' });
        console.log(this.detailRecipe2);
        console.log(this.detailRecipeProvisoire2);
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



  openModifier(position:string,info:any){
    this.isErrorEdit=false
    this.isSuccessEdit=false
    this.recipeClicked=info
    this.position = position;
    this.isEditRecipeDialogVisible = true
    console.log(this.recipeClicked)
  }

  async update(){
    this.loading=true
    console.log(this.recipe)
    this.recipe.categoryRecipe=this.categorySelected
    var success=false
    if (this.base.name === "OUI") {
      this.recipe.baseRecipe = true;
      this.productDialog = true;
      this.openDialogProduct(this.recipe);
    }
    if (this.base.name === "NON") {
      this.recipe.baseRecipe = false;
      await this.recipeService.update(this.recipe.id,this.recipe).then( async data=>{
        this.loading=false
        //this.isSuccessEdit=true
        this.sucessEdit="Recette Modifié"
        this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucessEdit});
        console.log("part11111111111");
  
        await this.saveAllDetail(data.data)
        console.log("part1111111111122222222222222");
  
        this.isEditRecipeDialogVisible = false
        await this.getAll(this.recipe.id)
        console.log("part1111111111122222222222222333333333333");
  
  
        console.log("part11111111111222222222222223333333333334444444444444");
        success=true
        this.ref?.close()
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
      });
  
      if(success){
        console.log("sucesssssssssss");
  
  
      }
    }
    
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
          this.recipeService.delete(recipe.id).then(data=>{})
          this.messageService.add({ severity: 'error', summary: 'Confirm', detail: 'Recette supprimer' });
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
      header: 'Produit '+recipe?.code,
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data:recipe,
  });
  }

  ngOnDestroy() {
      if (this.ref) {
          this.ref.close();
      }
  }


  ////////////////////
  units:Unit[]=[]






  async getAllCategory(){
    // await this.categoryRecipeService.getAllCategorys().then(data=>{
    //   this.categoryRecipes=data
    //   console.log(data);

    // })
  }

  async getProductCategory(category:Category){
    await this.productService.byCategory(category.id).then(data=>{
      this.products=data
    })
  }
  async getProducts(){
    await this.productService.getActive().then(data =>{
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


  saveAllDetail(recipe:Recipe){
    this.detailRecipe2.forEach(detail=>{
      detail.recipe=recipe;
      this.detaiRecipeService.create(detail).then(data=>{

        console.log(data);

        this.loading=false
        //this.isSuccess=true
        this.sucess="detailDishes mise à jour !"
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






  async RemoveLastDetail(){
    this.showAddDetailsRecipe=!this.showAddDetailsRecipe
    await this.detailRecipeProvisoire2.pop();
    this.calculInfo()


  }


  ////


  changeDetailPoids(){
    // this.dishe.poids=0
    // this.detailRecipeProvisoire2.forEach(detail=>{
    //   this.dishe.poids+=detail.poids
    // })
  }

  changeDetailCout(){
    this.recipe.cout=0
    this.detailRecipeProvisoire2.forEach(detail=>{
      this.recipe.cout+=detail.cout
    })
  }
  changeDetailBrut(){
    this.recipe.brut=0
    this.detailRecipeProvisoire2.forEach(detail=>{
      this.recipe.brut+=detail.brut
    })
  }
  changeDetailNet(){
    this.recipe.net=0
    this.detailRecipeProvisoire2.forEach(detail=>{
      this.recipe.net+=detail.net
    })
  }
  async changeDetailQuantite(detail:any,i:any,edit:Boolean){
    // this.dishe.quantite=0
    // this.detailRecipeProvisoire2.forEach(detail=>{
    //   this.dishe.quantite+=detail.quantite
    // })

    this.quantite=0
    //this.totalProportion=0
    this.detailRecipeProvisoire2.forEach(detail=>{
      this.quantite+=detail.proportion


    })

    var somme=0
    await this.detailRecipeProvisoire2.forEach(detail=>{
        somme+=detail.proportion
        //this.totalProportion+=detail.proportion
    })

    if(somme>=100){
      this.messageService.add({ severity: 'info', summary: 'Cancel', detail: "La somme des proportions ne doit pas depassé 100." });
      //this.maxRatio=Math.abs(100-somme%100)
    }

    if(detail.proportion<100){
      this.maxRatio=100-(somme-detail.proportion)
    }else{
      somme-=detail.proportion
      var m=detail.proportion%100
      somme+=m
      this.maxRatio=100-(somme-m)
    }
  }
  changeDetailPrepaInit(){
    // this.dishe.preparationInitial=0
    // this.detailRecipeProvisoire2.forEach(detail=>{
    //   this.dishe.preparationInitial+=detail.preparationInitial
    // })
  }


  async calculInfo(){
    // await this.changeDetailPoids()
    // await this.changeDetailCout()
    // await this.changeDetailBrut()
    // await this.changeDetailNet()
    //await this.changeDetailQuantite()
    //await this.changeDetailPrepaInit()
  }

}
