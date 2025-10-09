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
// prime
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { AddressService } from 'src/app/services/address/address.service';
import { Address } from 'src/app/services/address/Address';
import { Shop } from 'src/app/services/shop/Shop';
import { Country } from 'src/app/services/country/Country';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TokenService } from 'src/app/services/token/token.service';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NoWhitespaceDirective,RouterModule,
    FormsModule,DropdownModule,DialogModule,InputNumberModule,
    FormsModule,
    ReactiveFormsModule,ToastModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    ButtonModule],
  providers: [MessageService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  user : any
  countries: any[] | undefined;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  loading: boolean = false;
  env: any;
  id: number;
  nom: String;
  prenom: String;
  login: String;
  password: String
  denomination: String;
  photo : String;
  typeCompte: any;
  users: Utilisateur[] = [];
  typeAccounts: TypeCompte[] = [];
  utilisateur: Utilisateur = new Utilisateur();
  confirmation: String;
  errorMessage: string = '';
  country: any
  pays: any
  selectePays: any
  adresse: Address[] = []
  addressesSelected: any

  adresseS: any = {}
  compteUser: any = {}
  constructor( private userService: UserService, private typeAccountService: TypeAccountService,
    private router: Router, private countryService: CountryService, private adresseService: AddressService,
    private messageService: MessageService,private tokenService :TokenService
  ){}

  ngOnInit(): void {
    this.getAllAccountType();
    this.getCountry();
    this.getAllAdress();
  
    this.user = this.tokenService.getUser();
    console.log('Utilisateur récupéré :', this.user); // Vérifiez si toutes les propriétés sont là
  
    if (this.user && this.user.nom !== undefined) {
      this.loadUserDataAll(this.user);
    }
  }
  


  
  // 🔹 Charger les infos du compte et de l’adresse à modifier
  loadUserDataAll(user: any) {
    console.log('Données utilisateur pour chargement:', user);
    this.compteUser = user.compteUser;
    this.adresseS = this.compteUser.address;
    // Assurez-vous que user a bien les propriétés attendues
    this.nom = user.nom;
    this.prenom = user.users.prenom;
    this.login = user.users.login;
    this.password = user.users.password;
    this.confirmation = user.users.password;
    this.denomination = user.compteUser?.denomination;
    this.photo = user.compteUser?.photo;
  
    // Gestion du type de compte et pays si présents
    if (this.typeAccounts && user.compteUser?.typeCompte) {
      const foundType = this.typeAccounts.find(t => t.id === user.compteUser.typeCompte.id);
      this.compteUser.typeCompte = foundType || user.compteUser.typeCompte;
    }
  
    if (this.pays && user.compteUser?.address?.country) {
      const foundCountry = this.pays.find((p: any) => p.name === user.compteUser.address.country.name);
      this.adresseS.country = foundCountry || user.compteUser.address.country;
    }
  
    // Log pour vérifier
    console.log('Loaded user data:', this);
  }
  
  // 🔹 Méthode de mise à jour du compte utilisateur
  
  updateUserAccount(form: NgForm) {
    if (form.valid) {
      const formData = new FormData();
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
        this.compteUser.photo = this.selectedFile.name;
      }

      formData.append('compteUser', new Blob([JSON.stringify(this.compteUser)], { type: 'application/json' }));

      // 🔹 Mise à jour de l'adresse avant utilisateur
      this.adresseService.update(this.adresseS.id, this.adresseS).then(
        (response: any) => {
          this.compteUser.address = response.data;
          console.log('ID COMPTE :',this.compteUser.id);
          console.log('Form Data :',formData);

          this.userService.updateUserWithFile(this.compteUser.id, formData).subscribe(
            (res: any) => {
              this.messageService.add({
                key: 'tc',
                severity: 'success',
                summary: 'Mise à jour réussie',
                detail: 'Le compte a été modifié avec succès.'
              });
            },
            (error : any) => {
              this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Erreur',
                detail: "La mise à jour du compte a échoué."
              });
            }
          );
        }
      );
    }
  }


  saveme(){
    console.log("passeeeeee");

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
  onCancel() {
    window.history.back(); // ou ferme le dialog si c’est une popup
  }
  
  getAllAdress(){
    this.adresseService.getAll().then(data=>{
      this.adresse=data
    })
  }
  visibleAdd: boolean = false;
  addNewAddress(){
    this.visibleAdd = true;
  }

  addresss:Address[]=[]
  shops:Shop[]=[]

  positionModalConfirm:any
  motRecherche=''
  label?:string;
  streetNumber?:string;
  streetName?:string;
  city?:string;

  geolocation?:string;
  contact?:string;
  email?:string;

  shop :Shop=new Shop();
  countrys:Country[]

  address: Address=new Address();
  // description:string

  isError:boolean
  isSuccess:boolean
  erreur:string
  sucess:string
  // loading: boolean = false;

  addressClicked: Address=new Address();
  position:string
  isEditaddressDialogVisible:boolean=false
  isErrorEdit:boolean
  isSuccessEdit:boolean
  erreurEdit:string
  sucessEdit:string
  activeIndex: number = 0;
  countrySelect: any
  save(){
    console.log("hello")
    console.log("saveeeeeeeeeeeeeeee");

    this.isError=false
    this.isSuccess=false
    this.loading=true

    this.address.shop=this.shop
    this.address.country=this.countrySelect

    //recup des valeurs et attribution

    this.address.label=this.label
    // this.address.longitude=this.longitude
    // this.address.latitude=this.latitude
    this.address.streetNumber=this.streetNumber
    this.address.city=this.city
    this.address.streetName=this.streetName

    this.address.geolocation=this.geolocation
    // this.address.contact=this.contact
    // this.address.email=this.email

    console.log("envoyes", this.address);

    this.adresseService.create(this.address).then((data) =>{
      this.loading=false
      //this.isSuccess=true
      this.sucess="address created !"
      this.label=""
      this.geolocation=""
      this.email=""
      this.contact=""
      this.streetName=""

      this.city=""
      this.streetNumber=""
      this.activeIndex=0
      this.messageService.add({key:'tc', severity: 'success', summary: 'Success', detail: this.sucess});
      this.visibleAdd = false;
      this.getAllAdress();

    },
    (error: any)=>{
      //this.isError=true
      if(error.error.message=='ko'){
        this.erreur=error.error.data
        }else{
        this.erreur="Server related error"
      }
      this.loading=false
      this.messageService.add({key:'tc', severity: 'error', summary: 'Error', detail: this.erreur });
      this.visibleAdd = false;
      this.getAllAdress();
    });
  }

  

  // Simule un clic sur le champ fichier masqué
  clickFileSelector() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  // Quand un fichier est sélectionné
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Crée un aperçu de l’image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

}
  

