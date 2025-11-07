import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TypeCompte } from './TypeCompte';

@Injectable({
  providedIn: 'root'
})
export class TypeCompteService {

  private env = environment;
  constructor(private http: HttpClient) { }

  //create
  create(typeCompte: TypeCompte) {
    return this.http.post<any>(`${this.env.apiUrl}/type_compte/new`, typeCompte)
      .toPromise()
      .then()
      .then();
  }

  //read
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/type_compte/getall`)
      .toPromise()
      .then(res => res.data as TypeCompte[])
      .then(data => data);
  }

  getAllPage(param: any) {
    return this.http.get<any>(`${this.env.apiUrl}/type_compte/getallpage?page=` + param['page'] + '&size=' + param['size'])
      .toPromise()
      .then(res => res.data as any)
      .then(data => data);
  }

  recherche(mot: String) {
    return this.http.get<any>(`${this.env.apiUrl}/type_compte/search?mot=${mot}`)
      .toPromise()
      .then(res => res.data as TypeCompte[])
      .then(data => data);
  }

  rechercheParPage(mot: String, param: any) {
    return this.http.get<any>(`${this.env.apiUrl}/type_compte/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
      .toPromise()
      .then(res => res.data as any)
      .then(data => data);
  }

  byLibelle(libelle: String) {
    return this.http.get<any>(`${this.env.apiUrl}/type_compte/bylibelle?libelle=${libelle}`)
      .toPromise()
      .then(res => res.data as TypeCompte)
      .then(data => data);
  }

  //update
  update(idTypeCompte: number | undefined, typeCompte: TypeCompte) {
    return this.http.put<any>(`${this.env.apiUrl}/type_compte/update/${idTypeCompte}`, typeCompte)
      .toPromise()
      .then()
      .then();
  }

  //delete
  delete(id: number | undefined) {
    return this.http.delete<any>(`${this.env.apiUrl}/type_compte/delete/${id}`)
      .toPromise()
      .then()
      .then();
  }
}
