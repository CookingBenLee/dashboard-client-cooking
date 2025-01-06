import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { DetailDishes } from '../detaildishes/DetailDishes';

@Injectable({
  providedIn: 'root'
})
export class DetaildishesService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(detailsdishes:DetailDishes){
    return this.http.post<any>(`${this.env.apiUrl}/detailsdishes/new`,detailsdishes)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/detailsdishes/getall`)
        .toPromise()
        .then(res => res.data as DetailDishes[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/detailsdishes/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  byProduct(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/detailsdishes/byproduct?idProduct=${id}`)
        .toPromise()
        .then(res => res.data as DetailDishes[])
        .then(data => data);
  }

  byDishes(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/detailsdishes/bydishes?idDishes=${id}`)
        .toPromise()
        .then(res => res.data as DetailDishes[])
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/detailsdishes/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as DetailDishes[])
        .then(data => data);
  }

  //update
  update(iddetailsdishes:number |undefined, detailsdishes:DetailDishes){
    return this.http.put<any>(`${this.env.apiUrl}/detailsdishes/update/${iddetailsdishes}`,detailsdishes)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/detailsdishes/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
