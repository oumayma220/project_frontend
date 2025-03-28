import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMethodComponent } from './update-method.component';

describe('UpdateMethodComponent', () => {
  let component: UpdateMethodComponent;
  let fixture: ComponentFixture<UpdateMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMethodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
