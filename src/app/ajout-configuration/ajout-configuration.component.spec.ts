import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutConfigurationComponent } from './ajout-configuration.component';

describe('AjoutConfigurationComponent', () => {
  let component: AjoutConfigurationComponent;
  let fixture: ComponentFixture<AjoutConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
