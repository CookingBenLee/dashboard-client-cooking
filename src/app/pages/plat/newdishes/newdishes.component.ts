import { Component } from '@angular/core';
import { ChangeDetectorRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { CategoryDishes } from 'src/app/services/categorydishes/CategoryDishes';
import { CategoryrecipeService } from 'src/app/services/categoryrecipe/categoryrecipe.service';
import { CategoryMenuService } from 'src/app/services/categotyMenu/category-menu.service';
import { CompositionDishes } from 'src/app/services/compositiondishes/CompositionDishes';
import { CompositiondishesService } from 'src/app/services/compositiondishes/compositiondishes.service';
import { DetailsrecipeService } from 'src/app/services/detailsrecipe/detailsrecipe.service';
import { Dishes } from 'src/app/services/dishes/Dishes';
import { DishesPriceService } from 'src/app/services/dishes/dishes-price.service';
import { DishesService } from 'src/app/services/dishes/dishes.service';
import { FileSaverService } from 'src/app/services/fileSaver/file-saver.service';
import { PicturesDishes } from 'src/app/services/picturedishes/PicturesDishes';
import { PictiuredishesService } from 'src/app/services/picturedishes/pictiuredishes.service';
import { Recipe } from 'src/app/services/recipe/Recipe';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
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
  selector: 'app-newdishes',
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
  templateUrl: './newdishes.component.html',
  styleUrl: './newdishes.component.scss'
})
export class NewdishesComponent implements OnInit{
  loadingPage=false
  plat:Dishes=new Dishes()
  categoryDishes:CategoryDishes[]=[]
  recettes:Recipe[]=[]

  positionModalConfirm:any

  picturesDishes:PicturesDishes[]=[]

  ////
  recetteSelectione:Recipe=new Recipe()
  detailsRecepeSelectione:any[]=[]
  quantite:number=0
  units=["Gramme"]
  unitSelectionne:any
  ///
  picture:PicturesDishes=new PicturesDishes()
  fileBase64:any=null
  file=null

