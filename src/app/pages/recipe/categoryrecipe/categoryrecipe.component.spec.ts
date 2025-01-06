import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryrecipeComponent } from './categoryrecipe.component';

describe('CategoryrecipeComponent', () => {
  let component: CategoryrecipeComponent;
  let fixture: ComponentFixture<CategoryrecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryrecipeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryrecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
