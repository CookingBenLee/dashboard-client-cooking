import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NoWhitespaceDirective } from 'src/app/directives/no-whitespace.directive';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

// Importation des services de PrimeNG
import { ConfirmationService, MessageService } from 'primeng/api';
import { N } from '@angular/cdk/keycodes';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule,ReactiveFormsModule,NoWhitespaceDirective, ToastModule, ButtonModule,RippleModule],
  providers: [MessageService],
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
    private router: Router,private messageService: MessageService
   ) {}

   ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.successMessage = params['success'] || null;

      // Si un message existe, afficher le toast et le cacher après 3 secondes
      if (this.successMessage) {
        setTimeout(() => {
          this.successMessage = null;
        }, 3000); // Durée en millisecondes
      }
    });

  }


   // Soumettre le formulaire de connexion
   onSubmit(): void {
    this.userService.login(this.login, this.password).subscribe(
      (response: any) => {
        // Enregistrer le jeton dans le sessionStorage
        this.tokenService.saveToken(response.token);

        // Optionnellement, enregistrer les informations utilisateur (comme le rôle, etc.)
        this.tokenService.saveUser(response.user);

        // Rediriger l'utilisateur vers la page d'accueil après une connexion réussie
        this.router.navigate(['/home']);
      },
      (error) => {
        // Afficher un message d'erreur si l'authentification échoue
        console.error('Échec de la connexion', error);
        this.errorMessage = 'Login ou mot de passe incorrect';
      }
    );
  }
}
