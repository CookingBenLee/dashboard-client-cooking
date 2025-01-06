import { TestBed } from '@angular/core/testing';

import { CompositionMenuService } from './composition-menu.service';

describe('CompositionMenuService', () => {
  let service: CompositionMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompositionMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
