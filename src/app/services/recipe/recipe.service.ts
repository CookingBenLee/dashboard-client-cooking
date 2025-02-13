import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Recipe } from './Recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(recipe:Recipe){
    return this.http.post<any>(`${this.env.apiUrl}/recipe/new`,recipe)
    .toPromise()
    .then()
    .then();
  }
  //read

  getById(id:any | undefined){
    return this.http.get<any>(`${this.env.apiUrl}/recipe/load/${id}`)
        .toPromise()
        .then(res => res.data as Recipe)
        .then(data => data);
  }
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/recipe/getall`)
        .toPromise()
        .then(res => res.data as Recipe[])
        .then(data => data);
  }
  getAllPage(param:any,id:number) {
    return this.http.get<any>(`${this.env.apiUrl}/recipe/getallpagebyuser/${id}?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  getAllUser(id:number) {
    return this.http.get<any>(`${this.env.apiUrl}/recipe/getallbyuser/${id}`)
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  bycategory(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/recipe/bycategory?idCategory=${id}`)
        .toPromise()
        .then(res => res.data as Recipe[])
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/recipe/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Recipe[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/recipe/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }


  //update
  update(idrecipe:number |undefined, recipe:Recipe){
    return this.http.put<any>(`${this.env.apiUrl}/recipe/update/${idrecipe}`,recipe)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/recipe/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
