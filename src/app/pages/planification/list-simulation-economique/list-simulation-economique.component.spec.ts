import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSimulationEconomiqueComponent } from './list-simulation-economique.component';

describe('ListSimulationEconomiqueComponent', () => {
  let component: ListSimulationEconomiqueComponent;
  let fixture: ComponentFixture<ListSimulationEconomiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSimulationEconomiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSimulationEconomiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
