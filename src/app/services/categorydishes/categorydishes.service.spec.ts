import { TestBed } from '@angular/core/testing';

import { CategorydishesService } from './categorydishes.service';

describe('CategorydishesService', () => {
  let service: CategorydishesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorydishesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
