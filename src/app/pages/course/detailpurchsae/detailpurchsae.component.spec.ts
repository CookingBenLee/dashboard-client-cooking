import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailpurchsaeComponent } from './detailpurchsae.component';

describe('DetailpurchsaeComponent', () => {
  let component: DetailpurchsaeComponent;
  let fixture: ComponentFixture<DetailpurchsaeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailpurchsaeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailpurchsaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
