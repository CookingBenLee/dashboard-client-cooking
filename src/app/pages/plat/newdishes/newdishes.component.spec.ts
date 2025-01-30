import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewdishesComponent } from './newdishes.component';

describe('NewdishesComponent', () => {
  let component: NewdishesComponent;
  let fixture: ComponentFixture<NewdishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewdishesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewdishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
