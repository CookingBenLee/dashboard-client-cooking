import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';
import { TokenService } from 'src/app/services/token/token.service';

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
            [src]="'./assets/images/' + (user?.compteUser?.photo || 'logo.png')"
            
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

  constructor(private settings: CoreService, private tokenService: TokenService) {}

  ngOnInit() {
    this.user = this.tokenService.getUser();
  }
}
