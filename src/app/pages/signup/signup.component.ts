import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NoWhitespaceDirective } from 'src/app/directives/no-whitespace.directive';
import { TypeCompte } from 'src/app/entity/TypeCompte';
import { Utilisateur } from 'src/app/entity/Utilisateur';
import { CountryService } from 'src/app/services/country/country.service';
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
    this.getCountry();
  }
  constructor( private userService: UserService, private typeAccountService: TypeAccountService,
    private router: Router, private countryService: CountryService
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
  country: any
  pays: any

  adresse: any
  addUserAccount(form: NgForm) {
    if (form.valid) {
      if (this.password === this.confirmation) {
        this.utilisateur.nom = this.nom;
        this.utilisateur.prenom = this.prenom;
        this.utilisateur.login = this.login;
        this.utilisateur.password = this.password;
        this.utilisateur.typeCompte = this.typeCompte;
        this.utilisateur.country = this.country; // Vérifiez ici
        this.utilisateur.adresse = this.adresse;

        console.log('Données utilisateur envoyées:', this.utilisateur);

        this.userService.createUser(this.utilisateur).subscribe(
          (data: any) => {
            console.log('Utilisateur créé:', data);
            this.router.navigate(['/login'], {
              queryParams: {
                success: `Compte ${this.utilisateur.prenom} ${this.utilisateur.nom} créé avec succès !`
              }
            });
          },
          (error) => {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
          }
        );
      } else {
        this.errorMessage = "Les mots de passe ne correspondent pas.";
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

  getCountry() {
    this.countryService.getAll().then(
      (data: any) => {
        this.pays = data
        console.log(data);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

}

