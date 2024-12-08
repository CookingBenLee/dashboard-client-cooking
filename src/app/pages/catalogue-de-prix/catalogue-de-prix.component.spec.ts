import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueDePrixComponent } from './catalogue-de-prix.component';

describe('CatalogueDePrixComponent', () => {
  let component: CatalogueDePrixComponent;
  let fixture: ComponentFixture<CatalogueDePrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogueDePrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueDePrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
