import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeAccountService {
  private API_URL = environment.apiUrl;

   readonly END_POINT_GET = "/type_compte/getall"
  constructor(private http: HttpClient) { }

  getAllTypeAccount(){
    return this.http.get<any>(this.API_URL + this.END_POINT_GET)
  }
}
