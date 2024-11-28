import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/services/token/token.service';  // Importez le service TokenService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = this.tokenService.getToken();  // Récupérer le token depuis le service TokenService

    // Si un token existe, l'utilisateur peut accéder à la route
    if (token) {
      return true;
    }

    // Sinon, rediriger l'utilisateur vers la page de login
    this.router.navigate(['/login']);
    return false;
  }
}
