import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompteUser } from './CompteUser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompteUserService {
  private env = environment;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<any>(`${this.env.apiUrl}/compteuser/getall`)
        .toPromise()
        .then(res => res.data as CompteUser[])
        .then(data => data);
  }

  getBaseUrl(): string {
    return this.env.apiUrl;
  }
}
