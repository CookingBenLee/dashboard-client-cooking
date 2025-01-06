import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Menu } from './Menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(menu:Menu){
    return this.http.post<any>(`${this.env.api}/menu/new`,menu)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.api}/menu/getall`)
        .toPromise()
        .then(res => res.data as Menu[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.api}/menu/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.api}/menu/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Menu[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.api}/menu/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  byName(name:any){
    return this.http.get<any>(`${this.env.api}/menu/loadbyname?name=${name}`)
        .toPromise()
        .then(res => res.data as Menu[])
        .then(data => data);

  }

  byCode(code:any){
    return this.http.get<any>(`${this.env.api}/menu/loadbycode?code=${code}`)
        .toPromise()
        .then(res => res.data as Menu[])
        .then(data => data);

  }

  //update
  update(idmenu:number |undefined, menu:Menu){
    return this.http.put<any>(`${this.env.api}/menu/update/${idmenu}`,menu)
    .toPromise()
    .then()
    .then();
  }




  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.api}/menu/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
