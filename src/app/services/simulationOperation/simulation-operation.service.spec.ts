import { TestBed } from '@angular/core/testing';

import { SimulationOperationService } from './simulation-operation.service';

describe('SimulationOperationService', () => {
  let service: SimulationOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulationOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
