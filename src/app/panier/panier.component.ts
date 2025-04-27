import { Component, OnInit } from '@angular/core';
import { PanierItem } from '../PanierItem';
import { PanierService } from '../Service/panier.service';
import { CommonModule, registerLocaleData } from '@angular/common';
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
import { CommandeService } from '../Service/commande.service';
import { LigneCommandeDTO } from '../LigneCommandeDTO';
import { CommandeDTO } from '../CommandeDTO';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCommandeDialogComponent } from '../confirm-commande-dialog/confirm-commande-dialog.component';


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
  adresseLivraison: string = ''; 

  constructor(private panierService: PanierService,private commandeService: CommandeService,   private dialog: MatDialog) { }

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
      this.total = Math.round(this.total * 100) / 100;
  }
  

  incrementQuantity(item: PanierItem): void {
    this.panierService.modifierQuantite(item.produitId, item.quantite + 1);
    this.calculateTotal();  

  }

  decrementQuantity(item: PanierItem): void {
    if (item.quantite > 1) {
      this.panierService.modifierQuantite(item.produitId, item.quantite - 1);
      this.calculateTotal();
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

  // passerCommande(): void {
  //   if (!this.adresseLivraison.trim()) {
  //     alert("Veuillez entrer une adresse de livraison.");
  //     return;
  //   }

  //   const tierId = this.panierItems[0]?.tierId; 

  //   const lignes: LigneCommandeDTO[] = this.panierItems.map(item => ({
  //     produitId: item.produitId,
  //     nomProduit: item.nomProduit,
  //     prixUnitaire: item.prixUnitaire,
  //     quantite: item.quantite
  //   }));

  //   const commande: CommandeDTO = {
  //     tiersId: tierId,
  //     adresse: this.adresseLivraison,
  //     lignes: lignes
  //   };

  //   this.commandeService.passerCommandePourTiers(commande).subscribe({
  //     next: (response) => {
  //       alert(response);
  //       this.clearPanier();
  //       this.adresseLivraison = '';
  //     },
  //     error: (error) => {
  //       alert("Erreur lors de la commande : " + error.error);
  //     }
  //   });
  // }
  passerCommande(): void {
    if (!this.adresseLivraison.trim()) {
      alert("Veuillez entrer une adresse de livraison.");
      return;
    }
  
    const tierId = this.panierItems[0]?.tierId;
  
    const lignes: LigneCommandeDTO[] = this.panierItems.map(item => ({
      produitId: item.produitId,
      nomProduit: item.nomProduit,
      prixUnitaire: item.prixUnitaire,
      quantite: item.quantite
    }));
  
    const dialogRef = this.dialog.open(ConfirmCommandeDialogComponent, {
      width: '500px',
      data: {
        adresse: this.adresseLivraison,
        total: this.total,
        panierItems: this.panierItems,   
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const commande: CommandeDTO = {
          tiersId: tierId,
          adresse: this.adresseLivraison,
          lignes: lignes
        };
  
        this.commandeService.passerCommandePourTiers(commande).subscribe({
          next: (response) => {
            alert(response);
            this.clearPanier();
            this.adresseLivraison = '';
          },
          error: (error) => {
            alert("Erreur lors de la commande : " + error.error);
          }
        });
      }
    });
  }
}