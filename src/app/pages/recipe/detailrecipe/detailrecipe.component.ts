import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Product } from 'src/app/entity/Product';
import { Category } from 'src/app/services/category/Category';
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
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { TreeModule } from 'primeng/tree';
import { AccordionModule } from 'primeng/accordion';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ChipModule } from 'primeng/chip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-detailrecipe',
  standalone: true,
   imports: [MaterialModule, MatButtonModule, MatDialogModule,CommonModule,
      RouterModule,CalendarModule ,ConfirmDialogModule,InputNumberModule,InputTextareaModule, DialogModule,ToastModule,InputTextModule,
      TableModule,PaginatorModule,DividerModule, TabViewModule,OverlayPanelModule,
    //prime module
    InputTextModule,
    TreeSelectModule,
    DropdownModule,
    CardModule,
    PasswordModule,
    PanelModule,
    SidebarModule,
    CheckboxModule,
    TabViewModule,
    ConfirmDialogModule,
    ToastModule,
    InputNumberModule,
    InputTextareaModule,
    TableModule,
		RatingModule,
		ButtonModule,
		SliderModule,
		InputTextModule,
		ToggleButtonModule,
		RippleModule,
		MultiSelectModule,
		DropdownModule,
		ProgressBarModule,
    DialogModule,
    OverlayPanelModule,
    EditorModule,
    ListboxModule,
    CalendarModule,
    DynamicDialogModule,
    DividerModule,
    FieldsetModule,
    TreeModule,
    AccordionModule,
    PanelMenuModule,
    ChipModule,
    ProgressSpinnerModule,
    SplitButtonModule,
    FileUploadModule,
    PaginatorModule],
      providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './detailrecipe.component.html',
  styleUrls: ['./detailrecipe.component.scss','../../recipe/recipe.component.scss']
})
export class DetailrecipeComponent {
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


  CategoryRecipes:CategoryRecipe[]=[]

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

  showAddDetailRecipe=false

  totalProportion=0

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,private priceService:PriceService,
    private paginateService:PaginateService,private unitService:UnitService,private productService:ProductService,private cdref: ChangeDetectorRef,
    private dialogService:DialogService,private currencyService:CurrencyService,private   ref: DynamicDialogRef ,

