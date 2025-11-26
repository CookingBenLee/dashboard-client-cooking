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
  

  
  // 🔹 Charger les infos du compte et de l'adresse à modifier
  loadUserDataAll(user: any) {
    console.log('Données utilisateur pour chargement:', user);
    
    // 🔹 Initialiser les objets si nécessaire
    if (!user.compteUser) {
      console.error('Aucun compte utilisateur trouvé');
      return;
    }
    
    // 🔹 Copier les données du compte utilisateur
    this.compteUser = { ...user.compteUser };
    
    // 🔹 Initialiser l'adresse
    if (this.compteUser.address) {
      this.adresseS = { ...this.compteUser.address };
    } else {
      this.adresseS = {};
    }
    
    // 🔹 Mettre à jour les propriétés de l'utilisateur
    if (user) {
      this.user = { ...user };
      this.prenom = user.prenom || '';
      this.nom = user.nom || '';
    }
    
    // 🔹 Mettre à jour la dénomination
    this.denomination = this.compteUser?.denomination || '';
    this.photo = this.compteUser.photo || this.compteUser.picture;
  
    // 🔹 Gestion du type de compte
    if (this.typeAccounts && this.typeAccounts.length > 0 && this.compteUser?.typeCompte) {
      const foundType = this.typeAccounts.find(t => t.id === this.compteUser.typeCompte.id);
      if (foundType) {
        this.compteUser.typeCompte = foundType;
      }
    }
  
    // 🔹 Gestion du pays
    if (this.pays && this.pays.length > 0 && this.adresseS?.country) {
      const countryId = typeof this.adresseS.country === 'object' 
        ? this.adresseS.country.id 
        : this.adresseS.country;
      
      const foundCountry = this.pays.find((p: any) => p.id === countryId);
      if (foundCountry) {
        this.adresseS.country = foundCountry;
        this.country = foundCountry.id;
      } else if (this.adresseS.country) {
        // Si le pays n'est pas trouvé dans la liste, on le garde tel quel
        this.country = countryId;
      }
    }
    
    // 🔹 Gestion de la photo
    if (this.compteUser?.photo) {
      this.imageUrl = `${this.baseUrl}${this.compteUser.photo}`;
      console.log('URL de la photo utilisateur :', this.imageUrl);
    }
    
    // Log pour vérifier
    console.log('Loaded user data:', {
      compteUser: this.compteUser,
      user: this.user,
      adresseS: this.adresseS,
      nom: this.nom,
      prenom: this.prenom,
      denomination: this.denomination
    });
  }
  
  // 🔹 Méthode de mise à jour du compte utilisateur
  
  updateUserAccount(form: NgForm) {
    if (form.valid) {
      this.loading = true;
      
      // 🔹 Mise à jour des propriétés de l'utilisateur depuis le formulaire
      // Les valeurs sont déjà liées via ngModel, mais on s'assure qu'elles sont bien assignées
      if (this.user) {
        this.user.nom = this.nom || this.user.nom;
        this.user.prenom = this.prenom || this.user.prenom;
      }
      
      // 🔹 Mise à jour des propriétés du compte utilisateur
      if (this.compteUser) {
        this.compteUser.denomination = this.denomination || this.compteUser.denomination;
        // Le typeCompte est déjà mis à jour via ngModel
      }
      
      // 🔹 Préparer l'adresse pour la mise à jour
      // S'assurer que l'adresse a un ID
      if (!this.adresseS.id && this.compteUser?.address?.id) {
        this.adresseS.id = this.compteUser.address.id;
      }
      
      // 🔹 S'assurer que le pays est correctement formaté
      let addressToUpdate = { ...this.adresseS };
      if (addressToUpdate.country) {
        // Si le pays est un objet, s'assurer qu'il a les bonnes propriétés
        if (typeof addressToUpdate.country === 'object' && addressToUpdate.country.id) {
          // Le pays est déjà un objet avec un ID, on le garde tel quel
          // Mais on peut aussi envoyer seulement l'ID selon ce que l'API attend
          // Pour l'instant, on garde l'objet complet
        } else if (typeof addressToUpdate.country === 'number') {
          // Si c'est juste un ID, on cherche l'objet pays correspondant
          const countryObj = this.pays?.find((p: any) => p.id === addressToUpdate.country);
          if (countryObj) {
            addressToUpdate.country = countryObj;
          }
        }
      }
      
      console.log('📍 Adresse à mettre à jour :', addressToUpdate);
      
      // 🔹 Préparer l'adresse pour l'inclure dans le compte utilisateur
      // L'adresse sera mise à jour via le compte utilisateur plutôt que séparément
      // pour éviter les problèmes d'authentification
      this.compteUser.address = addressToUpdate;
      
      // 🔹 Fonction pour continuer avec la mise à jour du compte utilisateur
      const proceedWithAccountUpdate = (addressData?: any) => {
        // Si l'adresse a été mise à jour, utiliser la réponse, sinon utiliser l'adresse préparée
        if (addressData) {
          this.compteUser.address = addressData.data || addressData;
        }
        
        // 🔹 Création du FormData
        const formData = new FormData();
        
        // 🔸 Ajout du fichier s'il existe
        if (this.selectedFile) {
          formData.append('photo', this.selectedFile, this.selectedFile.name);
          this.compteUser.photo = this.selectedFile.name;
        } else if (this.compteUser.photo) {
          // Conserver la photo existante si aucune nouvelle photo n'est sélectionnée
          // Ne rien faire, la photo existante sera conservée côté backend
        }
        
        // 🔸 Préparer le compte utilisateur pour l'envoi
        // Nettoyer l'objet pour éviter les références circulaires et les propriétés inutiles
        const compteUserToSend: any = {
          id: this.compteUser.id,
          denomination: this.compteUser.denomination,
          typeCompte: this.compteUser.typeCompte,
          photo: this.compteUser.photo
        };
        
        // 🔸 Ajouter l'adresse si elle existe
        if (this.compteUser.address) {
          const addressToSend: any = {
            id: this.compteUser.address.id,
            label: this.compteUser.address.label,
            streetNumber: this.compteUser.address.streetNumber,
            streetName: this.compteUser.address.streetName,
            city: this.compteUser.address.city
          };
          
          // 🔸 Formater le pays - envoyer seulement l'ID si c'est un objet
          if (this.compteUser.address.country) {
            if (typeof this.compteUser.address.country === 'object' && this.compteUser.address.country.id) {
              addressToSend.country = { id: this.compteUser.address.country.id };
            } else if (typeof this.compteUser.address.country === 'number') {
              addressToSend.country = { id: this.compteUser.address.country };
            } else {
              addressToSend.country = this.compteUser.address.country;
            }
          }
          
          compteUserToSend.address = addressToSend;
        }
        
        // 🔸 Ajout du JSON du compte utilisateur (en texte brut, pas en Blob)
        formData.append('compteUser', JSON.stringify(compteUserToSend));
        
        // 🔸 Ajout du JSON de l'utilisateur pour mettre à jour nom et prénom
        formData.append('user', JSON.stringify({
          id: this.user.id,
          nom: this.user.nom,
          prenom: this.user.prenom
        }));
        
        console.log('🧾 FormData envoyé :', {
          compteUser: compteUserToSend,
          user: { id: this.user.id, nom: this.user.nom, prenom: this.user.prenom },
          photo: this.selectedFile?.name || 'aucune nouvelle photo'
        });
        console.log('🖼️ Fichier sélectionné :', this.selectedFile?.name);
        console.log('📦 Structure complète du compteUser:', JSON.stringify(compteUserToSend, null, 2));

        // 🔹 Appel du service de mise à jour utilisateur
        this.userService.updateUserWithFile(this.compteUser.id, this.user.id, formData).subscribe(
          (res: any) => {
            this.loading = false;
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
            this.loading = false;
            console.error('❌ Erreur backend complète :', error);
            console.error('❌ Status:', error?.status);
            console.error('❌ Status Text:', error?.statusText);
            console.error('❌ Error body:', error?.error);
            console.error('❌ Error message:', error?.error?.message);
            console.error('❌ Error data:', error?.error?.data);
            
            // Construire un message d'erreur détaillé
            let errorMessage = "La mise à jour du compte a échoué.";
            if (error?.error) {
              if (error.error.message) {
                errorMessage = error.error.message;
              } else if (error.error.data) {
                errorMessage = error.error.data;
              } else if (typeof error.error === 'string') {
                errorMessage = error.error;
              }
            } else if (error?.message) {
              errorMessage = error.message;
            }
            
            // Ajouter des détails supplémentaires pour les erreurs 400
            if (error?.status === 400) {
              errorMessage += " (Erreur de validation - vérifiez les données envoyées)";
            }
            
            this.messageService.add({
              key: 'tc',
              severity: 'error',
              summary: 'Erreur',
              detail: errorMessage
            });
          }
        );
      };
      
      // 🔹 Essayer de mettre à jour l'adresse séparément, mais continuer même en cas d'erreur
      // car l'adresse sera également mise à jour via le compte utilisateur
      if (addressToUpdate.id) {
        this.adresseService.update(addressToUpdate.id, addressToUpdate).then(
          (response: any) => {
            console.log('✅ Adresse mise à jour avec succès :', response);
            proceedWithAccountUpdate(response);
          },
          (error: any) => {
            console.warn('⚠️ Erreur lors de la mise à jour séparée de l\'adresse, continuation avec la mise à jour du compte :', error);
            // Continuer quand même avec la mise à jour du compte utilisateur
            // L'adresse sera mise à jour via le compte utilisateur
            proceedWithAccountUpdate();
          }
        );
      } else {
        // Pas d'ID d'adresse, continuer directement avec la mise à jour du compte
        proceedWithAccountUpdate();
      }
    } else {
      this.messageService.add({
        key: 'tc',
        severity: 'warn',
        summary: 'Formulaire invalide',
        detail: 'Veuillez remplir tous les champs requis.'
      });
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
  

