import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitsTiersComponent } from './produits-tiers.component';

describe('ProduitsTiersComponent', () => {
  let component: ProduitsTiersComponent;
  let fixture: ComponentFixture<ProduitsTiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitsTiersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProduitsTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
