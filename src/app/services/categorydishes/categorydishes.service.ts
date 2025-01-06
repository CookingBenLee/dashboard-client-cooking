import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CategoryDishes } from './CategoryDishes';

@Injectable({
  providedIn: 'root'
})
export class CategorydishesService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  createCategory(category:CategoryDishes){
    return this.http.post<any>(`${this.env.apiUrl}/categorydishes/new`,category)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAllCategorys() {
    return this.http.get<any>(`${this.env.apiUrl}/categorydishes/getall`)
        .toPromise()
        .then(res => res.data as CategoryDishes[])
        .then(data => data);
  }
  getAllCategorysPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/categorydishes/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/categorydishes/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as CategoryDishes[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/categorydishes/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }


  //update
  updateCategory(idcategory:number |undefined, category:CategoryDishes){
    return this.http.put<any>(`${this.env.apiUrl}/categorydishes/update/${idcategory}`,category)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  deleteCategory(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/categorydishes/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
