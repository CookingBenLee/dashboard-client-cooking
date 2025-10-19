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
import { DishesPriceService } from 'src/app/services/dishes/dishes-price.service';

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

// Propriétés pour la gestion des photos
selectedPhoto: File | null = null;
photoPreview: string | null = null;

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
  private recipeService:RecipeService,private detaiRecipeService:DetailsrecipeService,private dishePriceService:DishesPriceService,
  // private categoryRecipeService:CategoryrecipeService,
  public tableShort:TableShortService,public config: DynamicDialogConfig,) {
    this.recipe=this.config.data
    if (this.recipe.principaleRecipe) {
      this.base = { name: 'OUI' }
    }
    if (!this.recipe.principaleRecipe) {
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


  addProduct(){
    const user = this.tokenService.getUser();
      this.productData.user = { id: user.id };
      console.log(this.productData);
      this.productData.secondaryRecipe = false;
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

  resetFields() {
    this.recipe.code = "";
    this.recipe.name = "";
    this.recipe.ratio = 0;
    this.recipe.detailCuisine = "";
    this.base = {}; // Réinitialiser la sélection
    this.recipe = new Recipe();
    this.totalProportion = 0;
  }

base: any = {}
productData: any = {}
productDialog: boolean = false;
// Méthode pour ouvrir le dialogue de produit lors du changement de statut via dropdown
openDialogProduct(event: any){
  console.log("🔄 Changement de statut de recette:", event.value);
  
  if (event.value.name === 'OUI') {
    // Recette principale - pas de création de produit
    console.log("✅ Recette principale - pas de création de produit associé");
    this.recipe.principaleRecipe = true;
    this.recipeService.update(this.recipe.id, this.recipe).then(async data => {
      this.loading = false;
      this.sucessEdit = "Recette Modifiée";
      this.messageService.add({key: 'tc', severity: 'success', summary: 'Success', detail: this.sucessEdit});
      
      await this.saveAllDetail(data.data);
      await this.getAll(this.recipe.id);
      this.ref?.close();
    }, (error: any) => {
      this.loading = false;
      if (error.error.message == 'ko') {
        this.erreurEdit = error.error.data;
      } else {
        this.erreurEdit = error.error.data;
      }
      this.messageService.add({key: 'tc', severity: 'error', summary: 'Error', detail: this.erreurEdit});
    });
  } else if (event.value.name === 'NON') {
    // Recette non principale - création de produit
    console.log("🔧 Recette non principale - ouverture du dialogue de création de produit");
    this.productData.name = this.recipe.name;
    this.productData.unit = this.units.find(item => item.code === 'Kg') || null;
    this.productData.category = this.categorys.find(element => element.code === 'I017') || null;
    this.productData.lossPercentage = 0.1;
    this.productDialog = true;
    this.recipe.principaleRecipe = false;
  }
}

// Méthode pour ouvrir le dialogue de produit lors de la modification d'une recette
openDialogProductForRecipe(recipe: any){
  console.log("🔧 Ouverture du dialogue de création de produit pour la recette:", recipe);
  this.productData.name = recipe.name;
  this.productData.price = recipe.cout;
  this.productData.unit = this.units.find(item => item.code === 'Kg') || null;
  this.productData.category = this.categorys.find(element => element.code === 'I017') || null;
  this.productData.lossPercentage = 0.1;
  this.productData.secondaryRecipe = true;
}

   //recuperation de valeurs
   async getAll(id:any){
    console.log('🔍 Chargement des ingrédients pour la recette ID:', id);
    
    await this.detaiRecipeService.byRecipe(this.recipe.id).then(data =>{
      console.log('📊 Données reçues:', data);
      
      // Vider les tableaux avant de les remplir
      this.detailRecipe2 = [];
      this.detailRecipeProvisoire2 = [];
      this.totalProportion = 0;

      if (data && data.length > 0) {
        console.log('Traitement de', data.length, 'ingrédients');
        data.forEach(detail => {
          // Convertir les proportions de décimal vers pourcentage pour l'affichage
          if (detail.proportion && detail.proportion <= 1) {
            detail.proportion = detail.proportion * 100;
          }
          
          this.detailRecipe2.push(detail);
          this.detailRecipeProvisoire2.push(detail);
          this.totalProportion += detail.proportion || 0;
        });
      } else {
        console.log('⚠️ Aucun ingrédient trouvé pour cette recette');
      }
      
      this.detailRecipeProvisoire2.push(new DetailsRecipe());
      console.log('Tableau final detailRecipe2:', this.detailRecipe2);
      console.log('Total proportion:', this.totalProportion);
    }).catch(error => {
      console.error('❌ Erreur lors du chargement des ingrédients:', error);
    });
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
    console.log('🔍 Ajout d\'un ingrédient:', detail.ingredient?.name, 'avec proportion:', detail.proportion);
    
    // Vérifier si l'ingrédient existe déjà dans la liste
    const existingIndex = this.detailRecipe2.findIndex(d => 
      d.ingredient && detail.ingredient && d.ingredient.id === detail.ingredient.id
    );
    
    if (existingIndex !== -1) {
      // Mettre à jour l'ingrédient existant
      this.detailRecipe2[existingIndex] = detail;
      console.log("Ingrédient mis à jour à l'index:", existingIndex);
    } else {
      // Ajouter un nouvel ingrédient
      this.detailRecipe2.push(detail);
      console.log("Nouvel ingrédient ajouté");
    }
    
    // Synchroniser avec detailRecipeProvisoire2
    this.detailRecipeProvisoire2 = [...this.detailRecipe2];
    this.detailRecipeProvisoire2.push(new DetailsRecipe());
    
    // Recalculer la proportion totale
    this.totalProportion = 0;
    this.detailRecipe2.forEach(d => {
      if (d.proportion && d.proportion > 0) {
        this.totalProportion += d.proportion;
      }
    });
    
    console.log("Total proportion après ajout:", this.totalProportion);
    console.log("Nombre d'ingrédients dans detailRecipe2:", this.detailRecipe2.length);
    
    // Validation des proportions (99% à 110%)
    if (this.totalProportion < 99) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Attention', 
        detail: 'Proportion totale faible: ' + this.totalProportion.toFixed(2) + '% (recommandé: 99-110%)' 
      });
    } else if (this.totalProportion > 110) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: 'Proportion totale trop élevée: ' + this.totalProportion.toFixed(2) + '% (maximum: 110%)' 
      });
    } else {
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Succès', 
        detail: 'Ingrédient ajouté. Total: ' + this.totalProportion.toFixed(2) + '%' 
      });
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
        
        // Recalculer la proportion totale après suppression
        this.totalProportion = 0;
        this.detailRecipe2.forEach(d => {
          if (d.proportion && d.proportion > 0) {
            this.totalProportion += d.proportion;
          }
        });
        
        this.messageService.add({ severity: 'success', summary: 'Confirm', detail: 'Ingrédient supprimé' });
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
    // Validation des proportions
    if(this.totalProportion < 99 || this.totalProportion > 110){
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erreur de proportion', 
        detail: 'La proportion totale doit être comprise entre 99% et 110%. Total actuel: ' + this.totalProportion.toFixed(2) + '%' 
      });
      return;
    }
    
    this.loading=true
    console.log(this.recipe)
    this.recipe.categoryRecipe=this.categorySelected
    var success=false
    
    // Gérer l'upload de photo si une photo a été sélectionnée
    if (this.selectedPhoto && this.recipe.id) {
      try {
        await this.recipeService.uploadPhoto(this.selectedPhoto, this.recipe.id);
        console.log('Photo uploadée avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'upload de la photo:', error);
        this.messageService.add({key:'tc', severity: 'warn', summary: 'Attention', detail: 'Erreur lors de l\'upload de la photo'});
      }
    }
    
    // Mettre à jour le statut de la recette
    if (this.base.name === "OUI") {
      this.recipe.principaleRecipe = true;
      console.log("✅ Recette principale - pas de création de produit associé");
    } else if (this.base.name === "NON") {
      this.recipe.principaleRecipe = false;
      console.log("🔧 Recette non principale - ouverture du dialogue de création de produit");
    }

    // Mettre à jour la recette
    await this.recipeService.update(this.recipe.id, this.recipe).then(async data => {
      this.loading = false;
      this.sucessEdit = "Recette Modifiée";
      this.messageService.add({key: 'tc', severity: 'success', summary: 'Success', detail: this.sucessEdit});
      
      await this.saveAllDetail(data.data);
      
      // Si c'est une recette non principale, ouvrir le dialogue de création de produit
      if (this.base.name === "NON") {
        this.productDialog = true;
        this.openDialogProductForRecipe(await this.dishePriceService.getDetailRecipeWithRecipeInfos(this.recipe));
      } else {
        // Si c'est une recette principale, fermer directement
        this.isEditRecipeDialogVisible = false;
        await this.getAll(this.recipe.id);
        this.ref?.close();
      }
    }, (error: any) => {
      this.loading = false;
      if (error.error.message == 'ko') {
        this.erreurEdit = error.error.data;
      } else {
        this.erreurEdit = error.error.data;
      }
      this.messageService.add({key: 'tc', severity: 'error', summary: 'Error', detail: this.erreurEdit});
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
    const user = this.tokenService.getUser();
    // const base = false;
    await this.productService.getAll(user.id).then(data =>{
      console.log(data)
      this.products=data;
      // this.products = this.products.filter((element:any) => element.user.id === user.id);
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
    console.log('=== DÉBUT SAUVEGARDE DÉTAILS MODIFICATION ===');
    console.log('Recette ID:', recipe.id);
    console.log('Nombre d\'ingrédients dans detailRecipe2:', this.detailRecipe2.length);
    
    // Filtrer les ingrédients valides (ceux qui ont un ingredient et une proportion)
    const validDetails = this.detailRecipe2.filter(detail => 
      detail.ingredient && detail.proportion && detail.proportion > 0
    );
    
    console.log('Ingrédients valides après filtrage:', validDetails.length);
    
    if (validDetails.length === 0) {
      console.log('❌ Aucun ingrédient valide à sauvegarder');
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Aucun ingrédient valide trouvé pour la sauvegarde'
      });
      return;
    }
    
    console.log('=== SAUVEGARDE DES INGRÉDIENTS ===');
    validDetails.forEach((detail, index) => {
      console.log(`Sauvegarde ingrédient ${index + 1}/${validDetails.length}:`, {
        name: detail.ingredient?.name,
        proportion: detail.proportion,
        proportionPercent: detail.proportion + '%',
        recipeId: recipe.id
      });
      
      detail.recipe = recipe;
      // Convertir les proportions de pourcentage vers décimal pour la sauvegarde
      if (detail.proportion > 1) {
        detail.proportion = detail.proportion / 100;
      }
      
      this.detaiRecipeService.create(detail).then(async data => {
        console.log('✅ Ingrédient sauvegardé avec succès:', data);
        this.messageService.add({ 
          key: 'tc', 
          severity: 'success', 
          summary: 'Success', 
          detail: detail?.ingredient?.name + ' (' + (detail.proportion * 100).toFixed(2) + '%) créé' 
        });
      }, (error: any) => {
        console.error('❌ Erreur lors de la sauvegarde de l\'ingrédient:', error);
        if (error.error && error.error.message == 'ko') {
          this.erreur = error.error.data
        } else {
          this.erreur = "Erreur serveur"
        }
        this.messageService.add({ 
          key: 'tc', 
          severity: 'error', 
          summary: 'Error', 
          detail: this.erreur + ' - ' + detail?.ingredient?.name + ' (' + (detail.proportion * 100).toFixed(2) + '%)' 
        });
      });
    });
    
    console.log('=== FIN SAUVEGARDE DÉTAILS MODIFICATION ===');
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

  // Méthodes pour la gestion des photos
  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Stocker le nom du fichier dans la recette
      this.recipe.photo = file.name;
    }
  }

  getPhotoUrl(): string {
    if (this.photoPreview) {
      return this.photoPreview;
    }
    if (this.recipe.photo) {
      return `http://localhost:8080/recipe/uploaddir/${this.recipe.photo}`;
    }
    return '';
  }

  removePhoto(): void {
    this.selectedPhoto = null;
    this.photoPreview = null;
    this.recipe.photo = '';
    
    // Réinitialiser l'input file
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

}
