import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CompteUserService {
    private API_URL = environment.apiUrl;

    readonly END_POINT_UPD = "/compteuser/update"
    readonly END_POINT_FILE = "/compteuser/file"


    constructor(private http: HttpClient,private tokenService:TokenService) {}

    updateCompteUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}${this.END_POINT_UPD}/${id}`, data);
    }
}
