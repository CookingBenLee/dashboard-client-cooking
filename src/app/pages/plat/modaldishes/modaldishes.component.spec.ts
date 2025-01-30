import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaldishesComponent } from './modaldishes.component';

describe('ModaldishesComponent', () => {
  let component: ModaldishesComponent;
  let fixture: ComponentFixture<ModaldishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaldishesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModaldishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
