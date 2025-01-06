import { TestBed } from '@angular/core/testing';

import { PictiuredishesService } from './pictiuredishes.service';

describe('PictiuredishesService', () => {
  let service: PictiuredishesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PictiuredishesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
