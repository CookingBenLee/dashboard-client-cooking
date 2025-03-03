import { Injectable } from '@angular/core';
import { Profil } from './profil';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  
  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(profil:Profil){
    return this.http.post<any>(`${this.env.apiUrl}/profile/new`,profil)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/profile/getallprofile`)
        .toPromise()
        .then(res => res.data as Profil[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/profile/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/profile/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Profil[])
        .then(data => data);
  }


  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/profile/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }
  //update
  update(idprofil:number |undefined, profil:Profil){
    return this.http.put<any>(`${this.env.apiUrl}/profile/update/${idprofil}`,profil)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/profile/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}
