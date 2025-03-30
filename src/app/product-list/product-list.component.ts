import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TiersService } from '../Service/tiers.service';
import { Product } from '../Product';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCard } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,
     MatProgressSpinnerModule,
     MatIconModule,
     MatTableModule,
     MatCard ,
     MatToolbar,
     MatPaginatorModule, 

  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;
  displayedColumns: string[] = ['name', 'description', 'image', 'price', 'reference'];
  dataSource = new MatTableDataSource<Product>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private tiersService: TiersService) {}

  ngOnInit(): void {
    this.loading = true;
    this.tiersService.importAllProducts().subscribe(
      (products) => {
        this.products = products;
        this.dataSource.data = this.products; 
        this.loading = false;
        this.initPaginator();
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
        this.error = 'Une erreur est survenue lors de la récupération des produits.';
        this.loading = false;
      }
    );
  }

  ngAfterViewInit(): void {
    this.initPaginator();
  }

  private initPaginator(): void {
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }
}