import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilisateur } from 'src/app/entity/Utilisateur';
import { environment } from 'src/environments/environment';
import { TokenService } from '../token/token.service';
import { Country } from '../country/Country';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.apiUrl;
  private env=environment;
   readonly END_POINT_ADD = "/user/new"
   readonly END_POINT_LOGIN = "/user/login"
   readonly END_POINT_LOGOUT = "/logout"
  constructor( private http: HttpClient, private tokenService:TokenService) { }

  createUser(user: Utilisateur):Observable<Utilisateur>{
    return this.http.post<Utilisateur>(this.API_URL + this.END_POINT_ADD, user);
  }



   login(login: string, password: string): Observable<any> {
    const user = { "password": password, "login": login };
    return this.http.post(this.API_URL + this.END_POINT_LOGIN, user);
  }


  logout(): Observable<any>{
    this.tokenService.signOut();
    return this.http.get(this.API_URL + this.END_POINT_LOGOUT );
  }


  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/country/getall`)
        .toPromise()
        .then(res => res.data as Country[])
        .then(data => data);
  }

}
