import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenService } from '../token/token.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private env=environment;

  constructor(private tokenService: TokenService,private routeur:Router) {}

    intercept(httpRequest:HttpRequest<any>,httpHandler: HttpHandler): Observable<HttpEvent<any>> {
      if (httpRequest.url.includes(`${this.env.apiUrl}/user/login`)){
        return httpHandler.handle(httpRequest);
      }

      const token = this.tokenService.getToken();
      const request =
      httpRequest.clone({
        setHeaders: {Authorization: `Bearer ${token}` } });

      return httpHandler.handle(request).pipe(catchError(error=> {
        if(error.status ===403) {
          this.tokenService.signOut()
          this.routeur.navigate(['connexion']);
        }else if(error.status==0){
          this.routeur.navigate(['./error']);
          console.log(error.status)
        }
        console.log(error.status)
        throw error;
      })
    );
  }
}
