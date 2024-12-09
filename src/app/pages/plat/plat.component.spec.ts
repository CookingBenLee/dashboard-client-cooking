import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatComponent } from './plat.component';

describe('PlatComponent', () => {
  let component: PlatComponent;
  let fixture: ComponentFixture<PlatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
