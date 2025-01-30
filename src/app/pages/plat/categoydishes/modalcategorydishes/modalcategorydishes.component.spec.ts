import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalcategorydishesComponent } from './modalcategorydishes.component';

describe('ModalcategorydishesComponent', () => {
  let component: ModalcategorydishesComponent;
  let fixture: ComponentFixture<ModalcategorydishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalcategorydishesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalcategorydishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
