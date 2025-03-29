import { Injectable } from '@angular/core';
import { Dishes } from './Dishes';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Recipe } from '../recipe/Recipe';
import { DishesService } from './dishes.service';
import { DetailsrecipeService } from '../detailsrecipe/detailsrecipe.service';
import { DetailsRecipe } from '../detailsrecipe/DetailsRecipe';
import { CompositionDishes } from '../compositiondishes/CompositionDishes';
import { CompositiondishesService } from '../compositiondishes/compositiondishes.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DishesPriceService {

  private env=environment;
  constructor(private http: HttpClient,private detailRecipeService:DetailsrecipeService,
    private compoDishesService:CompositiondishesService,
    private dishesService:DishesService) { }


  async getDishesPrice(plat:Dishes):Promise<Dishes>{//en kilogramme


    var compoDishes:CompositionDishes[]=[]
    await this.compoDishesService.byDishes(plat.id).then(data =>{
      console.log(data)
      compoDishes=data
      compoDishes= compoDishes.sort((a, b) => (a.dishe.name < b.dishe.name ? -1 : 1));

    }).finally(async ()=>{
      plat.cout=0
      compoDishes.forEach(async detail=>{
        detail.recipe.net=detail.quantity
        detail.recipe=await this.getDetailRecipeWithRecipeInfos(detail.recipe)
        plat.cout+=detail.recipe.cout
        console.log(detail);

      })
      plat.compositionList=compoDishes
    })

    return plat;
  }


  async getDetailRecipeWithRecipeInfos(recette:Recipe):Promise<Recipe>{
    //calcul du brut
    if(recette.net==null || recette.net==0 || !recette.net) recette.net=1
    recette.brut=(recette.net/1000)*recette.ratio

    //
    var detailsRecepe:DetailsRecipe[]=[]

    await this.detailRecipeService.byRecipe(recette.id).then(data =>{
      console.log(data)
      detailsRecepe=data
      detailsRecepe= detailsRecepe.sort((a, b) => (a.ingredient.name < b.ingredient.name ? -1 : 1));


    }).finally(async ()=>{
      //update detail net
      await detailsRecepe.forEach(detail=>{
        if(detail.proportion!=null) detail.net=(recette.brut*(detail.proportion))/100
      })

      //update detail brut
      await detailsRecepe.forEach(detail=>{
        var perte=detail.ingredient.lossPercentage
        //if (perte!=null)  detail.brut=detail.net/(1-(perte/100))
        if (perte!=null)  detail.brut=detail.net/(1-(perte))

      })

      //update detail cout
      await detailsRecepe.forEach(detail=>{
        var price=detail.ingredient.price
        if (price!=null)  detail.cout=detail.brut*price
      })

      //update recipe infos
      recette.cout=0
      await detailsRecepe.forEach(detail=>{
        recette.cout+=detail.cout
      })

      recette.detailList=detailsRecepe;
    })

    return recette;
  }




}
