import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcategoryrecipeComponent } from './modalcategoryrecipe.component';

describe('ModalcategoryrecipeComponent', () => {
  let component: ModalcategoryrecipeComponent;
  let fixture: ComponentFixture<ModalcategoryrecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalcategoryrecipeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalcategoryrecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
