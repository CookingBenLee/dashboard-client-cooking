import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { PicturesDishes } from './PicturesDishes';

@Injectable({
  providedIn: 'root'
})
export class PictiuredishesService {
  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(picturedishes:PicturesDishes){
    //const params = new HttpParams().append("file", picturedishes.filebase64);
    //,{params}
    return this.http.post<any>(`${this.env.apiUrl}/picturedishes/new`,picturedishes)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/picturedishes/getall`)
        .toPromise()
        .then(res => res.data as PicturesDishes[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/picturedishes/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/picturedishes/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as PicturesDishes[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/picturedishes/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }


  byDishes(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/picturedishes/bydishes?idDishes=${id}`)
        .toPromise()
        .then(res => res.data as PicturesDishes[])
        .then(data => data);
  }


  //update
  update(id:number |undefined, picturedishes:PicturesDishes){
    const params = new HttpParams().append("file", picturedishes.file);
    return this.http.put<any>(`${this.env.apiUrl}/picturedishes/update/${id}`,picturedishes,{params})
    .toPromise()
    .then()
    .then();
  }

  ///delete
  deleteCategory(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/picturedishes/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
