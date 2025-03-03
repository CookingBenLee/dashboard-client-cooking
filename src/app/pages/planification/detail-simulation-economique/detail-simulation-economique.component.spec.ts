import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSimulationEconomiqueComponent } from './detail-simulation-economique.component';

describe('DetailSimulationEconomiqueComponent', () => {
  let component: DetailSimulationEconomiqueComponent;
  let fixture: ComponentFixture<DetailSimulationEconomiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSimulationEconomiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSimulationEconomiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
