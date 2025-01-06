import { TestBed } from '@angular/core/testing';

import { DetaildishesService } from './detaildishes.service';

describe('DetaildishesService', () => {
  let service: DetaildishesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetaildishesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
