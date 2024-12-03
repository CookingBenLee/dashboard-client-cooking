import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NoWhitespaceDirective } from 'src/app/directives/no-whitespace.directive';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { ToastModule } from 'primeng/toast';
// import { ButtonModule } from 'primeng/button';

// Importation des services de PrimeNG
// import { ConfirmationService, MessageService } from 'primeng/api';
import { N } from '@angular/cdk/keycodes';
// import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule,ReactiveFormsModule],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  successMessage: string | null = null;

  login: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
   ) {}

   ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.successMessage = params['success'] || null;


      if (this.successMessage) {
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      }
    });

  }



   onSubmit(): void {
    this.userService.login(this.login, this.password).subscribe(
      (response: any) => {
        this.tokenService.saveToken(response.token);
        this.tokenService.saveUser(response.user);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Échec de la connexion', error);
        this.errorMessage = 'Login ou mot de passe incorrect';
      }
    );
  }
}
