import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Price } from './Price';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(price:Price){

    return this.http.post<any>(`${this.env.apiUrl}/price/new`,price)

    .toPromise()
    .then()
    .then();
  }

  loadOrCreate(price:Price){
    return this.http.post<any>(`${this.env.apiUrl}/price/loadorcreate`,price)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/price/getall`)
        .toPromise()
        .then(res => res.data as Price[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/price/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/price/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Price[])
        .then(data => data);
  }


  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/price/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }


  byShop(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/price/byshop/${id}`)
        .toPromise()
        .then(res => res.data as Price[])
        .then(data => data);
  }

  byProduct(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/price/byproduct/${id}`)
        .toPromise()
        .then(res => res.data as Price[])
        .then(data => data);
  }
  byCurrency(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/price/bycurrency/${id}`)
        .toPromise()
        .then(res => res.data as Price[])
        .then(data => data);
  }
  //update
  update(idprice:number |undefined, price:Price){
    return this.http.put<any>(`${this.env.apiUrl}/price/update/${idprice}`,price)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/price/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
