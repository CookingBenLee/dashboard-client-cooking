import { TestBed } from '@angular/core/testing';

import { CompositionCardMenuService } from './composition-card-menu.service';

describe('CompositionCardMenuService', () => {
  let service: CompositionCardMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompositionCardMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
