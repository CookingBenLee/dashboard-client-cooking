import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DetailsRecipe } from 'src/app/services/detailsrecipe/DetailsRecipe';
import { DetailsrecipeService } from 'src/app/services/detailsrecipe/detailsrecipe.service';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
import { PreparationRecipeService } from 'src/app/services/preparationRecipe/preparation-recipe.service';
import { PreparationRecipe } from 'src/app/services/preparationRecipe/PreparationRecipe';
import { Recipe } from 'src/app/services/recipe/Recipe';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { TokenService } from 'src/app/services/token/token.service';

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
import { CountryService } from 'src/app/services/country/country.service';
import { PaginatorModule } from 'primeng/paginator';
import { MaterialModule } from 'src/app/material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-preparationrecipe',
  standalone: true,
  imports: [MaterialModule, MatButtonModule, MatDialogModule,CommonModule,ProgressSpinnerModule,
      RouterModule,CalendarModule ,ConfirmDialogModule,InputNumberModule,InputTextareaModule, DialogModule,ToastModule,InputTextModule,
      TableModule,PaginatorModule,DividerModule, TabViewModule,OverlayPanelModule],
      providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './preparationrecipe.component.html',
  styleUrl: './preparationrecipe.component.scss'
})
export class PreparationrecipeComponent {

  @ViewChild('invoice') invoiceElement!: ElementRef;

  recettes:Recipe[]=[]
  detailsDishes:DetailsRecipe[]=[]
  loading=false

  recetteSelectione:Recipe=new Recipe();
  poidNet=1
  poidBrut:number=0
  prix:number=0
  rows=5
  totalRows=0
  page=0;
  count=0;


  totalPages=0
  resClient:any

  generating=false

  loadingPage=false

