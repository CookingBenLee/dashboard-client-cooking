import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div style="display: inline-flex;" class="branding">
      <a [routerLink]="['/']">
        <img
          height="30px"
          width="auto"
          src="./assets/images/logo.png"
          class="align-middle m-2"
          alt="logo"
        />
      </a>
      <h3 style="margin-left: 6px;">Cooking BenLee</h3>
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}
