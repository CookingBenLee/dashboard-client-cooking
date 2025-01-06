import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { CategoryRecipe } from './CategoryRecipe';

@Injectable({
  providedIn: 'root'
})
export class CategoryrecipeService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  createCategory(category:CategoryRecipe){
    return this.http.post<any>(`${this.env.apiUrl}/categoryrecipe/new`,category)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAllCategorys() {
    return this.http.get<any>(`${this.env.apiUrl}/categoryrecipe/getall`)
        .toPromise()
        .then(res => res.data as CategoryRecipe[])
        .then(data => data);
  }
  getAllCategorysPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/categoryrecipe/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/categoryrecipe/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as CategoryRecipe[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/categoryrecipe/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }


  //update
  updateCategory(idcategory:number |undefined, category:CategoryRecipe){
    return this.http.put<any>(`${this.env.apiUrl}/categoryrecipe/update/${idcategory}`,category)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  deleteCategory(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/categoryrecipe/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
