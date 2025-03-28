import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutMappingComponent } from './ajout-mapping.component';

describe('AjoutMappingComponent', () => {
  let component: AjoutMappingComponent;
  let fixture: ComponentFixture<AjoutMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
