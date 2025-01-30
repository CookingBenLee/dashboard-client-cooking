import { Injectable } from '@angular/core';
import { CategoryMenu } from './CategoryMenu';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CategoryMenuService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  createCategory(category:CategoryMenu){
    return this.http.post<any>(`${this.env.apiUrl}/categorymenu/new`,category)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAllCategorys() {
    return this.http.get<any>(`${this.env.apiUrl}/categorymenu/getall`)
        .toPromise()
        .then(res => res.data as CategoryMenu[])
        .then(data => data);
  }
  getAllCategorysPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/categorymenu/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/categorymenu/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as CategoryMenu[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/categorymenu/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }


  //update
  updateCategory(idcategory:number |undefined, category:CategoryMenu){
    return this.http.put<any>(`${this.env.apiUrl}/categorymenu/update/${idcategory}`,category)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  deleteCategory(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/categorymenu/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}

