import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaildishesComponent } from './detaildishes.component';

describe('DetaildishesComponent', () => {
  let component: DetaildishesComponent;
  let fixture: ComponentFixture<DetaildishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetaildishesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetaildishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
