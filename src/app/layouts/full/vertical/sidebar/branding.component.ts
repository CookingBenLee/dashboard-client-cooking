import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding d-flex align-items-center">
      @if(options.theme === 'light') {
        <a [routerLink]="['/home']">
        <img
          height="30px"
          width="auto"
          src="./assets/images/logo.png"
          class="align-middle m-2"
          alt="logo"
        />
      </a>
      <h3 style="margin-left: 6px;">Cooking BenLee</h3>
      } @if(options.theme === 'dark') {
        <a [routerLink]="['/home']">
        <img
          height="30px"
          width="auto"
          src="./assets/images/logo.png"
          class="align-middle m-2"
          alt="logo"
        />
      </a>
      <h3 style="margin-left: 6px;">Cooking BenLee</h3>
      }
    </div>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}
}
