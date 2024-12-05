import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Shop } from './Shop';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(shop:Shop){
    return this.http.post<any>(`${this.env.api}/shop/new`,shop)
    .toPromise()
    .then()
    .then();
  }
  //read

  getById(id:any | undefined){
    return this.http.get<any>(`${this.env.api}/shop/load/${id}`)
        .toPromise()
        .then(res => res.data as Shop)
        .then(data => data);
  }
  getAll() {
    return this.http.get<any>(`${this.env.api}/shop/getall`)
        .toPromise()
        .then(res => res.data as Shop[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.api}/shop/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  getActive() {
    return this.http.get<any>(`${this.env.api}/shop/getactive`)
        .toPromise()
        .then(res => res.data as Shop[])
        .then(data => data);
  }
  getActivePage(param:any) {
    return this.http.get<any>(`${this.env.api}/shop/getactivepage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.api}/shop/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Shop[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.api}/shop/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //update
  update(idshop:number |undefined, shop:Shop){
    return this.http.put<any>(`${this.env.api}/shop/update/${idshop}`,shop)
    .toPromise()
    .then()
    .then();
  }

  changeState(idshop:number |undefined){
    return this.http.post<any>(`${this.env.api}/shop/changestate/${idshop}`,null)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.api}/shop/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
