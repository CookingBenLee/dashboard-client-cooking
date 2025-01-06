import { TestBed } from '@angular/core/testing';

import { CompositiondishesService } from './compositiondishes.service';

describe('CompositiondishesService', () => {
  let service: CompositiondishesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompositiondishesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
