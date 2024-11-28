import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilisateur } from 'src/app/entity/Utilisateur';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.apiUrl;

   readonly END_POINT_ADD = "/compteuser/new"
  constructor( private http: HttpClient) { }

  createUser(user: Utilisateur):Observable<Utilisateur>{
    return this.http.post<Utilisateur>(this.API_URL + this.END_POINT_ADD, user);
  }

}
