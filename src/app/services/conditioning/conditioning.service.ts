import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Conditioning } from './Conditioning';

@Injectable({
  providedIn: 'root'
})
export class ConditioningService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  createConditioning(conditioning:Conditioning){
    console.log(conditioning);
    console.log(`${this.env.apiUrl}/conditioning/new`,conditioning);

    return this.http.post<any>(`${this.env.apiUrl}/conditioning/new`,conditioning)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAllConditionings() {
    return this.http.get<any>(`${this.env.apiUrl}/conditioning/getall`)
        .toPromise()
        .then(res => res.data as Conditioning[])
        .then(data => data);
  }
  getAllConditioningsPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/conditioning/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/conditioning/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Conditioning[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/conditioning/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //update
  updateConditioning(idconditioning:number |undefined, conditioning:Conditioning){
    return this.http.put<any>(`${this.env.apiUrl}/conditioning/update/${idconditioning}`,conditioning)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  deleteConditioning(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/conditioning/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
