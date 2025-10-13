import { AppAddEmployeeComponent } from './../apps/employee/add/add.component';
import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
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
import { Recipe } from 'src/app/services/recipe/Recipe';
import { Country } from 'src/app/services/country/Country';
import { CompteUserService } from 'src/app/services/compteuser/compteuser.service';

// Interface temporaire pour CompteUser
interface CompteUser {
  id?: number;
  denomination?: string;
  typeCompte?: string;
  address?: string;
  photo?: string;
  country?: any;
  user?: any;
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
  ],
  providers: [DatePipe, MessageService],
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.scss'
})
export class AcceuilComponent implements OnInit {

  // Données
  countries: Country[] = [];
  filteredCountries: Country[] = [];
  allComptes: CompteUser[] = [];
  filteredComptes: CompteUser[] = [];
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

  constructor(
    private countryService: CountryService,
    private recipeService: RecipeService,
    private tokenService: TokenService,
    private messageService: MessageService,
    private compteUserService: CompteUserService
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
      (data: CompteUser[]) => {
        this.allComptes = data;
        this.filteredComptes = data;
        console.log('Comptes chargés:', data);
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
    if (event.target.checked) {
      this.selectedCountries.push(countryId);
    } else {
      this.selectedCountries = this.selectedCountries.filter(id => id !== countryId);
    }
    this.applyFilters();
  }

  onCookerFilterChange(event: any) {
    const cookerId = parseInt(event.target.value);
    if (event.target.checked) {
      this.selectedCookers.push(cookerId);
    } else {
      this.selectedCookers = this.selectedCookers.filter(id => id !== cookerId);
    }
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
      filteredComptes = this.allComptes.filter(compte => 
        this.selectedCountries.includes(compte.country?.id || 0)
      );
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
      return `http://localhost:8080/compteuser/uploaddir/${filename}`;
    }
    return 'assets/images/default-logo.png'; // Image par défaut si pas de photo
  }

  onImageError(event: any) {
    // En cas d'erreur de chargement d'image, afficher un placeholder
    event.target.style.display = 'none';
    const placeholder = event.target.nextElementSibling;
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  }

  getCompteName(recipe: Recipe): string {
    // Trouver le compte correspondant à l'utilisateur de la recette
    const compte = this.allComptes.find(c => c.user?.id === recipe.user?.id);
    return compte?.denomination || 'Compte inconnu';
  }

  getRecipeImage(recipe: Recipe): string {
    // Retourner une image par défaut ou l'image de la recette si disponible
    return 'assets/images/default-recipe.jpg';
  }

  getPreparationTime(recipe: Recipe): string {
    // Utiliser une logique basée sur les propriétés existantes ou des valeurs par défaut
    if (recipe.ratio && recipe.ratio > 0) {
      // Estimation basée sur le ratio (exemple)
      return Math.round(recipe.ratio * 30).toString();
    }
    return '30'; // Valeur par défaut
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
    const user = this.tokenService.getUser();
    if (!user) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Vous devez être connecté pour dupliquer une recette'
      });
      return;
    }

    // Message d'interdiction de copie
    this.messageService.add({
      severity: 'warn',
      summary: 'Copie non autorisée',
      detail: 'Vous ne pouvez pas copier cette recette. Cette fonctionnalité est temporairement désactivée.'
    });
    
    // Simuler un échec pour tester les messages d'erreur
    setTimeout(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Échec de la copie',
        detail: 'La copie de la recette a échoué. Veuillez réessayer plus tard.'
      });
    }, 1000);
    
    return;

    // Code commenté pour référence future
    /*
    // Vérifier si une recette avec le même code existe déjà chez l'utilisateur
    try {
      const existingRecipes = await this.recipeService.getAll();
      const userRecipes = existingRecipes.filter(r => r.user?.id === user.id);
      const duplicateExists = userRecipes.some(r => r.code === recipe.code);
      
      if (duplicateExists) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Recette déjà existante',
          detail: `Vous avez déjà une recette avec le code "${recipe.code}" dans vos recettes`
        });
        return;
      }

      // Créer une copie de la recette
      const duplicatedRecipe = new Recipe();
      duplicatedRecipe.name = `${recipe.name} (Copie)`;
      duplicatedRecipe.code = recipe.code; // Conserver le même code original
      duplicatedRecipe.detailCuisine = recipe.detailCuisine;
      duplicatedRecipe.ratio = recipe.ratio;
      duplicatedRecipe.user = { id: user.id };
      duplicatedRecipe.owner = true;
      duplicatedRecipe.share = false;

      this.recipeService.create(duplicatedRecipe).then(
        (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `La recette "${recipe.name}" a été ajoutée à vos recettes`
          });
          console.log('Recette dupliquée:', data);
        },
        (error) => {
          console.error('Erreur lors de la duplication:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de dupliquer la recette'
          });
        }
      );
    } catch (error) {
      console.error('Erreur lors de la vérification des recettes existantes:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de vérifier les recettes existantes'
      });
    }
    */
  }

  viewAllRecipes() {
    // Réinitialiser tous les filtres
    this.selectedCountries = [];
    this.selectedCookers = [];
    this.filteredComptes = this.allComptes;
    this.filteredRecipes = this.allRecipes;
    
    // Décocher toutes les cases
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = false;
    });
  }

  openSettings() {
    this.messageService.add({
      severity: 'info',
      summary: 'Paramètres',
      detail: 'Fonctionnalité de paramètres à implémenter'
    });
  }

  openRecipeDetail(recipe: Recipe) {
    // Ouvrir le détail de la recette
    console.log('Recette sélectionnée:', recipe);
    
    // Afficher les détails de la recette dans un message
    this.messageService.add({
      severity: 'info',
      summary: `Détail de la recette: ${recipe.name}`,
      detail: `
        Code: ${recipe.code}
        Préparation: ${this.getPreparationTime(recipe)} min
        Difficulté: ${this.getDifficulty(recipe)}
        Auteur: ${recipe.user?.nom || 'Anonyme'}
        Compte: ${this.getCompteName(recipe)}
        Partagée: ${recipe.share ? 'Oui' : 'Non'}
        Propriétaire: ${recipe.owner ? 'Oui' : 'Non'}
      `
    });
  }

}
