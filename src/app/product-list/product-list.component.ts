import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TiersService } from '../Service/tiers.service';
import { Product } from '../Product';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { Tiers } from '../tiers';
import { MatOption } from '@angular/material/core';
import {  PageEvent } from '@angular/material/paginator';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { PanierService } from '../Service/panier.service';
import { PanierItem } from '../PanierItem';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatToolbarModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  dataSource = new MatTableDataSource<Product>([]);
  paginatedProducts: Product[] = [];
  pageSize = 12;
  currentPage = 0;
  filteredProducts: Product[] = [];
  tiersList: Tiers[] = []; 
  selectedTier: string | null = null;
  searchTerm: string = '';
  searchName: string = '';



  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private tiersService: TiersService,private panierService: PanierService,private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    
    // Charger les produits
    this.tiersService.importAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.updatePaginatedProducts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur produits:', error);
        this.error = 'Erreur lors du chargement des produits';
        this.loading = false;
      }
    });

    // Charger les tiers
    this.tiersService.getAllTiers().subscribe({
      next: (tiers) => {
        this.tiersList = tiers;
      },
      error: (error) => {
        console.error('Erreur tiers:', error);
      }
    });
  }

  applyTierFilter(): void {
    // On commence avec tous les produits
    let filtered = [...this.products];

    if (this.selectedTier) {
        filtered = filtered.filter(p => p.tierName === this.selectedTier);
    }

    if (this.searchName.trim()) {
        const searchTerm = this.searchName.toLowerCase().trim();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm)
        );
    }

    this.filteredProducts = filtered;
    this.currentPage = 0;
    this.updatePaginatedProducts();
}

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedProducts();
  }

  private updatePaginatedProducts(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  onImageError(event: any): void {
    event.target.src = '../../assets/default.jpg';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  applyNameFilter(): void {
    let filtered = this.selectedTier 
        ? this.products.filter(p => p.tierName === this.selectedTier)
        : [...this.products];

    if (this.searchName.trim()) {
        const searchTerm = this.searchName.toLowerCase().trim();
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }

    this.filteredProducts = filtered;
    this.currentPage = 0;
    this.updatePaginatedProducts();
}
ajouterAuPanier(product: any) {
  const produit: PanierItem = {
    produitId: product.reference,
    nomProduit: product.name,
    prixUnitaire: product.price,
    quantite: 1,
    tierId: product.tierId,
    imageUrl: product.url
  };

  const panierItems = this.panierService.getPanierItems();
  const vendeurActuelId = panierItems[0]?.tierId;

  if (vendeurActuelId && vendeurActuelId !== produit.tierId) {
    this.tiersService.getTiersById(vendeurActuelId).subscribe({
      next: (tiers) => {
        const vendeurActuelNom = tiers.nom;
        const message = `Votre panier contient déjà des produits du vendeur ${vendeurActuelNom}. ` +
                        `En ajoutant ce produit du vendeur ${product.tierName}, votre panier sera vidé. Continuer ?`;

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '400px',
          data: { message }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.panierService.viderPanier();
            this.panierService.ajouterProduit(produit);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du vendeur :', err);
        alert("Une erreur s'est produite en vérifiant le vendeur du panier.");
      }
    });
  } else {
    this.panierService.ajouterProduit(produit);
  }
}


}