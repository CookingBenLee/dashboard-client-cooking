import { Injectable } from '@angular/core';
import { CategoryOperation } from './category-operation';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ECategoryOperation } from './ECategoryOperation';

@Injectable({
  providedIn: 'root'
})
export class CategoryOperationService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  createCategory(categoryOperation:CategoryOperation){
    return this.http.post<any>(`${this.env.apiUrl}/type_operation/new`,categoryOperation)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAllCategory() {
    return this.http.get<any>(`${this.env.apiUrl}/type_operation/getall`)
        .toPromise()
        .then(res => res.data as CategoryOperation[])
        .then(data => data);
  }
  getAllCategorysPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/type_operation/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  byLibelle(libelle:String) {
    return this.http.get<any>(`${this.env.apiUrl}/type_operation/bylibelle?libelle=${libelle}`,)
        .toPromise()
        .then(res => res.data as CategoryOperation[])
        .then(data => data);
  }

  bySens(sens:ECategoryOperation) {
    return this.http.get<any>(`${this.env.apiUrl}/type_operation/bysens?sens=${sens}`,)
        .toPromise()
        .then(res => res.data as CategoryOperation[])
        .then(data => data);
  }

  bySensNotOperation(sens:ECategoryOperation) {
    return this.http.get<any>(`${this.env.apiUrl}/type_operation/bysensnotoperation?sens=${sens}`,)
        .toPromise()
        .then(res => res.data as CategoryOperation[])
        .then(data => data);
  }

  byOperation(b:Boolean) {
    return this.http.get<any>(`${this.env.apiUrl}/type_operation/byisemploye?isEmploye=${b}`,)
        .toPromise()
        .then(res => res.data as CategoryOperation[])
        .then(data => data);
  }



  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/type_operation/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as CategoryOperation[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/type_operation/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //update
  updateCategory(idcategoryOperation:number |undefined, categoryOperation:CategoryOperation){
    return this.http.put<any>(`${this.env.apiUrl}/type_operation/update/${idcategoryOperation}`,categoryOperation)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  deleteCategory(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/type_operation/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
