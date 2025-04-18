import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Address } from './Address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(address:Address){
    return this.http.post<any>(`${this.env.apiUrl}/address/new`,address)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/address/getall`)
        .toPromise()
        .then(res => res.data as Address[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/address/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/address/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Address[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/address/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }


  byShop(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/address/byshop/${id}`)
        .toPromise()
        .then(res => res.data as Address[])
        .then(data => data);
  }

  byCountry(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/address/bycountry/${id}`)
        .toPromise()
        .then(res => res.data as Address[])
        .then(data => data);
  }

  //update
  update(idaddress:number |undefined, address:Address){
    return this.http.put<any>(`${this.env.apiUrl}/address/update/${idaddress}`,address)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/address/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}

