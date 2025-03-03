import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEstimationComponent } from './detail-estimation.component';

describe('DetailEstimationComponent', () => {
  let component: DetailEstimationComponent;
  let fixture: ComponentFixture<DetailEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailEstimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
