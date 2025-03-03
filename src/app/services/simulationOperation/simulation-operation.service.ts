import { Injectable } from '@angular/core';
import { SimulationOperation } from './simulation-operation';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SimulationOperationService {

  
  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(simulationOperation:SimulationOperation){
    return this.http.post<any>(`${this.env.apiUrl}/simulation-operation/new`,simulationOperation)
    .toPromise()
    .then()
    .then();
  }
  //read

  getById(id:any | undefined){
    return this.http.get<any>(`${this.env.apiUrl}/simulation-operation/load/${id}`)
        .toPromise()
        .then(res => res.data as SimulationOperation)
        .then(data => data);
  }
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/simulation-operation/getall`)
        .toPromise()
        .then(res => res.data as SimulationOperation[])
        .then(data => data);
  }
  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation-operation/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }


  bySimulation(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation-operation/getbysimulationid?id=${id}`)
        .toPromise()
        .then(res => res.data as SimulationOperation[])
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation-operation/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as SimulationOperation[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation-operation/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //update
  update(idsimulationOperation:number |undefined, simulationOperation:SimulationOperation){
    return this.http.put<any>(`${this.env.apiUrl}/simulation-operation/update/${idsimulationOperation}`,simulationOperation)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/simulation-operation/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }

}