  ///
  preparationRecipe:PreparationRecipe=new PreparationRecipe()
  loadingPreparation=false

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
    private dialogService:DialogService,private preparationRecipeService:PreparationRecipeService,
    private paginateService:PaginateService,private tokenService: TokenService,
    private recipeService:RecipeService,private detailRecipeService:DetailsrecipeService,
    public tableShort:TableShortService) {}


    async ngOnInit(): Promise<void> {

      this.getAll()
    }

    getAll(){
      this.recipeService.getAll().then(data =>{
        this.recettes=data
      })
    }




     //recuperation de valeurs
  getAllPaginate(){
    const params=this.paginateService.getRequestParams(this.page,this.rows)
    console.log(params);
    const user = this.tokenService.getUser();
    this.recipeService.getAllPage(params, user.id).then(data =>{
      console.log(data)
      //this.menus=data
      console.log(data)
      //this.infos=data
      console.log(data)
      //this.contenus=data

      this.totalPages=data.totalPages
        if(this.recettes.length==0 || this.page==0){
          this.resClient=data
          console.log(this.resClient)
          this.recettes=data.content
          console.log(this.totalPages)
          this.totalRows=data.totalElements
          console.log(this.count)

        }else if((this.resClient.totalElements < data.totalElements)||this.resClient.number != data.number){
          this.resClient.number =data.number
          console.log(data)

          if(data.content.size>0){
            this.recettes.concat(data.content)
          }
          console.log(this.recettes)

        }
    }, () => {
      //console.log(error)
    })
  }


  async getDetailDishes(recette:Recipe){
    await this.detailRecipeService.byRecipe(recette.id).then(data =>{
      console.log(data)
      this.detailsDishes=data
      this.detailsDishes= this.detailsDishes.sort((a, b) => (a.ingredient.name < b.ingredient.name ? -1 : 1));

      this.changePoid()
    })
  }



  async changePlat(){
    console.log("changed---------------------------------");

    console.log(this.recetteSelectione);

    if(this.recetteSelectione==null || this.recetteSelectione.id ==null ){
      this.detailsDishes=[]
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
      this.poidNet= this.recetteSelectione.net
      this.poidBrut=this.poidNet*this.recetteSelectione.ratio
      this.recetteSelectione.brut=this.poidBrut

      await this.getDetailDishes(this.recetteSelectione)
      this.loadingPage=false
    }

  }

  getDetailPercet(detail:DetailsRecipe,recette:Recipe){
    var detailValue=detail.net
    var platValue=recette.net

    var value=(detailValue*100)/platValue

    return value;
  }


  async changePoid(){
    //calcul des poid net des details
    await this.calculDetailNet()
    await this.calculDetailBrut()
    //await this.calculDetailCout()
    await this.calculDetailCout()
    //await this.calculDishesCout()
    await this.changeDetailInfos()
  }

  async calculDetailNet(){
    await this.detailsDishes.forEach(detail=>{
      //detail.floatingNet=(detail.net*this.poidNet)/this.recetteSelectione.net
      if(detail.proportion==null){
        this.messageService.add({key:'tc', severity: 'info', summary: 'Info', detail: `L'ingrédient '${detail.ingredient.name}' n'a pas de proportion spécifié.` });
      }
      detail.net=(this.recetteSelectione.brut*(detail.proportion))/100
    })
  }

  async calculDetailBrut(){
    await this.detailsDishes.forEach(detail=>{
      var perte=detail.ingredient.lossPercentage

      if (perte!=null) {
        console.log(perte);

        //detail.floatingBrut=detail.floatingNet/(1-(perte/100))
        detail.brut=detail.net/(1-perte)

      }
    })
  }

  async calculDetailCout(){
    await this.detailsDishes.forEach(detail=>{
      var price=detail.ingredient.price
      if (price!=null) {
        //detail.floatingCout=detail.floatingBrut*price
        detail.cout=detail.brut*price
      }
    })
  }

  async changeDetailInfos(){
    this.poidBrut=0
    this.prix=0
    this.recetteSelectione.cout=0

    // this.detailsDishes.forEach(detail=>{
    //   this.poidBrut+=detail.floatingBrut
    // })

    // this.detailsDishes.forEach(detail=>{
    //   this.poidBrut+=detail.floatingBrut
    // })

    await this.detailsDishes.forEach(detail=>{
      //this.prix+=detail.floatingCout
      this.recetteSelectione.cout+=detail.cout
    })
  }



  // public async generate(): Promise<void> {



  //   var nom=this.recetteSelectione.name+'.pdf';
  //   // await pdfMake.createPdf(documentDefinition).download(nom);




  //   this.generating=true
  //   let DATA: any = await document.getElementById('invoice');
  //   this.generating=false
  //   html2canvas(DATA).then((canvas) => {
  //     let fileWidth = 210;
  //     let fileHeight = (canvas.height * fileWidth) / canvas.width;
  //     const FILEURI = canvas.toDataURL('image/png');
  //     let PDF = new jsPDF('portrait', 'mm', 'a4',true);
  //     let position = 0;
  //     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
  //     PDF.save(nom);
  //   });
  // }


  public async generate(): Promise<void> {


  //   html2canvas(DATA).then((canvas) => {
  //     let fileWidth = 210;
  //     let fileHeight = (canvas.height * fileWidth) / canvas.width;
  //     const FILEURI = canvas.toDataURL('image/png');
  //     let PDF = new jsPDF('portrait', 'mm', 'a4',true);
  //     let position = 0;
  //     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
  //     PDF.save(nom);
  //   });

    // try{
    //   this.loadingPage=true
    //   this.generating = true;
    //   var div= await <HTMLDivElement>document.querySelector(".genarating")
    //   await div.classList.remove("d-none")

    //   var nom = this.recetteSelectione.name + '.pdf';


    //   // Supposons que votre élément #invoice est le conteneur principal à convertir en PDF
    //   let DATA: any = await document.getElementById('invoice');

    //   html2canvas(DATA).then((canvas) => {
    //     let fileWidth = 210;
    //     //let pageHeight = 297; // A4 dimensions
    //     let pageHeight = fileWidth * 1.414; // Aspect ratio of A4
    //     //let pageHeight = (canvas.height * pdfWidth) / canvas.width;

    //     let fileHeight = (canvas.height * fileWidth) / canvas.width;
    //   const FILEURI = canvas.toDataURL('image/png');
    //   let PDF = new jsPDF('portrait', 'mm', 'a4',true);
    //   let position = 0;
    //   PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
    //   PDF.save(nom);

    //     this.loadingPage=false
    //     this.generating = false;
    //     div.classList.add("d-none")

    //   },(error: any)=>{
    //     this.generating = false;
    //     div.classList.add("d-none")
    //     this.loadingPage=false
    //     this.messageService.add({key:'tc', severity: 'error', summary: 'Info', detail: `Erreur lors de la géneration du fichier.` });
    //   });
    // }catch(e){
    //   this.loadingPage=false
    //   this.messageService.add({key:'tc', severity: 'error', summary: 'Info', detail: `Erreur lors de la géneration du fichier.` });

    // }

  }



  async changeGenaratingValue(){
    this.generating=!this.generating
  }


  savePreparation(){

    this.loadingPreparation=true
    this.loadingPage=true

    //
    this.preparationRecipe.recipe=this.recetteSelectione;
    this.preparationRecipe.poidsNet=this.recetteSelectione.net

    this.preparationRecipeService.create(this.preparationRecipe).then(data=>{
      console.log(data);
      this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: "Preparation enregistrée !"});

      this.recetteSelectione=new Recipe()
      this.detailsDishes=[]

      this.loadingPreparation=false
      this.loadingPage=false


    }).catch(error=>{
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la sauvegarde.' });

    })

  }
}
