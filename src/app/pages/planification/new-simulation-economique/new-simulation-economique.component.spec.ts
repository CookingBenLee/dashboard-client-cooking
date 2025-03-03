import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSimulationEconomiqueComponent } from './new-simulation-economique.component';

describe('NewSimulationEconomiqueComponent', () => {
  let component: NewSimulationEconomiqueComponent;
  let fixture: ComponentFixture<NewSimulationEconomiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSimulationEconomiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSimulationEconomiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
