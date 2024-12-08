import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Country } from './Country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {


  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(country:Country){
    return this.http.post<any>(`${this.env.apiUrl}/country/new`,country)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/country/getall`)
        .toPromise()
        .then(res => res.data as Country[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/country/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/country/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Country[])
        .then(data => data);
  }


  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/country/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }
  //update
  update(idcountry:number |undefined, country:Country){
    return this.http.put<any>(`${this.env.apiUrl}/country/update/${idcountry}`,country)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/country/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
