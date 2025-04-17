import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouttemplateComponent } from './ajouttemplate.component';

describe('AjouttemplateComponent', () => {
  let component: AjouttemplateComponent;
  let fixture: ComponentFixture<AjouttemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouttemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjouttemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
