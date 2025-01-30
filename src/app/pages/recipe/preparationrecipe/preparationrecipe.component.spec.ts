import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationrecipeComponent } from './preparationrecipe.component';

describe('PreparationrecipeComponent', () => {
  let component: PreparationrecipeComponent;
  let fixture: ComponentFixture<PreparationrecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreparationrecipeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreparationrecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
