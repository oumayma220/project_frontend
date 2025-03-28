import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutApimethodComponent } from './ajout-apimethod.component';

describe('AjoutApimethodComponent', () => {
  let component: AjoutApimethodComponent;
  let fixture: ComponentFixture<AjoutApimethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutApimethodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutApimethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
