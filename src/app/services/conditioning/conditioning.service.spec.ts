import { TestBed } from '@angular/core/testing';

import { ConditioningService } from './conditioning.service';

describe('ConditioningService', () => {
  let service: ConditioningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConditioningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
