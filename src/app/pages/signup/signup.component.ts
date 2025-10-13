import { label } from './../apps/contact-app/listening/categories';
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
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { TreeModule } from 'primeng/tree';
import { AccordionModule } from 'primeng/accordion';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ChipModule } from 'primeng/chip';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AddressService } from 'src/app/services/address/address.service';
import { Address } from 'src/app/services/address/Address';
import { Shop } from 'src/app/services/shop/Shop';
import { Country } from 'src/app/services/country/Country';
import { MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';

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

  countries: any[] | undefined;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  loading: boolean = false;
  successMessage: string;
  ngOnInit(): void {
    this.getAllAccountType();
    this.getCountry();
    this.getAllAdress();
  }
  constructor( private userService: UserService, private typeAccountService: TypeAccountService,
    private router: Router, private countryService: CountryService, private adresseService: AddressService,
    private messageService: MessageService,
  ){}


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

  addUserAccount(form: NgForm) {
    this.errorMessage = ''; // Réinitialiser le message à chaque soumission
    this.successMessage = ''; // Optionnel : pour un message de succès
  
    if (form.valid) {
      if (this.compteUser.password === this.compteUser.confirmation) {
  
        this.adresseService.create(this.adresseS).then(
          (response: any) => {
            const formData = new FormData();
            delete this.compteUser.confirmation;
            console.log('Compte User : ', this.compteUser);
  
            // Ajouter le fichier
            if (this.selectedFile) {
              formData.append('photo', this.selectedFile);
              this.compteUser.photo = this.selectedFile?.name;
            }
            this.compteUser.address = response.data;
  
            // Ajouter le JSON du compteUser en tant que string
            formData.append('compteUser', new Blob([JSON.stringify(this.compteUser)], { type: 'application/json' }));
  
            console.log('Form Data : ', formData);
  
            this.userService.createUserWithFile(formData).subscribe(
              (data: any) => {
                console.log('Utilisateur créé:', data);
                this.successMessage = `Compte ${this.compteUser.prenom} ${this.compteUser.nom} créé avec succès !`;
                this.router.navigate(['/login'], {
                  queryParams: { success: this.successMessage }
                });
              },
              (error) => {
                console.error('Erreur lors de la création de l\'utilisateur:', error);
  
                // Gestion des erreurs côté interface
                if (error.status === 0) {
                  this.errorMessage = "Impossible de joindre le serveur. Vérifiez votre connexion.";
                } else if (error.status >= 400 && error.status < 500) {
                  this.errorMessage = "Erreur côté client : " + (error.error?.message || "Données invalides.");
                } else if (error.status >= 500) {
                  this.errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
                } else {
                  this.errorMessage = "Une erreur inattendue est survenue.";
                }
              }
            );
          }
        ).catch((err) => {
          console.error('Erreur lors de la création de l\'adresse:', err);
          this.errorMessage = "Impossible de créer l'adresse. Vérifiez les informations saisies.";
        });
  
      } else {
        this.errorMessage = "Les mots de passe ne correspondent pas.";
        console.error('Les mots de passe ne correspondent pas');
      }
    } else {
      this.errorMessage = "Veuillez remplir correctement tous les champs du formulaire.";
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

  // longitude?:number;
  // latitude?:number;

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

  // // Exemple : envoi du fichier au backend lors de la création du compte
  // addUserAccount(form: any) {
  //   if (!form.valid) {
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('nom', this.compteUser.nom);
  //   formData.append('prenom', this.compteUser.prenom);
  //   formData.append('email', this.compteUser.login);
  //   formData.append('password', this.compteUser.password);
  //   formData.append('typeCompte', this.compteUser.typeCompte?.id || '');
    
  //   // Si un fichier est sélectionné, l’ajouter
  //   if (this.selectedFile) {
  //     formData.append('logo', this.selectedFile);
  //   }

  //   // Exemple : appel backend
  //   // this.http.post('/api/users', formData).subscribe(...)
  // }
}
  