    private recipeService:RecipeService,private detailRecipeService:DetailsrecipeService,
    // private categoryRecipeService:CategoryrecipeService,
    public tableShort:TableShortService,public config: DynamicDialogConfig,) {
      this.recipe=this.config.data

    }

  async ngOnInit(): Promise<void> {
    console.log('Recipe dans ngOnInit:', this.recipe);
    console.log('Recipe ID:', this.recipe.id);
    
    await this.getAllCategory()

    if (this.recipe && this.recipe.id) {
      await this.getAll(this.recipe.id)
    } else {
      console.error('Recipe ID non défini');
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'ID de la recette non défini'
      });
    }
    
    //for details
    await this.getProducts()
    this.getUnits()
    this.cdref.detectChanges();

  }


     //recuperation de valeurs
     async getAll(id:any){
      console.log('Chargement des détails pour la recette ID:', id);
      console.log('Recipe ID utilisé:', this.recipe.id);
      
      if (!this.recipe.id) {
        console.error('Recipe ID est undefined');
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'ID de la recette non défini pour charger les détails'
        });
        return;
      }
      
      await this.detailRecipeService.byRecipe(this.recipe.id).then(data =>{
        console.log('Données reçues du service:', data);
        console.log('Type de données:', typeof data);
        console.log('Longueur des données:', data ? data.length : 'undefined');
        
        // Vider les tableaux avant de les remplir
        this.detailRecipe2 = [];
        this.detailRecipeProvisoire2 = [];
        this.totalProportion = 0;

        if (data && data.length > 0) {
          console.log('Traitement de', data.length, 'détails');
          data.forEach((detail, index) => {
            console.log(`Détail ${index + 1}:`, detail);
            this.detailRecipe2.push(detail)
            this.detailRecipeProvisoire2.push(detail)
            this.totalProportion += detail.proportion || 0
          });
        } else {
          console.log('Aucun détail trouvé pour cette recette');
        }
        
        this.detailRecipeProvisoire2.push(new DetailsRecipe())
        console.log('Tableau final detailRecipe2:', this.detailRecipe2);
        console.log('Nombre d\'éléments dans detailRecipe2:', this.detailRecipe2.length);
        console.log('Total proportion:', this.totalProportion);
      }).catch(error => {
        console.error('Erreur lors du chargement des détails:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails de la recette'
        });
      })
    }


    showAddCategoryForm(){
      this.showAddCategory=!this.showAddCategory
    }

    showAddDetailRecipeForm(){
      console.log("++++++++++++++++++++++++++++++++++++++++");

      this.showAddDetailRecipe=!this.showAddDetailRecipe
      this.detailRecipeProvisoire2.push(new DetailsRecipe())
      console.log(this.detailRecipe2);
      console.log(this.detailRecipeProvisoire2);
    }

    firstSaveForDetail(detail:DetailsRecipe){
      console.log(
        '=============================================='
      );
      this.detailRecipe2.push(detail)
      this.detailRecipeProvisoire2.push(new DetailsRecipe())

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
          this.messageService.add({ severity: 'success', summary: 'Confirm', detail: 'Detail de recette supprimé' });
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



    async show(e:any,recipe:Recipe) {
      //if (this.ref) {
        this.ref.close("edit");
      //await this.closeMe()
      //}
      // this.ref = this.dialogService.open(ModaldishesComponent, {
      //   header: 'Produit '+dishes?.code,
      //   width: '90%',
      //   contentStyle: { overflow: 'auto' },
      //   baseZIndex: 10000,
      //   maximizable: true,
      //   data:dishes,
      // });
    }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }

    closeMe(){
      if (this.ref) {
        this.ref.close();
      }
    }


    ////////////////////
    units:Unit[]=[]

    async getAllCategory(){
      // await this.categoryRecipeService.getAllCategorys().then(data=>{
      //   this.CategoryRecipes=data
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
        this.detailRecipeService.create(detail).then(data=>{

          console.log(data);

          this.loading=false
          //this.isSuccess=true
          this.sucess="Detail de recette mise à jour !"
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
      this.showAddDetailRecipe=!this.showAddDetailRecipe
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
    changeDetailQuantite(){
      // this.recipe.quantite=0
      // this.detailRecipeProvisoire2.forEach(detail=>{
      //   this.recipe.quantite+=detail.quantite
      // })
    }
    changeDetailPrepaInit(){
      // this.recipe.preparationInitial=0
      // this.detailRecipeProvisoire2.forEach(detail=>{
      //   this.recipe.preparationInitial+=detail.preparationInitial
      // })
    }


    async calculInfo(){
      await this.changeDetailPoids()
      await this.changeDetailCout()
      await this.changeDetailBrut()
      await this.changeDetailNet()
      await this.changeDetailQuantite()
      await this.changeDetailPrepaInit()
    }

    // Méthode pour obtenir l'URL de l'image de la recette
    getRecipeImage(): string {
      console.log('Recipe photo:', this.recipe.photo);
      if (this.recipe.photo && this.recipe.photo.trim() !== '') {
        const imageUrl = `http://localhost:5000/recipe/uploaddir/${this.recipe.photo}`;
        console.log('Image URL:', imageUrl);
        return imageUrl;
      }
      console.log('Utilisation de l\'image par défaut');
      // Utiliser une image SVG en base64 comme fallback
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDEyMCA3MEgxODBMMTUwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxNDAiIHk9IjkwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSI4IiBmaWxsPSIjNkI3MjgwIi8+Cjwvc3ZnPgo8dGV4dCB4PSIxNTAiIHk9IjEzMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BdWN1bmUgaW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
    }

    // Gestion des événements d'image
    onImageError(event: any) {
      console.error('Erreur lors du chargement de l\'image:', event);
      console.log('Tentative de fallback vers une image par défaut');
      // Utiliser une image de fallback en base64 ou une URL publique
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDEyMCA3MEgxODBMMTUwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxNDAiIHk9IjkwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSI4IiBmaWxsPSIjNkI3MjgwIi8+Cjwvc3ZnPgo8dGV4dCB4PSIxNTAiIHk9IjEzMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BdWN1bmUgaW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
    }

    onImageLoad(event: any) {
      console.log('Image chargée avec succès:', event.target.src);
    }
}
