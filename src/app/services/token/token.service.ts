import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }


  public saveToken(token: string): void {
    console.log('💾 Sauvegarde du token:', token);
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    console.log('✅ Token sauvegardé dans sessionStorage');
  }


  public getToken(): string {
    const token = window.sessionStorage.getItem(TOKEN_KEY) || '';
    console.log('🔍 Récupération du token:', token);
    return token;
  }


  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }


  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    console.log('TokenService.getUser:', user); 
    return user ? JSON.parse(user) : null;
  }

  // Méthode pour régénérer le token
  public async regenerateToken(): Promise<string | null> {
    try {
      const response = await fetch(`${environment.apiUrl}/api/auth/new-token`);
      if (response.ok) {
        const data = await response.json();
        this.saveToken(data.token);
        return data.token;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la régénération du token:', error);
      return null;
    }
  }

  // Méthode pour valider le token
  public async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${environment.apiUrl}/api/auth/validate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.valid;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error);
      return false;
    }
  }
}

