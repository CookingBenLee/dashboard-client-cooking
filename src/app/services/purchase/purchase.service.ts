import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Purchase } from './Purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(purchase:Purchase){
    return this.http.post<any>(`${this.env.api}/purchase/new`,purchase)
    .toPromise()
    .then()
    .then();
  }
  //read

  getById(id:any | undefined){
    return this.http.get<any>(`${this.env.api}/purchase/load/${id}`)
        .toPromise()
        .then(res => res.data as Purchase)
        .then(data => data);
  }
  getAll() {
    return this.http.get<any>(`${this.env.api}/purchase/getall`)
        .toPromise()
        .then(res => res.data as Purchase[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.api}/purchase/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  byShop(id:number |undefined) {
    return this.http.get<any>(`${this.env.api}/purchase/byshop?idShop=${id}`)
        .toPromise()
        .then(res => res.data as Purchase[])
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.api}/purchase/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Purchase[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.api}/purchase/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //update
  update(idpurchase:number |undefined, purchase:Purchase){
    return this.http.put<any>(`${this.env.api}/purchase/update/${idpurchase}`,purchase)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.api}/purchase/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
