import { TestBed } from '@angular/core/testing';

import { DetailsrecipeService } from './detailsrecipe.service';

describe('DetailsrecipeService', () => {
  let service: DetailsrecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsrecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
