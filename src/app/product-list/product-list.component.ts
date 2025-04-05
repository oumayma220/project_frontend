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
    MatOptionModule
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private tiersService: TiersService) {}

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
    if (this.selectedTier) {
      this.filteredProducts = this.products.filter(product => 
        product.tierName === this.selectedTier
      );
    } else {
      this.filteredProducts = [...this.products];
    }
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
}