import { TestBed } from '@angular/core/testing';

import { PreparationRecipeService } from './preparation-recipe.service';

describe('PreparationRecipeService', () => {
  let service: PreparationRecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreparationRecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
