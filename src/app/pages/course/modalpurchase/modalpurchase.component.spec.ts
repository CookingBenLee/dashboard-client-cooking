import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalpurchaseComponent } from './modalpurchase.component';

describe('ModalpurchaseComponent', () => {
  let component: ModalpurchaseComponent;
  let fixture: ComponentFixture<ModalpurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalpurchaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
