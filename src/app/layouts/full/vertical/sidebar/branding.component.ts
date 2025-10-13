import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { TokenService } from 'src/app/services/token/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding text-center">
      @if (options.theme === 'light') {
        <a [routerLink]="['/home']">
          <img
            
            width="20%"
            [src]="getUserImageUrl()"
            
            alt="logo du compte"
          />
          
        </a>
        <h2 class="denomination">{{ user?.compteUser?.denomination }}</h2>
      }

      @if (options.theme === 'dark') {
        <a [routerLink]="['/home']">
          <img
            height="80"
            width="80"
            src="./assets/images/logo.png"
            class="rounded-circle mb-2"
            alt="logo"
          />
        </a>
        <h2 class="denomination">Cooking BenLee</h2>
      }
    </div>
  `,
  styles: [`
    .branding {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 15px;
    }

    .branding img {
      display: block;
      margin: 0 auto;
      object-fit: cover;
      border: 2px solid #ddd;
    }

    .denomination {
      margin-top: 8px;
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
    }
  `]
})
export class BrandingComponent {
  options = this.settings.getOptions();
  fixedDateTime: string = '20/01/2025, 00:40:00';
  user: any;
  private baseUrl = `${environment.apiUrl}/compteuser/uploaddir/`;
  constructor(private settings: CoreService, private tokenService: TokenService) {}

  ngOnInit() {
    this.user = this.tokenService.getUser();
  }
  /**
   * Construit l’URL de l’image utilisateur.
   * Si aucune photo n’est définie, retourne le logo par défaut.
   */
  getUserImageUrl(): string {
    const photo = this.user?.compteUser?.photo;
    console.log('photo', `${this.baseUrl}${photo}`);
    if (photo) {
      return `${this.baseUrl}${photo}`;
    } else {
      return './assets/images/logo.png';
    }
  }
}
