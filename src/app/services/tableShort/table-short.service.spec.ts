import { TestBed } from '@angular/core/testing';

import { TableShortService } from './table-short.service';

describe('TableShortService', () => {
  let service: TableShortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableShortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
