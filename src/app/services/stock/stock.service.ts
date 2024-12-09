import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Stock } from './Stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(stock:Stock){
    return this.http.post<any>(`${this.env.apiUrl}/stock/new`,stock)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/stock/getall`)
        .toPromise()
        .then(res => res.data as Stock[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/stock/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/stock/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Stock[])
        .then(data => data);
  }

  //update
  update(idstock:number |undefined, stock:Stock){
    return this.http.put<any>(`${this.env.apiUrl}/stock/update/${idstock}`,stock)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/stock/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
