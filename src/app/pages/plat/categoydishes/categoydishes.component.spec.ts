import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoydishesComponent } from './categoydishes.component';

describe('CategoydishesComponent', () => {
  let component: CategoydishesComponent;
  let fixture: ComponentFixture<CategoydishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoydishesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoydishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
