import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilisateur } from 'src/app/entity/Utilisateur';
import { environment } from 'src/environments/environment';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.apiUrl;

   readonly END_POINT_ADD = "/compteuser/new"
   readonly END_POINT_LOGIN = "/compteuser/login"
  constructor( private http: HttpClient, private tokenService:TokenService) { }

  createUser(user: Utilisateur):Observable<Utilisateur>{
    return this.http.post<Utilisateur>(this.API_URL + this.END_POINT_ADD, user);
  }


   // Méthode pour se connecter
   login(login: string, password: string): Observable<any> {
    const user = { "password": password, "login": login };
    return this.http.post(this.API_URL + this.END_POINT_LOGIN, user);
  }



}
