import { TestBed } from '@angular/core/testing';

import { EstimationVenteService } from './estimation-vente.service';

describe('EstimationVenteService', () => {
  let service: EstimationVenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimationVenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
