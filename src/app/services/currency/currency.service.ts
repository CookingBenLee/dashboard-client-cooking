import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Currency } from './Currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(currency:Currency){
    return this.http.post<any>(`${this.env.api}/currency/new`,currency)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.api}/currency/getall`)
        .toPromise()
        .then(res => res.data as Currency[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.api}/currency/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.api}/currency/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Currency[])
        .then(data => data);
  }


  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.api}/currency/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //update
  update(idcurrency:number |undefined, currency:Currency){
    return this.http.put<any>(`${this.env.api}/currency/update/${idcurrency}`,currency)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.api}/currency/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
