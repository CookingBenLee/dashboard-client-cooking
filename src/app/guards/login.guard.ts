import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { TokenService } from "../services/token/token.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = this.tokenService.getToken();  // Récupérer le token depuis le service TokenService

    console.log(token);
    
    // Si un token existe, l'utilisateur peut accéder à la route
    if (token) {
      this.router.navigate(['/home']);
      return false;
    }

    // Sinon, rediriger l'utilisateur vers la page de login
    localStorage.clear();
    this.tokenService.signOut();
    return true;
  }
}
