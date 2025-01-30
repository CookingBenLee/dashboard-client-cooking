import { Injectable } from '@angular/core';
import { PreparationRecipe } from './PreparationRecipe';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PreparationRecipeService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(preparation_recipe:PreparationRecipe){
    return this.http.post<any>(`${this.env.api}/preparation_recipe/new`,preparation_recipe)
    .toPromise()
    .then()
    .then();
  }
  //read

  getById(id:any | undefined){
    return this.http.get<any>(`${this.env.api}/preparation_recipe/load/${id}`)
        .toPromise()
        .then(res => res.data as PreparationRecipe)
        .then(data => data);
  }
  getAll() {
    return this.http.get<any>(`${this.env.api}/preparation_recipe/getall`)
        .toPromise()
        .then(res => res.data as PreparationRecipe[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.api}/preparation_recipe/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  byrecipe(id:number |undefined) {
    return this.http.get<any>(`${this.env.api}/preparation_recipe/byrecipe?idRecipe=${id}`)
        .toPromise()
        .then(res => res.data as PreparationRecipe[])
        .then(data => data);
  }



  //update
  update(idpreparation_recipe:number |undefined, preparation_recipe:PreparationRecipe){
    return this.http.put<any>(`${this.env.api}/preparation_recipe/update/${idpreparation_recipe}`,preparation_recipe)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.api}/preparation_recipe/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
