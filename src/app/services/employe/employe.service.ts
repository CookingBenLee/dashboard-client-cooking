import { Injectable } from '@angular/core';
import { Employe } from './employe';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  async create(employe:Employe){
    await this.http.post<any>(`${this.env.apiUrl}/employe/new`, employe)
      .toPromise();
  }
  //read
  async getAll() {
    const res = await this.http.get<any>(`${this.env.apiUrl}/employe/getall`)
      .toPromise();
    const data = res.data as Employe[];
    return data;
  }
  async getAllPage(param:any) {
    const res = await this.http.get<any>(`${this.env.apiUrl}/employe/getallpage?page=` + param['page'] + '&size=' + param['size'])
      .toPromise();
    const data = res.data as any;
    return data;
  }

  async recherche(mot:String) {
    const res = await this.http.get<any>(`${this.env.apiUrl}/employe/search?mot=${mot}`)
      .toPromise();
    const data = res.data as Employe[];
    return data;
  }

  async rechercheParPage(mot:String,param:any) {
    const res = await this.http.get<any>(`${this.env.apiUrl}/employe/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
      .toPromise();
    const data = res.data as any;
    return data;
  }


  //update
  async update(idemploye:number |undefined, employe:Employe){
    await this.http.put<any>(`${this.env.apiUrl}/employe/update/${idemploye}`, employe)
      .toPromise();
  }




  ///delete
  async delete(id:number | undefined) {
  await this.http.delete<any>(`${this.env.apiUrl}/employe/delete/${id}`)
      .toPromise();
  }
}
