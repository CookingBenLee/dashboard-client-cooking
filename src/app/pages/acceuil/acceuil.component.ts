import { AppAddEmployeeComponent } from './../apps/employee/add/add.component';
import { environment } from 'src/environments/environment';
import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Employee } from 'src/app/pages/apps/employee/employee';
import { EmployeeService } from 'src/app/services/apps/employee/employee-service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountryService } from 'src/app/services/country/country.service';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { TokenService } from 'src/app/services/token/token.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Recipe } from 'src/app/services/recipe/Recipe';
import { Country } from 'src/app/services/country/Country';
import { CompteUserService } from 'src/app/services/compteuser/compteuser.service';
import { CompteUser as CompteUserModel } from 'src/app/services/compteuser/CompteUser';
import { DetailsrecipeService } from 'src/app/services/detailsrecipe/detailsrecipe.service';
import { CompositiondishesService } from 'src/app/services/compositiondishes/compositiondishes.service';
import { ProductService } from 'src/app/services/product/product.service';
import { DetailsRecipe } from 'src/app/services/detailsrecipe/DetailsRecipe';
import { CompositionDishes } from 'src/app/services/compositiondishes/CompositionDishes';
import { Product } from 'src/app/entity/Product';

// Interface temporaire pour CompteUser
interface CompteUser {
  id?: number;
  denomination?: string;
  typeCompte?: string;
  address?: Address;
  photo?: string;
  country?: any; // Pour compatibilité avec l'ancien code
  user?: any; // Ancien champ pour compatibilité
  userList?: any[]; // Nouveau champ pour la relation OneToMany
}

// Interface pour Address
interface Address {
  id?: number;
  label?: string;
  city?: string;
  country?: Country;
}

@Component({
  selector: 'app-acceuil',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    CommonModule,
    ToastModule,
  ],
  providers: [DatePipe, MessageService],
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.scss'
})
export class AcceuilComponent implements OnInit {

  // Données
  countries: Country[] = [];
  filteredCountries: Country[] = [];
  allComptes: CompteUserModel[] = [];
  filteredComptes: CompteUserModel[] = [];
  userMapping: Map<number, number[]> = new Map(); // Mapping compteId -> userIds[]
  allRecipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  
  // Filtres sélectionnés
  selectedCountries: number[] = [];
  selectedCookers: number[] = [];
  
  // Champs de recherche
  searchCountry: string = '';
  searchCooker: string = '';
  searchRecipe: string = '';
  
  // État de chargement
  loading = false;
  
  // Interface pour toutes les recettes
  showAllRecipes = false;
  allSharedRecipes: Recipe[] = [];
  filteredAllRecipes: Recipe[] = [];
  searchAllRecipes: string = '';
  selectedRecipeForDetail: Recipe | null = null;

  // Popup pour les détails de recette
  showRecipeDetail = false;
  selectedRecipe: Recipe | null = null;
  recipeDetails: any[] = [];

