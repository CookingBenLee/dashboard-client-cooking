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
    this.http.get<any>('http://localhost:5000/compteuser/with-users').subscribe({
      next: (response: any) => {
        console.log('Réponse du serveur:', response);
        
        if (response.data && response.data.comptes) {
          this.allComptes = response.data.comptes;
          this.filteredComptes = response.data.comptes;
          
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
        // Vérifier si le compte appartient à l'un des pays sélectionnés
        // Utiliser directement le champ country du service
        if (compte.country && compte.country.id) {
          return this.selectedCountries.includes(compte.country.id);
        }
        return false;
      });
      console.log('Pays sélectionnés:', this.selectedCountries);
      console.log('Comptes filtrés par pays:', filteredComptes.length);
      console.log('Détail des comptes filtrés:', filteredComptes.map(c => ({
        id: c.id,
        denomination: c.denomination,
        country: c.country
      })));
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
      recipesToFilter = recipesToFilter.filter(recipe => 
        this.selectedCookers.includes(recipe.user?.id || 0)
      );
    }
    
    // Filtrage par recherche de recettes
    if (this.searchRecipe.trim()) {
      recipesToFilter = recipesToFilter.filter(recipe => 
        recipe.name.toLowerCase().includes(this.searchRecipe.toLowerCase())
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
      return `http://localhost:5000/compteuser/uploaddir/${filename}`;
    }
    return 'assets/images/default-logo.png'; // Image par défaut si pas de photo
  }


  getCompteName(recipe: Recipe): string {
    if (!recipe.user?.id) {
      return 'Utilisateur inconnu';
    }
    
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
    
    // Méthode 3: Fallback si aucune relation trouvée
    if (!compte) {
      console.log('Aucun compte trouvé pour l\'utilisateur:', recipe.user?.id);
    }
    
    console.log('Recette:', recipe.name, 'User ID:', recipe.user?.id, 'Compte trouvé:', compte?.denomination);
    console.log('Mapping disponible:', Array.from(this.userMapping.entries()));
    
    return compte?.denomination || 'Compte inconnu';
  }

  getCompteCountry(compte: CompteUserModel): string {
    // Dans le service, address est un string, pas un objet
    // Utiliser directement le champ country
    if (compte.country) {
      return compte.country.name || 'N/A';
    }
    return 'N/A';
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
    if (recipe.detailList && recipe.detailList.length > 5) {
      return 'Difficile';
    } else if (recipe.detailList && recipe.detailList.length > 2) {
      return 'Moyen';
    }
    return 'Facile'; // Valeur par défaut
  }

  async duplicateRecipe(recipe: Recipe) {
    console.log('Début de la duplication de recette:', recipe);
    
    // Test des messages
    this.messageService.add({
      severity: 'info',
      summary: 'Test',
      detail: 'Test des messages - fonction de copie démarrée'
    });
    
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

    try {
      // Message de début de processus
      this.messageService.add({
        severity: 'info',
        summary: 'Copie en cours...',
        detail: `Copie de la recette "${recipe.name}" en cours...`
      });

      console.log('Vérification des recettes existantes...');
      
      // Vérifier si une recette avec le même code existe déjà chez l'utilisateur
      const existingRecipes = await this.recipeService.getAll();
      console.log('Toutes les recettes:', existingRecipes);
      
      const userRecipes = existingRecipes.filter(r => r.user?.id === user.id);
      console.log('Recettes de l\'utilisateur:', userRecipes);
      
      const duplicateExists = userRecipes.some(r => r.code === recipe.code);
      console.log('Doublon trouvé:', duplicateExists);
      
      if (duplicateExists) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Recette déjà existante',
          detail: `Vous avez déjà une recette avec le code "${recipe.code}" dans vos recettes. La copie a été annulée.`
        });
        return;
      }

      console.log('Création de la recette dupliquée...');
      
      // Créer une copie de la recette avec tous les champs requis
      const duplicatedRecipe = new Recipe();
      duplicatedRecipe.name = recipe.name; // Garder le nom original sans "(Copie)"
      duplicatedRecipe.code = recipe.code; // Garder le même code unique
      duplicatedRecipe.detailCuisine = recipe.detailCuisine || '';
      duplicatedRecipe.ratio = recipe.ratio || 1;
      duplicatedRecipe.principaleRecipe = false;
      duplicatedRecipe.createdDate = new Date();
      duplicatedRecipe.isDeleted = false;
      duplicatedRecipe.share = false;
      duplicatedRecipe.owner = false; // Toujours false pour une recette copiée
      duplicatedRecipe.user = { id: user.id };
      duplicatedRecipe.categoryRecipe = recipe.categoryRecipe;
      duplicatedRecipe.cout = recipe.cout || 0;
      duplicatedRecipe.brut = recipe.brut || 0;
      duplicatedRecipe.net = recipe.net || 0;
      duplicatedRecipe.stock = 0; // Stock à 0 comme demandé
      duplicatedRecipe.stockApres = 0; // Stock après à 0
      duplicatedRecipe.qteEstimee = recipe.qteEstimee || 0;
      duplicatedRecipe.lossPercentage = recipe.lossPercentage || 0;
      duplicatedRecipe.photo = recipe.photo; // Copier la photo de la recette
      
      // Forcer explicitement owner à false AVANT la création
      console.log('Valeur de owner AVANT création:', duplicatedRecipe.owner);
      duplicatedRecipe.owner = false;
      console.log('Valeur de owner APRÈS forçage:', duplicatedRecipe.owner);

      console.log('Recette à créer:', duplicatedRecipe);
      console.log('Vérification du champ owner avant création:', duplicatedRecipe.owner);

      // Créer la recette principale
      const createdRecipe = await this.recipeService.create(duplicatedRecipe);
      console.log('Recette créée avec succès:', createdRecipe);
      
      // Le backend retourne {data: {...}, status: 202, message: 'ok'}
      // Il faut extraire l'ID de la réponse
      let recipeId = null;
      if (createdRecipe && createdRecipe.data && createdRecipe.data.id) {
        recipeId = createdRecipe.data.id;
        console.log('ID de la recette créée:', recipeId);
      } else {
        console.error('Impossible de récupérer l\'ID de la recette créée');
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de récupérer l\'ID de la recette créée'
        });
        return;
      }

      // Forcer la mise à jour du champ owner à false
      try {
        console.log('Forçage du champ owner à false...');
        
        // Récupérer la recette complète d'abord
        const recipeToUpdate = await this.recipeService.getById(recipeId);
        if (recipeToUpdate) {
          console.log('Recette récupérée avant mise à jour:', recipeToUpdate);
          console.log('Valeur owner avant mise à jour:', recipeToUpdate.owner);
          
          // Modifier seulement le champ owner
          recipeToUpdate.owner = false;
          console.log('Valeur owner après modification locale:', recipeToUpdate.owner);
          
          // Mettre à jour la recette
          const updateResult = await this.recipeService.update(recipeId, recipeToUpdate);
          console.log('Résultat de la mise à jour:', updateResult);
          
          // Vérifier que la mise à jour a bien fonctionné
          const updatedRecipe = await this.recipeService.getById(recipeId);
          console.log('Recette après mise à jour owner:', updatedRecipe);
          console.log('Valeur du champ owner après mise à jour:', updatedRecipe?.owner);
          
          if (updatedRecipe?.owner === false) {
            console.log('✅ Champ owner correctement défini à false');
          } else {
            console.log('❌ Champ owner toujours à true, nouvelle tentative...');
            
            // Nouvelle tentative avec une approche différente
            const retryRecipe = await this.recipeService.getById(recipeId);
            retryRecipe.owner = false;
            await this.recipeService.update(recipeId, retryRecipe);
            
            const finalRecipe = await this.recipeService.getById(recipeId);
            console.log('Valeur finale du champ owner:', finalRecipe?.owner);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du champ owner:', error);
        this.messageService.add({
          severity: 'warn',
          summary: 'Avertissement',
          detail: 'Impossible de définir la recette comme non-propriétaire'
        });
      }

      // Récupérer les détails complets de la recette originale
      console.log('📋 Récupération des ingrédients de la recette originale:', recipe.name);
      
      const originalRecipeDetails = await this.detailsrecipeService.byRecipe(recipe.id);
      console.log('📊 Ingrédients trouvés dans la recette originale:', originalRecipeDetails?.length || 0);
      
      if (!originalRecipeDetails || originalRecipeDetails.length === 0) {
        console.log('⚠️ Aucun ingrédient trouvé dans la recette originale');
        this.messageService.add({
          severity: 'warn',
          summary: 'Attention',
          detail: 'La recette originale ne contient aucun ingrédient'
        });
      }

      // Copier les détails de la recette (ingrédients/produits)
      if (originalRecipeDetails && originalRecipeDetails.length > 0) {
        console.log('Copie des détails de la recette...');
        
        for (const detail of originalRecipeDetails) {
          try {
            // Créer ou récupérer le produit pour l'utilisateur
            let userProduct = await this.findOrCreateProductForUser(detail.ingredient || detail.product, user.id);
            console.log('Produit pour utilisateur trouvé/créé:', userProduct);
            
            // Créer le détail de recette
            const newDetail = new DetailsRecipe();
            newDetail.ingredient = userProduct;
            newDetail.product = userProduct;
            newDetail.proportion = detail.proportion;
            newDetail.preparationIngredient = detail.preparationIngredient;
            newDetail.recipe = { id: recipeId } as any;
            newDetail.isDeleted = false;
            newDetail.brut = 0; // Brut à 0 pour la nouvelle recette
            newDetail.net = 0; // Net à 0 pour la nouvelle recette
            newDetail.cout = 0; // Coût à 0 pour la nouvelle recette
            newDetail.stockApres = 0; // Stock après à 0
            newDetail.totalPrice = 0; // Prix total à 0
            newDetail.stock = 0; // Stock à 0

            console.log('Création du détail de recette:', newDetail);
            const createdDetail = await this.detailsrecipeService.create(newDetail);
            console.log('✅ Détail de recette créé avec succès:', createdDetail);
            
            this.messageService.add({
              severity: 'success',
              summary: 'Ingrédient copié',
              detail: `${userProduct.name} (${(detail.proportion * 100).toFixed(2)}%) copié avec succès`
            });
          } catch (error) {
            console.error('❌ Erreur lors de la copie de l\'ingrédient:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur copie ingrédient',
              detail: `Impossible de copier l'ingrédient: ${detail.ingredient?.name || 'Inconnu'}`
            });
          }
        }
      } else {
        console.log('Aucun détail de recette trouvé pour la recette originale');
        this.messageService.add({
          severity: 'warn',
          summary: 'Attention',
          detail: 'Aucun ingrédient trouvé dans la recette originale'
        });
      }

      // Récupérer les compositions de plats de la recette originale
      console.log('Récupération des compositions de plats de la recette originale...');
      const originalCompositions = await this.compositiondishesService.byRecipe(recipe.id);
      console.log('Compositions de la recette originale:', originalCompositions);

      // Copier les compositions de plats
      if (originalCompositions && originalCompositions.length > 0) {
        console.log('Copie des compositions de plats...');
        
        for (const composition of originalCompositions) {
          const newComposition = new CompositionDishes();
          newComposition.code = composition.code;
          newComposition.detail = composition.detail;
          newComposition.quantity = composition.quantity;
          newComposition.proportion = composition.proportion;
          newComposition.dishe = composition.dishe;
          newComposition.recipe = { id: recipeId } as any;
          newComposition.isDeleted = false;
          newComposition.cout = 0; // Coût à 0 pour la nouvelle recette
          newComposition.quantityKg = composition.quantityKg || 0;
          newComposition.qt = composition.qt || 0;

          await this.compositiondishesService.create(newComposition);
          console.log('Composition de plat créée:', newComposition);
        }
      }

      // Vérification finale de l'owner
      const finalCheck = await this.recipeService.getById(recipeId);
      const ownerStatus = finalCheck?.owner === false ? 'false' : 'true';
      
      this.messageService.add({
        severity: 'success',
        summary: 'Recette copiée avec succès',
        detail: `La recette "${recipe.name}" a été copiée dans vos recettes. Statut propriétaire: ${ownerStatus}`
      });
      
      console.log('Vérification finale - Owner de la recette copiée:', finalCheck?.owner);

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
      this.filteredAllRecipes = this.allSharedRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) ||
        this.getCompteName(recipe).toLowerCase().includes(searchTerm)
      );
    }
  }

  closeAllRecipes() {
    this.showAllRecipes = false;
    this.searchAllRecipes = '';
    this.filteredAllRecipes = [];
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
