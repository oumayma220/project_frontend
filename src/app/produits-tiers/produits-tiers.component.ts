import { Component, OnInit } from '@angular/core';
import { Product } from '../Product';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TiersService } from '../Service/tiers.service';

@Component({
  selector: 'app-produits-tiers',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './produits-tiers.component.html',
  styleUrl: './produits-tiers.component.css'
})
export class ProduitsTiersComponent implements OnInit {
  tiersId!: number 
  products: Product[] = [];
  isLoading: boolean = true;
  displayedColumns: string[] = ['name', 'description', 'price', 'url', 'reference']; // Ajustez selon votre modèle Product

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tiersService: TiersService,
    private snackBar: MatSnackBar
  ) {
   
  }

  ngOnInit(): void {
    this.tiersId = Number(this.route.snapshot.paramMap.get('tiersId'));
    this.loadProducts();
    
  }


  loadProducts() {
    this.isLoading = true;
    
    this.tiersService.getProductsForTier(this.tiersId).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.isLoading = false;
        
        if (products.length === 0) {
          this.showInfoMessage('Aucun produit trouvé pour ce tiers');
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des produits', error);
        this.isLoading = false;
        
        if (error.status === 404) {
          this.showErrorMessage('Tiers introuvable');
          // Redirection vers la liste des tiers après un court délai
          setTimeout(() => this.router.navigate(['/tiers']), 3000);
        } else {
          this.showErrorMessage('Erreur lors de la récupération des produits');
        }
      }
    });
  }
  
  onImageError(event: any) {
    event.target.src = '../../assets/default.jpg';
  }
  

   retourListeTiers() {
     this.router.navigate(['success/list-tiers']);
   }
  
  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
  
  private showInfoMessage(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000
    });
  }
}
