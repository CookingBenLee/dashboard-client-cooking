import { Injectable } from '@angular/core';
import { SimulationEmploye } from './simulation-employe';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SimulationEmployeService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(simulationEmploye:SimulationEmploye){
    return this.http.post<any>(`${this.env.apiUrl}/simulation-employe/new`,simulationEmploye)
    .toPromise()
    .then()
    .then();
  }
  //read

  getById(id:any | undefined){
    return this.http.get<any>(`${this.env.apiUrl}/simulation-employe/load/${id}`)
        .toPromise()
        .then(res => res.data as SimulationEmploye)
        .then(data => data);
  }
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/simulation-employe/getall`)
        .toPromise()
        .then(res => res.data as SimulationEmploye[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation-employe/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  bySimulation(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation-employe/getbysimulationid?id=${id}`)
        .toPromise()
        .then(res => res.data as SimulationEmploye[])
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation-employe/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as SimulationEmploye[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation-employe/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //update
  update(idsimulationEmploye:number |undefined, simulationEmploye:SimulationEmploye){
    return this.http.put<any>(`${this.env.apiUrl}/simulation-employe/update/${idsimulationEmploye}`,simulationEmploye)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/simulation-employe/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }

}