  constructor(
    private countryService: CountryService,
    private recipeService: RecipeService,
    private tokenService: TokenService,
    private messageService: MessageService,
    private compteUserService: CompteUserService,
    private detailsrecipeService: DetailsrecipeService,
    private compositiondishesService: CompositiondishesService,
    private productService: ProductService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      await Promise.all([
        this.getCountries(),
        this.getComptes(),
        this.getRecipes()
      ]);
      this.applyFilters();
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les données'
      });
    } finally {
      this.loading = false;
    }
  }

  getCountries() {
    return this.countryService.getAll().then(
      (data: Country[]) => {
        this.countries = data;
        this.filteredCountries = data; // Initialiser les pays filtrés
        console.log('Pays chargés:', data);
      },
      (error: any) => {
        console.error('Erreur lors du chargement des pays:', error);
      }
    );
  }

  getComptes() {
    return this.compteUserService.getAll().then(
      (data: CompteUserModel[]) => {
        this.allComptes = data;
        this.filteredComptes = data;
        console.log('Comptes chargés:', data.length);
        console.log('Premier compte détaillé:', data[0]);
        console.log('Structure des comptes (premiers 3):', data.slice(0, 3).map(c => ({
          id: c.id,
          denomination: c.denomination,
          hasUser: !!c.user,
          user: c.user,
          country: c.country
        })));
        
        // Charger le mapping des utilisateurs pour une meilleure performance
        console.log('Chargement du mapping des utilisateurs pour optimisation...');
        this.loadComptesWithUsers();
      },
      (error: any) => {
        console.error('Erreur lors du chargement des comptes:', error);
        // En cas d'erreur, utiliser des données par défaut
        this.allComptes = [];
        this.filteredComptes = [];
        this.messageService.add({
          severity: 'warn',
          summary: 'Attention',
          detail: 'Impossible de charger les comptes utilisateurs'
        });
      }
    );
  }

  // Méthode alternative pour charger les comptes avec leurs utilisateurs
  loadComptesWithUsers() {
    console.log('Chargement des comptes avec mapping des utilisateurs...');
    
    // Appeler le nouvel endpoint backend
    this.http.get<any>(`${environment.apiUrl}/compteuser/with-users`).subscribe({
      next: (response: any) => {
        console.log('Réponse du serveur:', response);
        
        if (response.data && response.data.comptes) {
          this.allComptes = response.data.comptes;
          this.filteredComptes = response.data.comptes;
          
          // Log pour déboguer la structure des données
          console.log('🔍 Structure des comptes chargés:', this.allComptes);
          if (this.allComptes.length > 0) {
            console.log('🔍 Premier compte:', this.allComptes[0]);
            console.log('🔍 Premier compte - country:', this.allComptes[0].country);
            console.log('🔍 Premier compte - address:', this.allComptes[0].address);
          }
          
          // Charger le mapping des utilisateurs
          if (response.data.userMapping) {
            this.userMapping.clear();
            for (const [compteId, userIds] of Object.entries(response.data.userMapping)) {
              this.userMapping.set(Number(compteId), userIds as number[]);
            }
            console.log('Mapping des utilisateurs chargé:', this.userMapping);
          }
          
          console.log('Comptes avec mapping chargés:', this.allComptes.length);
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des comptes avec utilisateurs:', error);
      }
    });
  }

  getRecipes() {
    return this.recipeService.getAll().then(
      (data: Recipe[]) => {
        // Filtrer seulement les recettes partagées
        this.allRecipes = data.filter(recipe => recipe.share === true);
        this.filteredRecipes = this.allRecipes;
        console.log('Recettes chargées:', data);
      },
      (error: any) => {
        console.error('Erreur lors du chargement des recettes:', error);
      }
    );
  }

  onCountryFilterChange(event: any) {
    const countryId = parseInt(event.target.value);
    console.log('Changement de filtre pays:', countryId, 'Coché:', event.target.checked);
    
    if (event.target.checked) {
      this.selectedCountries.push(countryId);
    } else {
      this.selectedCountries = this.selectedCountries.filter(id => id !== countryId);
    }
    
    console.log('Pays sélectionnés après changement:', this.selectedCountries);
    console.log('Tous les comptes avant filtrage:', this.allComptes.length);
    console.log('Structure des comptes (premiers 3):', this.allComptes.slice(0, 3).map(c => ({
      id: c.id,
      denomination: c.denomination,
      country: c.country
    })));
    this.applyFilters();
  }

  onCookerFilterChange(event: any) {
    const cookerId = parseInt(event.target.value);
    console.log('Changement de filtre cuisinier:', cookerId, 'Coché:', event.target.checked);
    
    if (event.target.checked) {
      this.selectedCookers.push(cookerId);
    } else {
      this.selectedCookers = this.selectedCookers.filter(id => id !== cookerId);
    }
    
    console.log('Cuisiniers sélectionnés après changement:', this.selectedCookers);
    this.applyFilters();
  }

  applyFilters() {
    // Filtrer les pays par recherche
    this.filteredCountries = this.countries;
    if (this.searchCountry.trim()) {
      this.filteredCountries = this.countries.filter(country => 
        country.name?.toLowerCase().includes(this.searchCountry.toLowerCase())
      );
    }

    // Filtrer les comptes par pays sélectionnés ET par recherche
    let filteredComptes = this.allComptes;
    
    // Filtrage par pays sélectionnés (seulement si des pays sont sélectionnés)
    if (this.selectedCountries.length > 0) {
      filteredComptes = this.allComptes.filter(compte => {
        // Optimisation: éviter les appels répétés pour les comptes invalides
        if (!compte || !compte.denomination) {
          return false;
        }
        
        const countryId = this.getCompteCountryId(compte);
        return countryId ? this.selectedCountries.includes(countryId) : false;
      });
    }
    
    // Filtrage par recherche de cuisiniers
    if (this.searchCooker.trim()) {
      filteredComptes = filteredComptes.filter(compte => 
        compte.denomination?.toLowerCase().includes(this.searchCooker.toLowerCase())
      );
    }
    
    this.filteredComptes = filteredComptes;

    // Filtrer les recettes partagées par cuisiniers sélectionnés ET par recherche
    let recipesToFilter = this.allRecipes.filter(recipe => recipe.share === true);
    
    // Filtrage par cuisiniers sélectionnés
    if (this.selectedCookers.length > 0) {
      recipesToFilter = recipesToFilter.filter(recipe => {
        // Utiliser compteuser_id en priorité, puis user.id en fallback
        const compteUserId = recipe.compteuser_id || recipe.user?.id;
        return this.selectedCookers.includes(compteUserId || 0);
      });
    }
    
    // Filtrage par recherche de recettes
    if (this.searchRecipe.trim()) {
      recipesToFilter = recipesToFilter.filter(recipe => 
        (recipe.name || '').toLowerCase().includes(this.searchRecipe.toLowerCase())
      );
    }
    
    this.filteredRecipes = recipesToFilter;
  }

  // Méthodes de recherche
  onCountrySearch() {
    this.applyFilters();
  }

  onCookerSearch() {
    this.applyFilters();
  }

  onRecipeSearch() {
    this.applyFilters();
  }

  getImageUrl(filename: string): string {
    // Utiliser la route uploaddir du backend
    if (filename && filename.trim() !== '') {
      return `${environment.apiUrl}/compteuser/uploaddir/${filename}`;
    }
    return 'assets/images/default-logo.png'; // Image par défaut si pas de photo
  }


  getCompteName(recipe: Recipe): string {
    // Utiliser directement le champ compteuser_id si disponible
    if (recipe.compteuser_id) {
      const compte = this.allComptes.find(c => c.id === recipe.compteuser_id);
      if (compte) {
        console.log('Recette:', recipe.name, 'CompteUser ID:', recipe.compteuser_id, 'Compte trouvé:', compte.denomination);
        return compte.denomination || 'Compte inconnu';
      }
    }
    
    // Fallback: utiliser l'ancienne logique avec user.id
    if (recipe.user?.id) {
      // Méthode 1: Utiliser le mapping des utilisateurs
      for (const [compteId, userIds] of this.userMapping.entries()) {
        if (userIds.includes(recipe.user.id)) {
          const compte = this.allComptes.find(c => c.id === compteId);
          if (compte) {
            console.log('Recette:', recipe.name, 'User ID:', recipe.user.id, 'Compte trouvé via mapping:', compte.denomination);
            return compte.denomination || 'Compte inconnu';
          }
        }
      }
      
      // Méthode 2: Chercher par user (relation directe) - fallback
      let compte = this.allComptes.find(c => {
        return c.user && c.user.id === recipe.user?.id;
      });
      
      if (compte) {
        console.log('Recette:', recipe.name, 'User ID:', recipe.user?.id, 'Compte trouvé via user:', compte.denomination);
        return compte.denomination || 'Compte inconnu';
      }
    }
    
    console.log('Aucun compte trouvé pour la recette:', recipe.name, 'CompteUser ID:', recipe.compteuser_id, 'User ID:', recipe.user?.id);
    return 'Compte inconnu';
  }

  getCompteCountryId(compte: CompteUserModel): number | null {
    // Cas 1: country est un objet avec id
    if (compte.country && typeof compte.country === 'object' && compte.country.id) {
      return compte.country.id;
    }
    // Cas 2: country est directement un id
    else if (compte.country && typeof compte.country === 'number') {
      return compte.country;
    }
    // Cas 3: address contient country
    else if (compte.address && typeof compte.address === 'object' && (compte.address as any).country) {
      const addressCountry = (compte.address as any).country;
      if (addressCountry.id) {
        return addressCountry.id;
      } else if (typeof addressCountry === 'number') {
        return addressCountry;
      }
    }
    return null;
  }

  getCompteCountry(compte: CompteUserModel): string {
    console.log('🔍 getCompteCountry - Compte:', compte?.denomination, 'Country:', compte?.country, 'Type:', typeof compte?.country);
    
    // Vérifier si country existe et a une propriété name
    if (compte?.country && typeof compte.country === 'object' && compte.country.name) {
      return compte.country.name;
    }
    // Si country est directement une string
    if (compte?.country && typeof compte.country === 'string') {
      return compte.country;
    }
    
    // Vérifier si address existe et contient country
    if (compte?.address && typeof compte.address === 'object' && (compte.address as any).country) {
      const addressCountry = (compte.address as any).country;
      console.log('🔍 Address country:', addressCountry);
      if (addressCountry.name) {
        return addressCountry.name;
      } else if (typeof addressCountry === 'string') {
        return addressCountry;
      }
    }
    
    console.log('🔍 Aucun pays trouvé pour:', compte?.denomination);
    return 'Pays non défini';
  }

  getRecipeCountry(recipe: Recipe): string {
    // Utiliser directement le champ compteuser_id si disponible
    if (recipe.compteuser_id) {
      const compte = this.allComptes.find(c => c.id === recipe.compteuser_id);
      if (compte) {
        console.log('🔍 Compte trouvé pour le pays:', compte.denomination, 'Country:', compte.country);
        return this.getCompteCountry(compte);
      }
    }
    
    // Fallback: utiliser l'ancienne logique avec user.id
    if (recipe.user?.id) {
      // Méthode 1: Utiliser le mapping des utilisateurs
      for (const [compteId, userIds] of this.userMapping.entries()) {
        if (userIds.includes(recipe.user.id)) {
          const compte = this.allComptes.find(c => c.id === compteId);
          if (compte) {
            return this.getCompteCountry(compte);
          }
        }
      }
      
      // Méthode 2: Chercher par user (relation directe) - fallback
      let compte = this.allComptes.find(c => {
        return c.user && c.user.id === recipe.user?.id;
      });
      
      if (compte) {
        return this.getCompteCountry(compte);
      }
    }
    
    return 'Pays inconnu';
  }

  getRecipeImage(recipe: Recipe): string {
    // Retourner l'image de la recette si disponible, sinon une image par défaut
    if (recipe.photo && recipe.photo.trim() !== '') {
      return `${environment.apiUrl}/recipe/uploaddir/${recipe.photo}`;
    }
    return 'assets/images/default-recipe.jpg';
  }

  getPreparationTime(recipe: Recipe): string {
    // Afficher le contenu du champ detailCuisine
    if (recipe.detailCuisine && recipe.detailCuisine.trim() !== '') {
      // Limiter la longueur pour l'affichage dans la carte
      const maxLength = 100;
      if (recipe.detailCuisine.length > maxLength) {
        return recipe.detailCuisine.substring(0, maxLength) + '...';
      }
      return recipe.detailCuisine;
    }
    return 'Aucun détail de préparation'; // Valeur par défaut si pas de détail
  }

  getDifficulty(recipe: Recipe): string {
    // Utiliser une logique basée sur les propriétés existantes
    if ((recipe.detailList || []) && (recipe.detailList || []).length > 5) {
      return 'Difficile';
    } else if ((recipe.detailList || []) && (recipe.detailList || []).length > 2) {
      return 'Moyen';
    }
    return 'Facile'; // Valeur par défaut
  }

  async duplicateRecipe(recipe: Recipe) {
    console.log('Début de la duplication de recette:', recipe);
    
    const user = this.tokenService.getUser();
    console.log('Utilisateur connecté:', user);
    
    if (!user) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Vous devez être connecté pour dupliquer une recette'
      });
      return;
    }

    // Vérifier que la recette a un uniquecode
    if (!recipe.uniquecode || recipe.uniquecode.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'La recette sélectionnée n\'a pas de code unique valide'
      });
      return;
    }

    console.log('🔍 Vérification d\'existence - Recette uniquecode:', recipe.uniquecode, 'User ID:', user.id);

    try {
      // Message de début de processus
      this.messageService.add({
        severity: 'info',
        summary: 'Vérification en cours...',
        detail: `Vérification de l'existence de la recette "${recipe.name}"...`
      });

      console.log('🔍 Contrôle d\'existence basé sur uniquecode et compteuser_id...');
      
      // Trouver le compte utilisateur (CompteUser) de l'utilisateur connecté
      let userCompteId: number | null = null;
      
      // Méthode 1: Chercher via le mapping des utilisateurs
      for (const [compteId, userIds] of this.userMapping.entries()) {
        if (userIds.includes(user.id)) {
          userCompteId = compteId;
          console.log('✅ Compte utilisateur trouvé via mapping:', userCompteId);
          break;
        }
      }
      
      // Méthode 2: Chercher directement dans allComptes par user.id (fallback)
      if (!userCompteId) {
        const userCompte = this.allComptes.find(c => {
          // Vérifier si le compte a un user avec l'ID correspondant
          if (c.user && typeof c.user === 'object' && c.user.id === user.id) {
            return true;
          }
          // Vérifier si le compte a une liste d'utilisateurs (propriété dynamique)
          const compteAny = c as any;
          if (compteAny.userList && Array.isArray(compteAny.userList)) {
            return compteAny.userList.some((u: any) => u.id === user.id);
          }
          return false;
        });
        
        if (userCompte && userCompte.id) {
          userCompteId = userCompte.id;
          console.log('✅ Compte utilisateur trouvé via recherche directe:', userCompteId);
        }
      }
      
      // Méthode 3: Si user a directement un compteuser_id (cas où user contient cette info)
      if (!userCompteId && user.compteuser_id) {
        userCompteId = user.compteuser_id;
        console.log('✅ Compte utilisateur trouvé via user.compteuser_id:', userCompteId);
      }
      
      if (!userCompteId) {
        console.error('❌ Impossible de trouver le compte utilisateur pour l\'utilisateur connecté');
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de déterminer votre compte utilisateur. Veuillez vous reconnecter.'
        });
        return;
      }
      
      console.log('🔍 Compte utilisateur ID pour la vérification:', userCompteId);
      
      // Récupérer toutes les recettes
      const existingRecipes = await this.recipeService.getAll();
      console.log('📋 Toutes les recettes disponibles:', existingRecipes.length);
      
      // Filtrer les recettes du compte utilisateur connecté
      const userRecipes = existingRecipes.filter(r => {
        // Vérifier par compteuser_id en priorité
        if (r.compteuser_id === userCompteId) {
          return true;
        }
        // Fallback: vérifier par user.id si le compte correspond
        if (r.user?.id === user.id) {
          // Vérifier que cette recette appartient bien au compte utilisateur
          const recipeCompte = this.allComptes.find(c => {
            if (c.user && typeof c.user === 'object' && c.user.id === user.id) {
              return c.id === userCompteId;
            }
            const compteAny = c as any;
            if (compteAny.userList && Array.isArray(compteAny.userList)) {
              return compteAny.userList.some((u: any) => u.id === user.id) && c.id === userCompteId;
            }
            return false;
          });
          return !!recipeCompte;
        }
        return false;
      });
      
      console.log('👤 Recettes du compte utilisateur connecté:', userRecipes.length);
      console.log('🔍 Recettes du compte utilisateur (détails):', userRecipes.map(r => ({
        id: r.id,
        name: r.name,
        uniquecode: r.uniquecode,
        compteuser_id: r.compteuser_id,
        user_id: r.user?.id
      })));
      
      // Vérifier si une recette avec le même uniquecode existe déjà
      const duplicateExists = userRecipes.some(r => r.uniquecode === recipe.uniquecode);
      console.log('🔍 Doublon trouvé (uniquecode):', duplicateExists);
      
      if (duplicateExists) {
        const existingRecipe = userRecipes.find(r => r.uniquecode === recipe.uniquecode);
        this.messageService.add({
          severity: 'warn',
          summary: 'Recette déjà existante',
          detail: `Vous avez déjà une recette avec le code unique "${recipe.uniquecode}" dans vos recettes (${existingRecipe?.name}). La copie a été annulée.`
        });
        return;
      }

      // Afficher un dialogue de confirmation
      this.messageService.add({
        severity: 'info',
        summary: 'Confirmation de copie',
        detail: `Voulez-vous copier la recette "${recipe.name}" dans vos recettes ? (Elle ne sera pas marquée comme propriétaire)`,
        key: 'confirmDialog'
      });

      // Simuler une confirmation (vous pouvez remplacer par un vrai dialogue)
      const confirmed = confirm(`Voulez-vous copier la recette "${recipe.name}" dans vos recettes ?\n\nNote: La recette copiée ne sera pas marquée comme propriétaire (owner: false).`);
      
      if (!confirmed) {
        return;
      }

      // Message de début de processus de copie
      this.messageService.add({
        severity: 'info',
        summary: 'Copie en cours...',
        detail: `Copie de la recette "${recipe.name}" en cours...`
      });

      console.log('Utilisation du nouvel endpoint de copie...');
      console.log('URL de copie:', `${environment.apiUrl}/recipe/copy/${recipe.id}/${user.id}`);
      console.log('Utilisateur ID:', user.id);
      console.log('Recette ID:', recipe.id);
      
      // Utiliser le nouvel endpoint de copie qui gère automatiquement compteuser_id
      const copyResult = await this.http.post<any>(
        `${environment.apiUrl}/recipe/copy/${recipe.id}/${user.id}`,
        {}
      ).toPromise().catch(error => {
        console.error('Erreur HTTP lors de la copie:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('URL:', error.url);
        throw new Error(`Erreur de connexion: ${error.message || 'Serveur inaccessible'}`);
      });
      
      console.log('Résultat de la copie:', copyResult);
      
      // Le backend retourne directement les données ou une structure avec data
      let createdRecipe;
      if (copyResult && copyResult.data) {
        createdRecipe = copyResult.data;
      } else if (copyResult && copyResult.id) {
        createdRecipe = copyResult;
      } else {
        throw new Error('Erreur lors de la copie de la recette - format de réponse inattendu');
      }
      console.log('Recette copiée avec succès:', createdRecipe);
      
      // Le nouvel endpoint gère automatiquement la copie complète
      const recipeId = createdRecipe.id;
      console.log('ID de la recette copiée:', recipeId);
      
      // Vérification finale
      const finalCheck = await this.recipeService.getById(recipeId);
      const ownerStatus = finalCheck?.owner === true ? 'propriétaire' : 'copie';
      
      this.messageService.add({
        severity: 'success',
        summary: 'Recette copiée avec succès',
        detail: `La recette "${recipe.name}" a été copiée dans vos recettes avec tous ses ingrédients. Type: ${ownerStatus}`
      });
      
      console.log('✅ Copie terminée - Recette ID:', recipeId, 'Owner:', finalCheck?.owner);

    } catch (error: any) {
      console.error('Erreur lors de la duplication:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur lors de la copie',
        detail: `Impossible de copier la recette "${recipe.name}": ${error.message || error}`
      });
    }
  }

  // Méthode pour trouver ou créer un produit pour l'utilisateur
  private async findOrCreateProductForUser(originalProduct: Product, userId: number): Promise<Product> {
    try {
      console.log('Recherche/création du produit pour l\'utilisateur:', originalProduct.name, 'User ID:', userId);
      
      // Récupérer l'utilisateur actuel
      const currentUser = this.tokenService.getUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('Utilisateur non authentifié');
      }
      
      // Chercher si l'utilisateur a déjà un produit avec le même nom
      const userProducts = await this.productService.getAll(currentUser.id);
      console.log('Produits existants pour l\'utilisateur:', userProducts.length);
      
      const existingProduct = userProducts.find(p => p.name === originalProduct.name);
      
      if (existingProduct) {
        console.log('✅ Produit existant trouvé:', existingProduct);
        return existingProduct;
      }

      console.log('Création d\'un nouveau produit pour l\'utilisateur...');
      
      // Créer un nouveau produit pour l'utilisateur
      const newProduct = new Product();
      newProduct.name = originalProduct.name;
      newProduct.description = originalProduct.description || '';
      newProduct.unit = originalProduct.unit;
      newProduct.price = originalProduct.price || 0;
      newProduct.category = originalProduct.category;
      newProduct.conditioning = originalProduct.conditioning;
      newProduct.isActive = true;
      newProduct.lossPercentage = originalProduct.lossPercentage || 0;
      
      // L'utilisateur et le CompteUser seront automatiquement assignés par le backend
      // basé sur le token d'authentification

      console.log('Nouveau produit à créer:', newProduct);
      const createdProduct = await this.productService.create(newProduct);
      console.log('✅ Nouveau produit créé pour l\'utilisateur:', createdProduct);
      
      this.messageService.add({
        severity: 'info',
        summary: 'Nouveau produit créé',
        detail: `Le produit "${newProduct.name}" a été créé dans votre inventaire`
      });
      
      return createdProduct;

    } catch (error) {
      console.error('❌ Erreur lors de la création/récupération du produit:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur produit',
        detail: `Impossible de créer le produit "${originalProduct.name}": ${errorMessage}`
      });
      throw error;
    }
  }

  viewAllRecipes() {
    // Afficher l'interface de toutes les recettes
    this.showAllRecipes = true;
    this.loadAllSharedRecipes();
  }

  loadAllSharedRecipes() {
    this.loading = true;
    this.recipeService.getAll().then(
      (data: Recipe[]) => {
        // Filtrer seulement les recettes partagées (share = true)
        this.allSharedRecipes = data.filter(recipe => recipe.share === true);
        this.filteredAllRecipes = [...this.allSharedRecipes];
        this.loading = false;
        console.log('Recettes partagées chargées:', this.allSharedRecipes.length);
      },
      (error: any) => {
        console.error('Erreur lors du chargement des recettes partagées:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les recettes partagées'
        });
      }
    );
  }

  onAllRecipesSearch() {
    if (!this.searchAllRecipes.trim()) {
      this.filteredAllRecipes = [...this.allSharedRecipes];
    } else {
      const searchTerm = this.searchAllRecipes.toLowerCase();
      this.filteredAllRecipes = this.allSharedRecipes.filter(recipe => {
        const recipeName = (recipe.name || '').toLowerCase().includes(searchTerm);
        const compteName = this.getCompteName(recipe).toLowerCase().includes(searchTerm);
        const compteUserId = recipe.compteuser_id ? recipe.compteuser_id.toString().includes(searchTerm) : false;
        const countryName = this.getRecipeCountry(recipe).toLowerCase().includes(searchTerm);
        
        return recipeName || compteName || compteUserId || countryName;
      });
    }
  }

  closeAllRecipes() {
    this.showAllRecipes = false;
    this.searchAllRecipes = '';
    this.filteredAllRecipes = [];
    this.selectedRecipeForDetail = null;
  }

  async selectRecipeForDetail(recipe: Recipe) {
    console.log('🔍 Sélection de la recette pour détail:', recipe.name);
    this.selectedRecipeForDetail = recipe;
    
    // Charger les détails de la recette (ingrédients)
    try {
      this.loading = true;
      const details = await this.detailsrecipeService.byRecipe(recipe.id);
      console.log('✅ Détails de la recette chargés:', details);
      
      // Ajouter les détails à la recette sélectionnée
      this.selectedRecipeForDetail.detailList = details;
      
      if (!details || details.length === 0) {
        console.log('⚠️ Aucun ingrédient trouvé pour cette recette');
        this.messageService.add({
          severity: 'info',
          summary: 'Information',
          detail: 'Aucun ingrédient trouvé pour cette recette'
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des détails:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les détails de la recette'
      });
    } finally {
      this.loading = false;
    }
  }

  shareRecipe(recipe: Recipe) {
    console.log('📤 Partage de la recette:', recipe.name);
    // Ici vous pouvez implémenter la logique de partage
    this.messageService.add({
      severity: 'info',
      summary: 'Partage',
      detail: `Fonctionnalité de partage pour "${recipe.name}" en cours de développement`
    });
  }

  trackByRecipeId(index: number, recipe: Recipe): any {
    return recipe.id;
  }

  onImageError(event: any) {
    console.log('Erreur lors du chargement de l\'image:', event);
    // Image de fallback
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBMMTUwIDEwMEgxMjVWMTUwSDc1VjEwMEg1MEwxMDAgNTBaIiBmaWxsPSIjQ0NDQ0NDIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K';
  }

  resetFilters() {
    // Réinitialiser tous les filtres
    this.selectedCountries = [];
    this.selectedCookers = [];
    this.searchCountry = '';
    this.searchCooker = '';
    this.searchRecipe = '';
    
    // Réinitialiser les listes filtrées
    this.filteredCountries = this.countries;
    this.filteredComptes = this.allComptes;
    this.filteredRecipes = this.allRecipes;
    
    // Décocher toutes les cases
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = false;
    });
    
    // Vider les champs de recherche
    const searchInputs = document.querySelectorAll('input[type="text"]');
    searchInputs.forEach((input: any) => {
      input.value = '';
    });
    
    console.log('Tous les filtres ont été réinitialisés');
  }

  openSettings() {
    this.messageService.add({
      severity: 'info',
      summary: 'Paramètres',
      detail: 'Fonctionnalité de paramètres à implémenter'
    });
  }

  async openRecipeDetail(recipe: Recipe) {
    console.log('🍽️ Ouverture des détails de la recette:', recipe.name, '(ID:', recipe.id, ')');
    
    this.selectedRecipe = recipe;
    this.showRecipeDetail = true;
    
    // Charger les détails de la recette
    try {
      this.recipeDetails = await this.detailsrecipeService.byRecipe(recipe.id);
      
      if (!this.recipeDetails || this.recipeDetails.length === 0) {
        console.log('⚠️ Aucun ingrédient trouvé pour cette recette');
        this.messageService.add({
          severity: 'warn',
          summary: 'Information',
          detail: 'Aucun ingrédient trouvé pour cette recette'
        });
      } else {
        console.log('✅ Ingrédients chargés avec succès:', this.recipeDetails.length);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des détails:', error);
      this.recipeDetails = [];
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les détails de la recette'
      });
    }
  }

  closeRecipeDetail() {
    this.showRecipeDetail = false;
    this.selectedRecipe = null;
    this.recipeDetails = [];
  }

  getRecipeImageForPopup() {
    if (this.selectedRecipe?.photo && this.selectedRecipe.photo.trim() !== '') {
      return `${environment.apiUrl}/recipe/uploaddir/${this.selectedRecipe.photo}`;
    }
    return 'assets/images/default-recipe.jpg';
  }

  onImageErrorPopup(event: any) {
    console.log('Erreur lors du chargement de l\'image:', event);
    event.target.src = 'assets/images/default-recipe.jpg';
  }

  onImageLoadPopup(event: any) {
    console.log('Image chargée avec succès');
  }

}
