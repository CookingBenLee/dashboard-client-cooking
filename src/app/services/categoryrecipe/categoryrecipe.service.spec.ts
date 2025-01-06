import { TestBed } from '@angular/core/testing';

import { CategoryrecipeService } from './categoryrecipe.service';

describe('CategoryrecipeService', () => {
  let service: CategoryrecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryrecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
