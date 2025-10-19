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
    console.log('🔒 AuthGuard DÉCLENCHÉ pour:', state.url);
    console.log('🔒 Route complète:', state.url);
    console.log('🔒 Route segments:', route.url);
    
    // Vérifier le contenu du sessionStorage directement
    const sessionToken = window.sessionStorage.getItem('auth-token');
    const sessionUser = window.sessionStorage.getItem('auth-user');
    console.log('🔍 SessionStorage direct - Token:', sessionToken);
    console.log('🔍 SessionStorage direct - User:', sessionUser);
    
    const token = this.tokenService.getToken();  // Récupérer le token depuis le service TokenService
    const user = this.tokenService.getUser();
    console.log('AuthGuard - Token:', token);
    console.log('AuthGuard - User:', user);
    console.log('AuthGuard - Route demandée:', state.url);

    // Vérifications détaillées du token
    console.log('🔍 Vérification du token:');
    console.log('  - Token existe:', !!token);
    console.log('  - Token length:', token ? token.length : 0);
    console.log('  - Token trim:', token ? token.trim() : '');
    console.log('  - Token !== null:', token !== 'null');
    console.log('  - Token !== undefined:', token !== 'undefined');
    console.log('  - Token !== empty string:', token !== '');

    // Si un token existe et qu'il n'est pas vide, l'utilisateur peut accéder à la route
    if (token && token.trim() !== '' && token !== 'null' && token !== 'undefined') {
      console.log('✅ AuthGuard - Token valide, accès autorisé');
      return true;
    }

    // Si pas de token valide, rediriger vers login
    console.log('❌ AuthGuard - Pas de token valide, redirection vers login');
    console.log('❌ Raison: token =', token);
    this.tokenService.signOut();
    this.router.navigate(['/login']);
    return false;
  }
}
