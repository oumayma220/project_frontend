import { Component, OnInit } from '@angular/core';
import { Tiers } from '../tiers';
import { TiersService } from '../Service/tiers.service';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-list-tiers',
  standalone: true,
  imports: [MatCardModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
    
    
  ],
  templateUrl: './list-tiers.component.html',
  styleUrl: './list-tiers.component.css'
})
export class ListTiersComponent  implements OnInit {
  tiersList: Tiers[] = []; 
  displayedColumns: string[] = ['nom', 'email', 'numero', 'actions'];

  constructor(
    private tiersService: TiersService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadTiers();
  }

  loadTiers() {
    this.tiersService.getAllTiers().subscribe({
      next: (tiersList: Tiers[]) => {
        this.tiersList = tiersList; 
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des tiers', error);
      }
    });
  }
 
}
