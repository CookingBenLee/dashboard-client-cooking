# Page d'Accueil - Guide d'Utilisation

## 🎯 Fonctionnalités Implémentées

### 1. **Section Filtre (Gauche)**
- **Filtre par Pays** : Cases à cocher pour filtrer par pays (Mali, Belgique, etc.)
- **Liste des You Cookers** : Affichage des comptes utilisateurs avec :
  - Logo/photo de profil
  - Nom de l'entreprise/cuisinier
  - Cases à cocher pour sélectionner

### 2. **Section Principale (Droite)**
- **En-tête** : "RECHERCHE DE RECETTES"
- **Catégorie** : Bouton "Recettes Populaires"
- **Grille de Recettes** : Affichage en grille avec :
  - Image de la recette
  - Nom de la recette
  - Détails de préparation (temps, difficulté)
  - Bouton "+" pour dupliquer

### 3. **Fonctionnalités Interactives**
- **Filtrage en temps réel** : Les recettes se filtrent automatiquement selon les sélections
- **Duplication de recettes** : Bouton "+" pour ajouter une recette à son compte
- **Bouton "Voir toutes"** : Réinitialise tous les filtres
- **Bouton flottant** : Paramètres (à implémenter)

## 🛠️ Structure Technique

### **Composants**
- `AcceuilComponent` : Composant principal
- Template HTML avec structure responsive
- Styles SCSS modernes avec animations

### **Services Utilisés**
- `CountryService` : Gestion des pays
- `RecipeService` : Gestion des recettes
- `TokenService` : Authentification utilisateur
- `MessageService` : Notifications

### **Fonctionnalités Clés**
```typescript
// Filtrage par pays
onCountryFilterChange(event: any)

// Filtrage par cuisinier
onCookerFilterChange(event: any)

// Duplication de recette
duplicateRecipe(recipe: Recipe)

// Réinitialisation des filtres
viewAllRecipes()
```

## 🎨 Design

### **Couleurs**
- **En-têtes** : Bleu foncé (#2c3e50)
- **Boutons** : Bleu primaire (#007bff)
- **Bouton violet** : #6f42c1
- **Bouton flottant** : Cyan (#17a2b8)

### **Layout**
- **Desktop** : Sidebar + Main content
- **Mobile** : Layout vertical responsive
- **Grille** : Auto-fill avec minimum 280px par carte

## 📱 Responsive Design

```scss
@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .recipes-grid {
    grid-template-columns: 1fr;
  }
}
```

## 🔧 Configuration

### **Données Simulées**
Actuellement, les comptes utilisateurs utilisent des données simulées :
```typescript
this.allComptes = [
  { id: 1, denomination: 'You Cook', photo: 'logo1.jpg', country: { id: 1, name: 'Mali' } },
  { id: 2, denomination: 'Olive', photo: 'logo2.jpg', country: { id: 2, name: 'Belgique' } },
  { id: 3, denomination: 'Tima Cook', photo: 'logo3.jpg', country: { id: 1, name: 'Mali' } }
];
```

### **Images**
- **Logos** : `assets/images/logo1.jpg`, `logo2.jpg`, etc.
- **Recettes** : `assets/images/default-recipe.jpg`

## 🚀 Prochaines Étapes

1. **Intégration API** : Remplacer les données simulées par des appels API réels
2. **Gestion d'images** : Implémenter l'upload et l'affichage des images
3. **Pagination** : Ajouter la pagination pour les recettes
4. **Recherche** : Ajouter une barre de recherche
5. **Paramètres** : Implémenter le bouton flottant de paramètres

## 📋 Notes d'Implémentation

- **Filtrage** : Les filtres sont combinés (ET logique)
- **Duplication** : Crée une nouvelle recette avec `owner: true` et `share: false`
- **Notifications** : Utilise PrimeNG MessageService pour les feedbacks
- **Responsive** : Design adaptatif pour mobile et desktop
