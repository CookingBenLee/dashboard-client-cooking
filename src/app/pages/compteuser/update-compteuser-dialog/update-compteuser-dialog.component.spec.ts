import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompteUserDialogComponent } from './update-compteuser-dialog.component';

describe('UpdateCompteuserDialogComponent', () => {
  let component: UpdateCompteUserDialogComponent;
  let fixture: ComponentFixture<UpdateCompteUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCompteUserDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCompteUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
