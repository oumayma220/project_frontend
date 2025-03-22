import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTiersComponent } from './update-tiers.component';

describe('UpdateTiersComponent', () => {
  let component: UpdateTiersComponent;
  let fixture: ComponentFixture<UpdateTiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTiersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
