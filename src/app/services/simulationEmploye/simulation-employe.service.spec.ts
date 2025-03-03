import { TestBed } from '@angular/core/testing';

import { SimulationEmployeService } from './simulation-employe.service';

describe('SimulationEmployeService', () => {
  let service: SimulationEmployeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulationEmployeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
