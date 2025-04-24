import { Component, OnInit } from '@angular/core';
import { PanierItem } from '../PanierItem';
import { PanierService } from '../Service/panier.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.css'
})
export class PanierComponent implements OnInit {
  panierItems: PanierItem[] = [];
  total: number = 0;

  constructor(private panierService: PanierService) { }

  ngOnInit(): void {
    this.loadPanierItems();
    this.panierService.panierChanges.subscribe(() => {
      this.loadPanierItems();
    });
  }

  loadPanierItems(): void {
    this.panierItems = this.panierService.getPanierItems();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.panierItems.reduce((sum, item) => 
      sum + (item.prixUnitaire * item.quantite), 0);
  }

  incrementQuantity(item: PanierItem): void {
    this.panierService.modifierQuantite(item.produitId, item.quantite + 1);
  }

  decrementQuantity(item: PanierItem): void {
    if (item.quantite > 1) {
      this.panierService.modifierQuantite(item.produitId, item.quantite - 1);
    }
  }

  removeItem(produitId: string): void {
    this.panierService.supprimerProduit(produitId);
  }

  clearPanier(): void {
    this.panierService.viderPanier();
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/default-product-image.png';
  }

  passerCommande(): void {
    // Implémenter la logique pour passer la commande
    alert('Fonctionnalité de passer commande à implémenter');
  }
}