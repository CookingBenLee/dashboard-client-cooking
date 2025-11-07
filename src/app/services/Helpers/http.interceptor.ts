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
      // Exclure les routes de login, d'authentification et de signup
      if (httpRequest.url.includes(`${this.env.apiUrl}/compteuser/login`) ||
          httpRequest.url.includes(`${this.env.apiUrl}/compteuser/register`) ||
          httpRequest.url.includes(`${this.env.apiUrl}/api/auth/`) ||
          httpRequest.url.includes(`${this.env.apiUrl}/country/getall`) ||
          httpRequest.url.includes(`${this.env.apiUrl}/type_compte/getall`) ||
          httpRequest.url.includes(`${this.env.apiUrl}/address/`)) {
        return httpHandler.handle(httpRequest);
      }

      const token = this.tokenService.getToken();
      console.log('🔑 Token utilisé dans l\'interceptor:', token);
      
      // Vérifier que le token n'est pas vide
      if (!token || token.trim() === '' || token === 'null' || token === 'undefined') {
        console.log('❌ Pas de token valide, redirection vers login');
        this.tokenService.signOut();
        this.routeur.navigate(['/login']);
        return httpHandler.handle(httpRequest);
      }

      const request = httpRequest.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });

      return httpHandler.handle(request).pipe(catchError(error=> {
        console.log('🚨 Erreur HTTP:', error.status, error.message);
        console.log('🚨 URL de la requête:', httpRequest.url);
        console.log('🚨 Headers de la requête:', httpRequest.headers);
        
        if(error.status === 403) {
          console.log('403 Forbidden - Token invalide ou expiré, redirection vers login');
          console.log('🔍 Token utilisé:', token);
          this.tokenService.signOut();
          this.routeur.navigate(['/login']);
        } else if(error.status === 401) {
          console.log('401 Unauthorized - Token expiré, redirection vers login');
          this.tokenService.signOut();
          this.routeur.navigate(['/login']);
        } else if(error.status === 0) {
          console.log('Erreur de connexion - Serveur inaccessible');
          this.routeur.navigate(['/error']);
        }
        
        throw error;
      }));
    }
}
