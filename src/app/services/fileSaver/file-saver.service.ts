import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { PicturesDishes } from '../picturedishes/PicturesDishes';

@Injectable({
  providedIn: 'root'
})
export class FileSaverService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(file:any,label:any){
    var f:FormData =new FormData()
    f.append("file",file)
    f.append("label",label)
    //const params = new HttpParams().append("file", file);
    return this.http.post<any>(`${this.env.apiUrl}/file/save`,f)
    .toPromise()
    .then()
    .then();
  }

  getFile(name:any){
    //const params = new HttpParams().append("name", name);
    // http://92.222.10.20:9999/file/getfile
    return this.http.get<any>(`${this.env.apiUrl}/file/getfile?name=${name}`)
    .toPromise()
    .then(res => res as any)
  }
}
