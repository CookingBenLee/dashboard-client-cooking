import { Injectable } from '@angular/core';
import { EstimationVente } from './estimation-vente';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EstimationVenteService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(estimationVente:EstimationVente){
    return this.http.post<any>(`${this.env.apiUrl}/estimation-vente/new`,estimationVente)
    .toPromise()
    .then()
    .then();
  }
  //read

  getById(id:any | undefined){
    return this.http.get<any>(`${this.env.apiUrl}/estimation-vente/load/${id}`)
        .toPromise()
        .then(res => res.data as EstimationVente)
        .then(data => data);
  }
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/estimation-vente/getall`)
        .toPromise()
        .then(res => res.data as EstimationVente[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/estimation-vente/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  bySimulation(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/estimation-vente/getbyrefsimulationid?id=${id}`)
        .toPromise()
        .then(res => res.data as EstimationVente[])
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/estimation-vente/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as EstimationVente[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/estimation-vente/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //update
  update(idestimationVente:number |undefined, estimationVente:EstimationVente){
    return this.http.put<any>(`${this.env.apiUrl}/estimation-vente/update/${idestimationVente}`,estimationVente)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/estimation-vente/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }

}
