import { Injectable } from '@angular/core';
import { DetailsPurchasing } from './DetailsPurchasing';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DetailspurchasingService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(detailspurchase:DetailsPurchasing){
    return this.http.post<any>(`${this.env.apiUrl}/detailspurchase/new`,detailspurchase)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/detailspurchase/getall`)
        .toPromise()
        .then(res => res.data as DetailsPurchasing[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/detailspurchase/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  byProduct(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/detailspurchase/byproduct?idProduct=${id}`)
        .toPromise()
        .then(res => res.data as DetailsPurchasing[])
        .then(data => data);
  }

  byPurchase(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/detailspurchase/bypurchase?idPurchase=${id}`)
        .toPromise()
        .then(res => res.data as DetailsPurchasing[])
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/detailspurchase/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as DetailsPurchasing[])
        .then(data => data);
  }

  //update
  update(iddetailspurchase:number |undefined, detailspurchase:DetailsPurchasing){
    return this.http.put<any>(`${this.env.apiUrl}/detailspurchase/update/${iddetailspurchase}`,detailspurchase)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/detailspurchase/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