  loading=false
  loadingSave=false
  visibleImdDialog=false
  compositionDishes:CompositionDishes[]=[]
  @ViewChild('op', {static: false}) model:OverlayPanel;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  loadingLine=false
  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,private fileSaverService:FileSaverService,private priceDishesService:DishesPriceService,
    private dialogService:DialogService,private pictureDishesService:PictiuredishesService,private dishesService:DishesService,private categoryMenuService:CategoryMenuService,
    private recipeService:RecipeService,private detailRecipeService:DetailsrecipeService,private categoryRecipeService:CategoryrecipeService,
    private tokenService: TokenService,
    public tableShort:TableShortService,private compositionDishesService:CompositiondishesService) {}

    utilisateurC:any;
    usercurrency:any;
  ngOnInit(): void {
    this.utilisateurC = this.tokenService.getUser();
    this.usercurrency = this.utilisateurC.compteUser.address.country.currency.symbol
    this.getRecipes();
    this.getCategoriesDishes();
    this.unitSelectionne = this.units[0];
  }


  getRecipes(){
      const user = this.tokenService.getUser();
      this.recipeService.getAllUser(user.id).then(data=>{
        this.recettes=data
      })
  }

  getCategoriesDishes(){
    this.categoryMenuService.getAllCategorys().then(data=>{
      this.categoryDishes=data
    })
  }




  save(){
    this.loadingSave=true
    var okay=false
    //save dishes
    const user = this.tokenService.getUser();
    this.plat.user = {id: user.id}
    this.dishesService.create(this.plat).then(async data=>{
      await new Promise(resolve=>{this.messageService.add({ severity: 'success', summary: 'Plat', detail: 'Plat Crée' });setTimeout(resolve, 500);})
      await new Promise(resolve=>{this.messageService.add({ severity: 'info', summary: 'Info...', detail: 'Ajout des compositions et images du plat...' });setTimeout(resolve, 500);})
      console.log(data.data);
      var plat=data.data;
    //saves composition
      await this.saveCompositions(plat)
    //save image
      await this.saveImages(plat)
      okay=true


    },async error=>{
      console.log(error);
      await new Promise(resolve=>{this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la création du plat' });setTimeout(resolve, 500);})

    }).finally(()=>{
      this.loadingSave=false
      if(okay) {this.parentFun.emit(),this.compositionDishes=[],this.picturesDishes=[],this.plat=new Dishes()}

    })

  }

  saveCompositions(plat:Dishes){
    this.compositionDishes.forEach(cp=>{
      cp.dishe=plat
      cp.quantity=cp.quantity
      this.compositionDishesService.create(cp).then(async data=>{
        console.log(data);
        await new Promise(resolve=>{ this.messageService.add({ severity: 'success', summary: 'Composition', detail: 'Composition '+cp.recipe.name+' Ajoutée' });setTimeout(resolve, 500);})
      },async error=>{
        await new Promise(resolve=>{this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'ajout de la composition' });setTimeout(resolve, 500);})
      })
    })
  }

  async saveImages(plat:Dishes){
   for( const pic of this.picturesDishes){
      pic.refdishe=plat
      ///save file before object
      var imgOk=false
      var fileName=""
      const data = await this.fileSaverService.create(pic.file,pic.label).then(async (data:any)=>{
        console.log(data);
        imgOk=true
        fileName=data.data
      },(error:any)=>{
        console.log(error);
      }).finally(() => {
        // Code to execute regardless of success or failure
        if(imgOk){

           //if success save object
            //
            pic.link=fileName
            this.pictureDishesService.create(pic).then(async data=>{
              console.log(data);
              await new Promise(resolve=>{this.messageService.add({ severity: 'success', summary: 'Image', detail: 'Image '+pic.label+' Ajoutée' });setTimeout(resolve, 500);})
            },async error=>{
              await new Promise(resolve=>{this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'ajout de l\'image...' });setTimeout(resolve, 500);})
            })
        }
      });

    }
  }

  async addNewComposition(){
    var cp:CompositionDishes=new CompositionDishes()
    this.loadingLine=true
    cp.quantity=this.recetteSelectione.net
    if(this.unitSelectionne==this.units[1]){//KilogrammeGramme
      console.log(this.recetteSelectione);
      this.recetteSelectione.net=this.recetteSelectione.net*1000
    }

    // await this.changePoid()
    // await this.calculPlat()

    this.recetteSelectione=await this.priceDishesService.getDetailRecipeWithRecipeInfos(this.recetteSelectione)
    this.loadingLine=false
    cp.recipe=this.recetteSelectione
    cp.cout=this.recetteSelectione.cout
    console.log("--------------------------------{}",cp);


    await this.compositionDishes.push(cp)
    console.log(this.compositionDishes);
    
    this.recetteSelectione=new Recipe()
    this.calculPlat()
  }


  confirmDeleteComposition(composition:CompositionDishes,i:number){
    console.log(i);

    this.confirmationService.confirm({
      message: 'Veuillez confirmer la suppresion de  '+composition?.recipe?.name,
      header: 'Comfirm delete',
      icon: 'pi pi-info-circle',
      accept: async () => {
        //this.purchaseService.delete(purchase.id).then(data=>{this.getAll()})
        console.log(this.compositionDishes);

        this.compositionDishes = this.compositionDishes.filter((item: any) => item !== composition)
        this.messageService.add({ severity: 'success', summary: 'Confirm', detail: 'Composition de plat supprimé' });
        console.log(this.compositionDishes);
        this.calculPlat()

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

  confirmDeletePicture(picture:PicturesDishes,i:number){
    console.log(i);
    this.confirmationService.confirm({
      message: 'Veuillez confirmer la suppresion de  '+picture?.label,
      header: 'Comfirm delete',
      icon: 'pi pi-info-circle',
      accept: async () => {
        //this.purchaseService.delete(purchase.id).then(data=>{this.getAll()})
        console.log(this.compositionDishes);

        this.picturesDishes = this.picturesDishes.filter((item: any) => item !== picture)
        this.messageService.add({ severity: 'success', summary: 'Confirm', detail: 'Immage de plat supprimé' });
        console.log(this.picturesDishes);
        this.calculPlat()
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



  ///calcul des infos de la recette selectionnee
  async changeRecette(){
    console.log("changed---------------------------------");

    console.log(this.recetteSelectione);

    if(this.recetteSelectione==null || this.recetteSelectione.id ==null ){
      this.detailsRecepeSelectione=[]
      this.recetteSelectione=new Recipe()
      console.log("Pas de brut");
      //this.loadingPage=true
      this.messageService.add({key:'tc', severity: 'info', summary: 'Info', detail: "Veuillez sélectionné un plat " });
      //this.loadingPage=false
    }else{
      this.loadingPage=true
      if(this.recetteSelectione.net==null) this.recetteSelectione.net=1
      //
      if(this.recetteSelectione.ratio==null){
        this.messageService.add({key:'tc', severity: 'info', summary: 'Info', detail: "Le plat sélectionné n'a pas de ratio spécifié, impossible d'effectuer les calculs." });

      }
      // this.poidNet= this.recetteSelectione.net
      //this.poidBrut=this.poidNet*this.recetteSelectione.ratio
      //this.recetteSelectione.brut=this.poidBrut


      await this.getDetailRecipe(this.recetteSelectione)
      this.loadingPage=false
    }
  }



  async getDetailRecipe(recette:Recipe){
    await this.detailRecipeService.byRecipe(recette.id).then(data =>{
      console.log(data)
      this.detailsRecepeSelectione=data
      this.detailsRecepeSelectione= this.detailsRecepeSelectione.sort((a, b) => (a.ingredient.name < b.ingredient.name ? -1 : 1));

      this.changePoid()
    })
  }


  async changePoid(){
    var net=this.recetteSelectione.net
    //if(this.unitSelectionne==this.units[]) net=this.recetteSelectione.net/1000
    this.recetteSelectione.brut=net*this.recetteSelectione.ratio

    //calcul des poid net des details
    await this.calculDetailNet()
    await this.calculDetailBrut()
    //await this.calculDetailCout()
    await this.calculDetailCout()
    //await this.calculDishesCout()
    await this.changeDetailInfos()
  }

  changeUnit(){

  }

  async calculDetailNet(){
    await this.detailsRecepeSelectione.forEach(detail=>{
      //detail.floatingNet=(detail.net*this.poidNet)/this.recetteSelectione.net
      if(detail.proportion==null){
        this.messageService.add({key:'tc', severity: 'info', summary: 'Info', detail: `L'ingrédient '${detail.ingredient.name}' n'a pas de proportion spécifié.` });
      }
      detail.net=(this.recetteSelectione.brut*(detail.proportion))/100
    })
  }

  async calculDetailBrut(){
    await this.detailsRecepeSelectione.forEach(detail=>{
      var perte=detail.ingredient.lossPercentage

      if (perte!=null) {
        console.log(perte);

        //detail.floatingBrut=detail.floatingNet/(1-(perte/100))
        detail.brut=detail.net/(1-perte)

      }
    })
  }

  async calculDetailCout(){
    await this.detailsRecepeSelectione.forEach(detail=>{
      var price=detail.ingredient.price
      if (price!=null) {
        //detail.floatingCout=detail.floatingBrut*price
        detail.cout=detail.brut*price
      }
    })
  }

  async changeDetailInfos(){
    this.recetteSelectione.brut=0
    //this.prix=0
    this.recetteSelectione.cout=0
    await this.detailsRecepeSelectione.forEach(detail=>{
      //this.prix+=detail.floatingCout
      this.recetteSelectione.cout+=detail.cout
    })
    console.log(this.recetteSelectione);
  }
  //////recette infos

  //calcul total infos pour le plat
  calculPlat(){
    this.plat.poids=0
    this.plat.cout=0
    this.compositionDishes.forEach(cp=>{
      this.plat.poids+=cp.quantity
      this.plat.cout+=cp.cout
    })
  }



  ///select file

  clickFileSelector(){
    var divinput=<HTMLImageElement>document.getElementById("image")
    divinput.click()
  }
  fileSelecter(e:any):any{
    var taille=e.target.files[0].size
    console.log(taille);


    if(taille>(10*1000000)){
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Fichier trop voluminé' });
      e.target.value = '';
      taille=0
    //this.fichier=e.target['files'][0];
    }else{
      taille=0
      //this.selectedImage=false
      //verification si une photo a été choisie ou pas
      if(!e.target.files[0] || e.target.files[0].length==0){
        // this.message="Vous devez choisir une image !";
        // this.erreur=true;
        console.log('hello111')
        this.fileBase64=null
        this.file=null
        return null;
      }
      console.log('hello2')

      if(e.target.files){
        var reader= new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload=(event:any)=>{

          //this.selectedImage=true
          console.log('hello')
          this.file=e.target.files[0]
          this.fileBase64=event.target.result;
          //this.openToggleImage(event)
          this.visibleImdDialog=true
          console.log(e.target.files[0].size)
        }
      }
    }
    //this.selectedImage=true
  }

  ///gestion image
  async addNewImage(){
    //this.clickFileSelector()
    this.picture.file=this.file
    this.picture.filebase64=this.fileBase64
    await this.picturesDishes.push(this.picture)
    this.picture=new PicturesDishes()
    //this.model.hide()
    this.visibleImdDialog=false
    this.file=null
    this.fileBase64=null

  }
  cancelAddImage(){
    this.picture=new PicturesDishes()
    //this.model.hide()
    this.visibleImdDialog=false
    this.file=null
    this.fileBase64=null
  }


  openToggleImage(e:any){
    this.model.toggle(e);
  }
}
