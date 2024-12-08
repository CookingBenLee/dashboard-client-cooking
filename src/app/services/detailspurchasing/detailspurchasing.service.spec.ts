import { TestBed } from '@angular/core/testing';

import { DetailspurchasingService } from './detailspurchasing.service';

describe('DetailspurchasingService', () => {
  let service: DetailspurchasingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailspurchasingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
