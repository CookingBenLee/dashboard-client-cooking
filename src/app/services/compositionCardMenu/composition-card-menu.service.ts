import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { CompositionCardMenu } from './CompositionCardMenu';

@Injectable({
  providedIn: 'root'
})
export class CompositionCardMenuService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(compositionCardMenu:CompositionCardMenu){
    return this.http.post<any>(`${this.env.api}/compositioncardmenu/new`,compositionCardMenu)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.api}/compositioncardmenu/getall`)
        .toPromise()
        .then(res => res.data as CompositionCardMenu[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.api}/compositioncardmenu/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  byMenu(id:number |undefined) {
    return this.http.get<any>(`${this.env.api}/compositioncardmenu/bymenu?idMenu=${id}`)
        .toPromise()
        .then(res => res.data as CompositionCardMenu[])
        .then(data => data);
  }

  byCardMenu(id:number |undefined) {
    return this.http.get<any>(`${this.env.api}/compositioncardmenu/bycardmenu?idCardMenu=${id}`)
        .toPromise()
        .then(res => res.data as CompositionCardMenu[])
        .then(data => data);
  }


  //update
  update(idcompositionCardMenu:number |undefined, compositionCardMenu:CompositionCardMenu){
    return this.http.put<any>(`${this.env.api}/compositioncardmenu/update/${idcompositionCardMenu}`,compositionCardMenu)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.api}/compositioncardmenu/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
