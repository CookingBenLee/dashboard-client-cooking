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
import { environment } from 'src/environments/environment';
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

  private baseUrl = `${environment.apiUrl}/compteuser/uploaddir/`;
  imageUrl: string | null = null;
  adresseS: any = {}
  compteUser: any = {}
  constructor( private userService: UserService, private typeAccountService: TypeAccountService,
    private router: Router, private countryService: CountryService, private adresseService: AddressService,
    private messageService: MessageService,private tokenService :TokenService
  ){}

  ngOnInit(): void {
  this.user = this.tokenService.getUser();
  console.log('Utilisateur recuperate :', this.user);

  // Charger les données dépendantes avant de remplir le formulaire
  Promise.all([
    this.getAllAccountType(),
    this.getCountry(),
    this.getAllAdress()
  ]).then(() => {
    if (this.user) {
      this.loadUserDataAll(this.user);
    }
  });
}
  

  
  // 🔹 Charger les infos du compte et de l’adresse à modifier
  loadUserDataAll(user: any) {
    console.log('Données utilisateur pour chargement:', user);
    this.compteUser = user.compteUser;
    this.adresseS = this.compteUser.address;
    
    // this.country = this.adresseS.country.id;
    // Assurez-vous que user a bien les propriétés attendues
    this.prenom = user.prenom ;
    this.nom = user.nom;
    // this.login = user.users.login;
    
    this.denomination = user.compteUser?.denomination;
    this.photo = this.compteUser.picture;
  
    // Gestion du type de compte et pays si présents
    if (this.typeAccounts && user.compteUser?.typeCompte) {
      const foundType = this.typeAccounts.find(t => t.id === user.compteUser.typeCompte.id);
      this.compteUser.typeCompte = foundType || user.compteUser.typeCompte;
    }
  
    if (this.pays && user.compteUser?.address?.country) {
      const foundCountry = this.pays.find((p: any) => p.id === user.compteUser.address.country.id);
      this.adresseS.country = foundCountry || user.compteUser.address.country;
      this.country = foundCountry.id;
    }
    if (this.compteUser?.photo) {
      this.imageUrl = `${this.baseUrl}${this.compteUser.photo}`;
      console.log('URL de la photo utilisateur :', this.imageUrl);
    }
    // Log pour vérifier
    console.log('Loaded user data:', this);
  }
  
  // 🔹 Méthode de mise à jour du compte utilisateur
  
  updateUserAccount(form: NgForm) {
    if (form.valid) {
      // 🔹 Met à jour les champs utilisateur depuis le formulaire
      this.compteUser.nom = this.user.nom;
      this.compteUser.prenom = this.user.prenom;
  
      // 🔹 Création du FormData
      const formData = new FormData();
  
      
  
      // 🔸 Ajout du fichier s’il existe
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile.name);
        this.compteUser.photo = this.selectedFile.name;
      }
      
      // 🔸 Ajout du JSON (en texte brut, pas en Blob)
      formData.append('compteUser', JSON.stringify(this.compteUser));
      console.log('🧾 FormData envoyé :', this.compteUser);
      console.log('🖼️ Fichier sélectionné :', this.selectedFile?.name);
  
      // 🔹 Mise à jour de l'adresse avant utilisateur
      this.adresseService.update(this.adresseS.id, this.adresseS).then(
        (response: any) => {
          this.compteUser.address = response.data;
  
          // 🔹 Appel du service de mise à jour utilisateur
          this.userService.updateUserWithFile(this.compteUser.id,this.user.id, formData).subscribe(
            (res: any) => {
              this.messageService.add({
                key: 'tc',
                severity: 'success',
                summary: 'Mise à jour réussie',
                detail: 'Le compte a été modifié avec succès.'
              });
              setTimeout(() => {
                this.onCancel();
                this.tokenService.signOut(); // efface le token JWT
                this.router.navigate(['/login']);
              }, 2000);
            },
            (error: any) => {
              console.error('Erreur backend :', error);
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

  getAllAccountType(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.typeAccountService.getAllTypeAccount().subscribe(
        (data: any) => {
          this.typeAccounts = data.data;
          resolve();
        },
        (error) => {
          console.error('Erreur typeCompte:', error);
          reject(error);
        }
      );
    });
  }
  
  getCountry(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.countryService.getAll().then(
        (data: any) => {
          this.pays = data;
          resolve();
        },
        (error: any) => {
          console.error('Erreur pays:', error);
          reject(error);
        }
      );
    });
  }
  
  getAllAdress(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.adresseService.getAll().then(
        (data) => {
          this.adresse = data;
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  onCancel() {
    window.history.back(); // ou ferme le dialog si c’est une popup
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
  

