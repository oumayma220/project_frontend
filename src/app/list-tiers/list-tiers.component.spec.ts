import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTiersComponent } from './list-tiers.component';

describe('ListTiersComponent', () => {
  let component: ListTiersComponent;
  let fixture: ComponentFixture<ListTiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTiersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
