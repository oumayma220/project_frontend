import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpMappingComponent } from './help-mapping.component';

describe('HelpMappingComponent', () => {
  let component: HelpMappingComponent;
  let fixture: ComponentFixture<HelpMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
