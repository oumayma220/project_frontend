import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCommandeDialogComponent } from './confirm-commande-dialog.component';

describe('ConfirmCommandeDialogComponent', () => {
  let component: ConfirmCommandeDialogComponent;
  let fixture: ComponentFixture<ConfirmCommandeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmCommandeDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmCommandeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
