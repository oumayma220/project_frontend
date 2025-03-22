import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TiersService } from '../Service/tiers.service';
import { Config } from '../Config';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-config-list',
  standalone: true,
  imports: [MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDividerModule,
    MatTableModule,
    MatTooltipModule,
    MatBadgeModule,
    MatMenuModule,
    MatExpansionModule,
    
  ],
  templateUrl: './config-list.component.html',
  styleUrl: './config-list.component.css'
})
export class ConfigListComponent implements OnInit {

  tiersId!: number;
  tiersNom!: string;
  configs: Config[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private tiersConfigService: TiersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.tiersId = +this.route.snapshot.paramMap.get('tiersId')!;
    this.getTiersNom();
    this.getConfigs();
  }
  getTiersNom(): void {
    this.tiersConfigService.getTiersById(this.tiersId).subscribe({
      next: (tiers) => {
        this.tiersNom = tiers.nom; // adapte le nom de la propriété selon ton modèle
        console.log('Nom du tiers récupéré:', this.tiersNom);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du tiers:', error);
        
      }
    });
  }
  

  getConfigs(): void {
    this.isLoading = true;
    this.error = null;
    
    this.tiersConfigService.getConfigsByTiersId(this.tiersId).subscribe({
      next: (response: Config[]) => {
        this.configs = response;
        this.isLoading = false;
        console.log('Configurations récupérées:', this.configs);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Erreur lors de la récupération des configurations';
        console.error('Erreur HTTP:', error);
        
        this.snackBar.open(
          'Impossible de charger les configurations', 
          'Réessayer', 
          { duration: 5000 }
        ).onAction().subscribe(() => this.getConfigs());
      }
    });
  }

  editConfig(config: Config): void {
    console.log('Édition de la configuration:', config);
  }

  deleteConfig(config: Config): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la configuration "${config.configName}" ?`)) {
      console.log('Suppression de la configuration:', config);
    }
  }

  testConfig(config: Config): void {
    console.log('Test de la configuration:', config);
    
    this.snackBar.open(
      'Test de la configuration lancé', 
      'OK', 
      { duration: 3000 }
    );
  }

  copyConfig(config: Config): void {
    console.log('Duplication de la configuration:', config);
    
    this.snackBar.open(
      'Configuration dupliquée avec succès', 
      'OK', 
      { duration: 3000 }
    );
  }

  addNewConfig(): void {
   
  }
}