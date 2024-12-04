import { Injectable } from '@angular/core';
import { Category } from './Category';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  createCategory(category:Category){
    return this.http.post<any>(`${this.env.apiUrl}/category/new`,category)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAllCategorys() {
    return this.http.get<any>(`${this.env.apiUrl}/category/getall`)
        .toPromise()
        .then(res => res.data as Category[])
        .then(data => data);
  }
  getAllCategorysPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/category/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/category/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Category[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/category/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //update
  updateCategory(idcategory:number |undefined, category:Category){
    return this.http.put<any>(`${this.env.apiUrl}/category/update/${idcategory}`,category)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  deleteCategory(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/category/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
