import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TiersService } from '../Service/tiers.service';
import { ApiMethod, Config } from '../Config';
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
import { RouterModule } from '@angular/router';
import { UpdateConfigComponent } from '../update-config/update-config.component';
import { UpdateMethodComponent } from '../update-method/update-method.component';
import { UpdateMappingComponent } from '../update-mapping/update-mapping.component';




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
    private snackBar: MatSnackBar,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.tiersId = +this.route.snapshot.paramMap.get('tiersId')!;
    this.getTiersNom();
    this.getConfigs();
  }
  getTiersNom(): void {
    this.tiersConfigService.getTiersById(this.tiersId).subscribe({
      next: (tiers) => {
        this.tiersNom = tiers.nom; 
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
  redirectToAddConfig(tiersId: number): void {
    this.router.navigate([`adminhome/ajoutconfig`, tiersId]);
  }
  redirectToAddMethod(configId: number): void {
    this.router.navigate([`adminhome/ajoutapimethod`, configId]);
    }
    redirectToAddMapping(methodId: number) {
      this.router.navigate([`adminhome/ajoutmapping`, methodId]);
    }
  addNewConfig(): void {
    }

    deleteConfig(configId: number): void {
      if (confirm('Voulez-vous vraiment supprimer cette configuration ?')) {
        this.tiersConfigService.deleteconfig(configId).subscribe({
          next: () => {
            console.log('configuration supprimé avec succès !');
            this.getConfigs();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression du configuration', error);
          }
        });
      }
    }
    deleteapimethod(methodId: number):void {
      if (confirm('Voulez-vous vraiment supprimer cette api methode ?')) {
        this.tiersConfigService.deleteapimethod(methodId).subscribe({
          next: () => {
            console.log('apimethod supprimé avec succès !');
            this.getConfigs();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression du apimethod', error);
          }
        });
      }
}
deletefield(methodId: number):void {
  if (confirm('Voulez-vous vraiment supprimer cette fieldmapping ?')) {
    this.tiersConfigService.deletefieldmapping(methodId).subscribe({
      next: () => {
        console.log('fieldmapping supprimé avec succès !');
        this.getConfigs();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du fieldmapping', error);
      }
    });
  }  }
  openSettingsDialog(config: any): void {
      const dialogRef = this.dialog.open(UpdateConfigComponent, {
        width: '400px',
        data: config  
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          console.log('Le dialogue a été fermé avec des données:', result);
        }
        this.getConfigs();
      });
    }
    openSettingsDialogmethod(method: any): void {
      const dialogRef = this.dialog.open(UpdateMethodComponent, {
        width: '700px',
        data: method  
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          console.log('Le dialogue a été fermé avec des données:', result);
        }
        this.getConfigs();
      });
    }
    openSettingsDialogmethodmapping(method: any) :void{
      const dialogRef = this.dialog.open(UpdateMappingComponent, {
        width: '900px',
        data: {
          methodId: method.id,
          fieldMappings: method.fieldMappings
        }
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          console.log('Mappings mis à jour:', result);
        }
        this.getConfigs();
      });
    }
          
  


}