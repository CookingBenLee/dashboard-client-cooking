import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeuilleCourseComponent } from './feuille-course.component';

describe('FeuilleCourseComponent', () => {
  let component: FeuilleCourseComponent;
  let fixture: ComponentFixture<FeuilleCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeuilleCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeuilleCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
