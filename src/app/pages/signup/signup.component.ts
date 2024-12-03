// import { productsData } from './../ui-components/tables/tables.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
// import { Router, RouterModule } from '@angular/router';
// import { MessageService } from 'primeng/api';
// import { ButtonModule } from 'primeng/button';
// import { RippleModule } from 'primeng/ripple';
// import { ToastModule } from 'primeng/toast';
import { NoWhitespaceDirective } from 'src/app/directives/no-whitespace.directive';
import { TypeCompte } from 'src/app/entity/TypeCompte';
import { Utilisateur } from 'src/app/entity/Utilisateur';
import { TypeAccountService } from 'src/app/services/type-account/type-account.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NoWhitespaceDirective,RouterModule
  ],
  providers: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  ngOnInit(): void {
    this.getAllAccountType();
  }
  constructor( private userService: UserService, private typeAccountService: TypeAccountService,
    private router: Router
  ){}

  id: number;
  nom: String;
  prenom: String;
  login: String;
  password: String
  denomination: String;
  typeCompte: any;
  users: Utilisateur[] = [];
  typeAccounts: TypeCompte[] = [];
  utilisateur: Utilisateur = new Utilisateur();
  confirmation: String;
  errorMessage: string = '';

  addUserAccount(form: NgForm){
    if (form.valid) {
      if (this.password === this.confirmation) {
        console.log('Form Data: ', form.value);
        console.log("valid");
        this.utilisateur.nom = this.nom;
        this.utilisateur.prenom = this.prenom;
        this.utilisateur.login = this.login;
        this.utilisateur.password =this.password;
        this.utilisateur.typeCompte = this.typeCompte

        console.log(this.utilisateur);

        this.userService.createUser(this.utilisateur).subscribe(
          (data: any) => {
            console.log('User created:', data);
            this.router.navigate(['/login'], {
              queryParams: { success: 'Compte ' + this.utilisateur.prenom + ' ' + this.utilisateur.nom +   ' créé avec succès!' }
            });
          },
          (error) => {
            console.error('Error creating user:', error);
          }
        );
      } else {
         this.errorMessage = "Les mots de passe ne correspondent pas."

      }



    }
  }

  getAllAccountType(): void {
    this.typeAccountService.getAllTypeAccount().subscribe(
      (data: any) => {
        this.typeAccounts = data.data;
        console.log(this.typeAccounts);
      },
      (error) => {
        console.error('Error fetching account types:', error);
      }
    );
  }
}

