import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { DetailsRecipe } from './DetailsRecipe';

@Injectable({
  providedIn: 'root'
})
export class DetailsrecipeService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(detailrecipe:DetailsRecipe){
    return this.http.post<any>(`${this.env.apiUrl}/detailrecipe/new`,detailrecipe)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/detailrecipe/getall`)
        .toPromise()
        .then(res => res.data as DetailsRecipe[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/detailrecipe/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  byProduct(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/detailrecipe/byproduct?idProduct=${id}`)
        .toPromise()
        .then(res => res.data as DetailsRecipe[])
        .then(data => data);
  }

  byRecipe(id:number |undefined) {
    console.log('🔍 Recherche des ingrédients pour la recette ID:', id);
    
    return this.http.get<any>(`${this.env.apiUrl}/detailrecipe/byrecipe?idRecipe=${id}`)
        .toPromise()
        .then(res => {
          console.log('📊 Réponse du serveur - Nombre d\'ingrédients:', res.data?.length || 0);
          return res.data as DetailsRecipe[];
        })
        .then(data => {
          console.log('✅ Ingrédients récupérés:', data.length);
          return data;
        })
        .catch(error => {
          console.error('❌ Erreur lors de la récupération des ingrédients:', error);
          throw error;
        });
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/detailrecipe/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as DetailsRecipe[])
        .then(data => data);
  }

  //update
  update(iddetailrecipe:number |undefined, detailrecipe:DetailsRecipe){
    return this.http.put<any>(`${this.env.apiUrl}/detailrecipe/update/${iddetailrecipe}`,detailrecipe)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/detailrecipe/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
