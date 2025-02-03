import { Injectable } from '@angular/core';
import { Unit } from './Unit';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  createunit(unit:Unit){
    return this.http.post<any>(`${this.env.apiUrl}/unit/new`,unit)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAllUnits() {
    return this.http.get<any>(`${this.env.apiUrl}/unit/getall`)
        .toPromise()
        .then(res => res.data as Unit[])
        .then(data => data);
  }


  getAllUnitsProducts() {
    return this.http.get<any>(`${this.env.apiUrl}unit/getforproduct`)
        .toPromise()
        .then(res => res.data as Unit[])
        .then(data => data);
  }


  getAllUnitsPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/unit/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/unit/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Unit[])
        .then(data => data);
  }


  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/unit/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //update
  updateunit(idunit:number |undefined, unit:Unit){
    return this.http.put<any>(`${this.env.apiUrl}/unit/update/${idunit}`,unit)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  deleteUnit(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/unit/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}

