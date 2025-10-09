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
   readonly END_POINT_ADD = "/compteuser/new"
   readonly END_POINT_UPD = "/compteuser/updatecompteuser/"
   readonly END_POINT_FILE = "/compteuser/file/"
   readonly END_POINT_LOGIN = "/compteuser/login"
   readonly END_POINT_LOGOUT = "/logout"
  constructor( private http: HttpClient, private tokenService:TokenService) { }

  createUser(user: Utilisateur):Observable<Utilisateur>{
    return this.http.post<Utilisateur>(this.API_URL + this.END_POINT_ADD, user);
  }

  createUserWithFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}${this.END_POINT_ADD}`, formData);
  }
  //Modification d'un utilisateur
  updateUserWithFile(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.API_URL}${this.END_POINT_UPD}${id}`, formData);
    
  }

   login(login: string, password: string): Observable<any> {
    const user = { "password": password, "login": login };
    return this.http.post(this.API_URL + this.END_POINT_LOGIN, user);
  }

  // getFile(fichier: string): Observable<any> {
  //   return this.http.get<any>(`${this.API_URL}${this.END_POINT_FILE}`+fichier);
  // }

  logout(): Observable<any>{
    this.tokenService.signOut();
    return this.http.get(this.API_URL + this.END_POINT_LOGOUT );
  }
  //Recuperer un utilisateur par ID
  getById(id: number) {
    return this.http.get<any>(`${this.env.apiUrl}/user/get/${id}`);
  }
  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/country/getall`)
        .toPromise()
        .then(res => res.data as Country[])
        .then(data => data);
  }

}
