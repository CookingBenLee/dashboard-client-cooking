import { Injectable } from '@angular/core';
import { Simulation } from './simulation';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(simulation:Simulation){
    return this.http.post<any>(`${this.env.apiUrl}/simulation/new`,simulation)
    .toPromise()
    .then()
    .then();
  }
  //read

  getById(id:any | undefined){
    return this.http.get<any>(`${this.env.apiUrl}/simulation/load/${id}`)
        .toPromise()
        .then(res => res.data as Simulation)
        .then(data => data);
  }
  getAll(idUser:number) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation/getallbyuser/${idUser}`)
        .toPromise()
        .then(res => res.data as Simulation[])
        .then(data => data);
  }
  getAllPage(idUser: number,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation/getallpagebyuser/${idUser}?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  byShop(id:number |undefined) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation/byshop?idShop=${id}`)
        .toPromise()
        .then(res => res.data as Simulation[])
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Simulation[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/simulation/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //update
  update(idsimulation:number |undefined, simulation:Simulation){
    return this.http.put<any>(`${this.env.apiUrl}/simulation/update/${idsimulation}`,simulation)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/simulation/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }

}
