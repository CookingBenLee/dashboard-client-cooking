import { Component } from '@angular/core';
import { EventEmitter, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig, DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { CategoryDishes } from 'src/app/services/categorydishes/CategoryDishes';
import { CategoryrecipeService } from 'src/app/services/categoryrecipe/categoryrecipe.service';
import { CategoryMenuService } from 'src/app/services/categotyMenu/category-menu.service';
import { CompositionDishes } from 'src/app/services/compositiondishes/CompositionDishes';
import { CompositiondishesService } from 'src/app/services/compositiondishes/compositiondishes.service';
import { DetailsRecipe } from 'src/app/services/detailsrecipe/DetailsRecipe';
import { DetailsrecipeService } from 'src/app/services/detailsrecipe/detailsrecipe.service';
import { Dishes } from 'src/app/services/dishes/Dishes';
import { DishesService } from 'src/app/services/dishes/dishes.service';
import { FileSaverService } from 'src/app/services/fileSaver/file-saver.service';
import { PicturesDishes } from 'src/app/services/picturedishes/PicturesDishes';
import { PictiuredishesService } from 'src/app/services/picturedishes/pictiuredishes.service';
import { Recipe } from 'src/app/services/recipe/Recipe';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { environment } from 'src/environments/environment';

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
import { CommonModule } from '@angular/common';
import { PriceFormaterDirective } from 'src/app/directives/priceFormater/price-formater.directive';

@Component({
  selector: 'app-detaildishes',
  standalone: true,
  imports: [MaterialModule, MatButtonModule, MatDialogModule,CommonModule,PriceFormaterDirective,
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
  templateUrl: './detaildishes.component.html',
  styleUrls: ['./detaildishes.component.scss',]
})
export class DetaildishesComponent {
  loadingPage=false
  plat:Dishes=new Dishes()
  categoryDishes:CategoryDishes[]=[]
  recettes:Recipe[]=[]
  pictureClicked:PicturesDishes=new PicturesDishes()

  positionModalConfirm:any

  picturesDishes:PicturesDishes[]=[]

  ////
  ///
  picture:PicturesDishes=new PicturesDishes()
  fileBase64:any=null
  file=null

  loading=false
  loadingSave=false
  visibleImdDialog=false
  compositionDishes:CompositionDishes[]=[]

  @ViewChild('op2', {static: false}) model:OverlayPanel;

  env=environment;

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,private fileSaverService:FileSaverService,
    private ref: DynamicDialogRef,private pictureDishesService:PictiuredishesService,private dishesService:DishesService,private categoryMenuService:CategoryMenuService,
    private recipeService:RecipeService,private detailRecipeService:DetailsrecipeService,private categoryRecipeService:CategoryrecipeService,
    public tableShort:TableShortService,private compositionDishesService:CompositiondishesService,public config: DynamicDialogConfig,)
  {
    this.plat=this.config.data

  }

  ngOnInit(): void {
    this.getAll(this.plat.id)

  }

    //recuperation de valeurs
    async getAll(id:any){
      await this.compositionDishesService.byDishes(id).then(data =>{
        console.log(data)
        this.compositionDishes=data

      }).finally(async ()=>{
        await this.updateCompoPrice()
        this.calculPlat()
      })
      await this.pictureDishesService.byDishes(id).then(async data =>{
        console.log(data)
        this.picturesDishes=data


      }).finally(async ()=>{
        //this.updateCompoPrice()
        //this.calculPlat()
        console.log((this.picturesDishes));
      })
      // for(const p inn PicturesDishes){

      // }

      await this.picturesDishes.forEach(p=>{
        console.log(p.link);
        this.fileSaverService.getFile(p.link).then(data =>{
          console.log(data)
          p.file=data.data
        }).finally(()=>{

        })
      })
      console.log((this.picturesDishes));
      //this.detailRecipe2=this.detailRecipeProvisoire2
    }

      //calcul total infos pour le plat
    calculPlat(){
      this.plat.poids=0
      this.plat.cout=0
      this.compositionDishes.forEach(cp=>{
        this.plat.poids+=cp.quantity
        this.plat.cout+=cp.cout

        console.log(cp.cout);

      })
    }

    async getCompoPrice(composition:CompositionDishes):Promise<number>{

      var recipe:Recipe=composition.recipe
      recipe.cout=0
      var detailRecipes:DetailsRecipe[]=recipe.detailList;
      var brut=(composition.quantity/1000)*recipe.ratio
      console.log("----------------------------------------------------------------{}",composition);
      console.log("----------------------------------------------------------------{}",brut);



      await this.detailRecipeService.byRecipe(recipe.id).then(data=>{
        console.log(data);
        detailRecipes=data
      }).finally( async ()=>{
        for(const detail of detailRecipes){
          console.log(detail);

          console.log(detail.net);
          console.log(detail.proportion);

          detail.net=  (brut*(detail.proportion))/100
          ////
          var perte=  detail.ingredient.lossPercentage

          if (perte!=null) {
            console.log(perte);
            detail.brut=  detail.net/(1-(perte))
          }
          ///
          var price=  detail.ingredient.price
          if (price!=null) {
            //detail.floatingCout=detail.floatingBrut*price
            detail.cout=  detail.brut*price
            console.log(detail.brut);
            console.log(price);
          }else detail.cout=0
          ///
          console.log(detail.cout);
          recipe.cout= (recipe.cout + detail.cout)
        }


      })
      console.log(recipe.cout);
      console.log(detailRecipes);
      return recipe.cout;

    }

     async updateCompoPrice(){
      for(const cp of this.compositionDishes){
        //console.log(await this.getCompoPrice(cp));
        cp.cout=await this.getCompoPrice(cp);
        console.log(cp);
      }

    }

    async show(e:any,plat:Dishes) {
      //if (this.ref) {
      this.ref.close("edit");

    }

  async getFile(link:any){
    await this.fileSaverService.getFile(link).then(data=>{
      console.log(data);
      this.pictureClicked.file=data
    })
  }

  showImage(picture:any,e:any){
    this.pictureClicked=picture
    this.model.hide()
    this.model.show(e)
    //this.getFile(picture.link)
  }
}
