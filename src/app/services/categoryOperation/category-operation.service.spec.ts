import { TestBed } from '@angular/core/testing';

import { CategoryOperationService } from './category-operation.service';

describe('CategoryOperationService', () => {
  let service: CategoryOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
