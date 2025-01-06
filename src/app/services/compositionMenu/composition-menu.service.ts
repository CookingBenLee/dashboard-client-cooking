import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { CompositionMenu } from './CompositionMenu';

@Injectable({
  providedIn: 'root'
})
export class CompositionMenuService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(compositionMenu:CompositionMenu){
    return this.http.post<any>(`${this.env.api}/compositionmenu/new`,compositionMenu)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.api}/compositionmenu/getall`)
        .toPromise()
        .then(res => res.data as CompositionMenu[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.api}/compositionmenu/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  byMenu(id:number |undefined) {
    return this.http.get<any>(`${this.env.api}/compositionmenu/bymenu?idMenu=${id}`)
        .toPromise()
        .then(res => res.data as CompositionMenu[])
        .then(data => data);
  }

  byDishes(id:number |undefined) {
    return this.http.get<any>(`${this.env.api}/compositionmenu/bydishes?idDishes=${id}`)
        .toPromise()
        .then(res => res.data as CompositionMenu[])
        .then(data => data);
  }

  byCategory(id:number |undefined) {
    return this.http.get<any>(`${this.env.api}/compositionmenu/bycategory?idCategory=${id}`)
        .toPromise()
        .then(res => res.data as CompositionMenu[])
        .then(data => data);
  }

  byMenuAndCategory(idMenu:number |undefined,idCategory:number |undefined) {
    return this.http.get<any>(`${this.env.api}/compositionmenu/bymenucategory?idCategory=${idCategory}&idMenu=${idMenu}`)
        .toPromise()
        .then(res => res.data as CompositionMenu[])
        .then(data => data);
  }


  //update
  update(idcompositionMenu:number |undefined, compositionMenu:CompositionMenu){
    return this.http.put<any>(`${this.env.api}/compositionmenu/update/${idcompositionMenu}`,compositionMenu)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.api}/compositionmenu/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}

