import { Injectable } from '@angular/core';
import { Dishes } from './Dishes';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DishesService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(dishes:Dishes){
    return this.http.post<any>(`${this.env.apiUrl}/dishes/new`,dishes)
    .toPromise()
    .then()
    .then();
  }
  //read

  getById(id:any | undefined){
    return this.http.get<any>(`${this.env.apiUrl}/dishes/load/${id}`)
        .toPromise()
        .then(res => res.data as Dishes)
        .then(data => data);
  }
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/dishes/getall`)
        .toPromise()
        .then(res => res.data as Dishes[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/dishes/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  byShop(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/dishes/byshop?idShop=${id}`)
        .toPromise()
        .then(res => res.data as Dishes[])
        .then(data => data);
  }

  byCategory(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/dishes/bycategory?idCategory=${id}`)
        .toPromise()
        .then(res => res.data as Dishes[])
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/dishes/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Dishes[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/dishes/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }


  //update
  update(iddishes:number |undefined, dishes:Dishes){
    return this.http.put<any>(`${this.env.apiUrl}/dishes/update/${iddishes}`,dishes)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/dishes/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
