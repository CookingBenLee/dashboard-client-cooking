import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalrecipeComponent } from './modalrecipe.component';

describe('ModalrecipeComponent', () => {
  let component: ModalrecipeComponent;
  let fixture: ComponentFixture<ModalrecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalrecipeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalrecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
