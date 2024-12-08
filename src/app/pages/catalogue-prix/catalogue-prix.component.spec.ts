import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CataloguePrixComponent } from './catalogue-prix.component';

describe('CataloguePrixComponent', () => {
  let component: CataloguePrixComponent;
  let fixture: ComponentFixture<CataloguePrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CataloguePrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CataloguePrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
