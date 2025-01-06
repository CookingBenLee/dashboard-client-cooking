import { Injectable } from '@angular/core';
import { CompositionDishes } from './CompositionDishes';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CompositiondishesService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(compositiondishes:CompositionDishes){
    return this.http.post<any>(`${this.env.apiUrl}/compositiondishes/new`,compositiondishes)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/compositiondishes/getall`)
        .toPromise()
        .then(res => res.data as CompositionDishes[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/compositiondishes/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  byRecipe(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/compositiondishes/byrecipe?idRecipe=${id}`)
        .toPromise()
        .then(res => res.data as CompositionDishes[])
        .then(data => data);
  }

  byDishes(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/compositiondishes/bydishes?idDishes=${id}`)
        .toPromise()
        .then(res => res.data as CompositionDishes[])
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/compositiondishes/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as CompositionDishes[])
        .then(data => data);
  }

  //update
  update(idcompositiondishes:number |undefined, compositiondishes:CompositionDishes){
    return this.http.put<any>(`${this.env.apiUrl}/compositiondishes/update/${idcompositiondishes}`,compositiondishes)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/compositiondishes/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
