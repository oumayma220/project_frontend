import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiersFormComponent } from './tiers-form.component';

describe('TiersFormComponent', () => {
  let component: TiersFormComponent;
  let fixture: ComponentFixture<TiersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiersFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TiersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
