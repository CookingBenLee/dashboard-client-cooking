import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Recipe, RecipeIngredient } from '../../services/recipe/Recipe';
import { RecipeHelperService } from '../../services/recipe/recipe-helper.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent implements OnInit {
  @Input() recipe?: Recipe;
  @Input() userId?: number;
  @Output() recipeSaved = new EventEmitter<Recipe>();
  @Output() recipeUpdated = new EventEmitter<Recipe>();

  recipeForm: FormGroup;
  selectedPhoto: File | null = null;
  photoPreview: string | null = null;
  isSubmitting = false;
  validationErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private recipeHelper: RecipeHelperService
  ) {
    this.recipeForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.recipe) {
      this.populateForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      preparationTime: [0, [Validators.min(0)]],
      cookingTime: [0, [Validators.min(0)]],
      difficulty: ['EASY', Validators.required],
      servings: [1, [Validators.required, Validators.min(1)]],
      detailCuisine: [''],
      status: ['DRAFT'],
      tags: [''],
      calories: [0, [Validators.min(0)]],
      protein: [0, [Validators.min(0)]],
      carbs: [0, [Validators.min(0)]],
      fat: [0, [Validators.min(0)]],
      ingredients: this.fb.array([])
    });
  }

  private populateForm(): void {
    if (this.recipe) {
      this.recipeForm.patchValue({
        name: this.recipe.name,
        description: this.recipe.description,
        preparationTime: this.recipe.preparationTime,
        cookingTime: this.recipe.cookingTime,
        difficulty: this.recipe.difficulty,
        servings: this.recipe.servings,
        detailCuisine: this.recipe.detailCuisine,
        status: this.recipe.status,
        tags: this.recipe.tags?.join(', '),
        calories: this.recipe.calories,
        protein: this.recipe.protein,
        carbs: this.recipe.carbs,
        fat: this.recipe.fat
      });

      // Populer les ingrédients
      if (this.recipe.ingredients) {
        this.recipe.ingredients.forEach(ingredient => {
          this.addIngredient(ingredient);
        });
      }
    }
  }

  get ingredientsArray(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  createIngredientFormGroup(ingredient?: RecipeIngredient): FormGroup {
    return this.fb.group({
      id: [ingredient?.id || null],
      productName: [ingredient?.productName || '', Validators.required],
      quantity: [ingredient?.quantity || 1, [Validators.required, Validators.min(0.01)]],
      unit: [ingredient?.unit || '', Validators.required],
      unitPrice: [ingredient?.unitPrice || 0, [Validators.min(0)]],
      totalPrice: [ingredient?.totalPrice || 0],
      notes: [ingredient?.notes || ''],
      isOptional: [ingredient?.isOptional || false],
      order: [ingredient?.order || this.ingredientsArray.length + 1]
    });
  }

  addIngredient(ingredient?: RecipeIngredient): void {
    const ingredientGroup = this.createIngredientFormGroup(ingredient);
    this.ingredientsArray.push(ingredientGroup);
    
    // Calculer le prix total automatiquement
    ingredientGroup.get('quantity')?.valueChanges.subscribe(() => {
      this.calculateIngredientTotal(ingredientGroup);
    });
    
    ingredientGroup.get('unitPrice')?.valueChanges.subscribe(() => {
      this.calculateIngredientTotal(ingredientGroup);
    });
  }

  removeIngredient(index: number): void {
    this.ingredientsArray.removeAt(index);
  }

  private calculateIngredientTotal(ingredientGroup: FormGroup): void {
    const quantity = ingredientGroup.get('quantity')?.value || 0;
    const unitPrice = ingredientGroup.get('unitPrice')?.value || 0;
    const totalPrice = quantity * unitPrice;
    ingredientGroup.get('totalPrice')?.setValue(totalPrice, { emitEvent: false });
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.selectedPhoto = null;
    this.photoPreview = null;
  }

  async onSubmit(): Promise<void> {
    if (this.recipeForm.valid) {
      this.isSubmitting = true;
      this.validationErrors = [];

      try {
        const formValue = this.recipeForm.value;
        
        // Préparer les données de la recette
        const recipeData: Partial<Recipe> = {
          ...formValue,
          tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [],
          ingredients: this.ingredientsArray.value,
          compteuser_id: this.userId
        };

        // Valider la recette
        const validation = this.recipeHelper.validateRecipe(recipeData as Recipe);
        if (!validation.isValid) {
          this.validationErrors = validation.errors;
          this.isSubmitting = false;
          return;
        }

        let result;
        if (this.recipe) {
          // Mise à jour
          result = await this.recipeHelper.updateRecipeWithPhoto(
            this.recipe.id!,
            recipeData,
            this.selectedPhoto || undefined
          );
          this.recipeUpdated.emit(result);
        } else {
          // Création
          result = await this.recipeHelper.createCompleteRecipe(
            recipeData,
            this.selectedPhoto || undefined,
            recipeData.ingredients,
            this.userId
          );
          this.recipeSaved.emit(result);
        }

        console.log('Recette sauvegardée avec succès:', result);
        
        // Réinitialiser le formulaire si c'est une nouvelle recette
        if (!this.recipe) {
          this.recipeForm.reset();
          this.ingredientsArray.clear();
          this.removePhoto();
        }

      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        this.validationErrors.push('Erreur lors de la sauvegarde de la recette');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.recipeForm.controls).forEach(key => {
      const control = this.recipeForm.get(key);
      control?.markAsTouched();
    });
  }

  calculateTotalCost(): number {
    const ingredients = this.ingredientsArray.value;
    return this.recipeHelper.calculateRecipeCost(ingredients);
  }

  getTotalTime(): number {
    const prepTime = this.recipeForm.get('preparationTime')?.value || 0;
    const cookTime = this.recipeForm.get('cookingTime')?.value || 0;
    return prepTime + cookTime;
  }

  exportRecipe(): void {
    const formValue = this.recipeForm.value;
    const recipeData: Recipe = {
      ...formValue,
      tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [],
      ingredients: this.ingredientsArray.value
    };
    
    this.recipeHelper.exportRecipe(recipeData);
  }
}
