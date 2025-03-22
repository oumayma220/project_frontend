import { Component, OnInit, ViewChild } from '@angular/core';
import { TiersService } from '../Service/tiers.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Tiers } from '../tiers';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpdateTiersComponent } from '../update-tiers/update-tiers.component';

@Component({
  selector: 'app-tiers',
  standalone: true,
  imports: [CommonModule,MatTableModule,
      MatCardModule,
      MatToolbarModule,
      MatButtonModule,
      MatIconModule,
      MatDialogModule ,
      MatPaginatorModule
  ],
  templateUrl: './tiers.component.html',
  styleUrl: './tiers.component.css'
})
export class TiersComponent implements OnInit {

  displayedColumns: string[] = ['nom', 'email', 'numero',  'actions'];
  dataSource: MatTableDataSource<Tiers> = new MatTableDataSource<Tiers>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private tiersService: TiersService,private dialog: MatDialog) {}


  ngOnInit(): void {
    this.loadTiers();
  }

  loadTiers() {
    this.tiersService.getAllTiers().subscribe({
      next: (tiersList: Tiers[]) => {
        this.dataSource = new MatTableDataSource(tiersList);
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des tiers', error);
      }
    });
  }
  deleteTiers(tiersId: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce tiers ?')) {
      this.tiersService.deleteTiers(tiersId).subscribe({
        next: () => {
          console.log('Tiers supprimé avec succès !');
          this.loadTiers(); // recharge la liste après suppression
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du tiers', error);
        }
      });
    }
  }
  openSettingsDialog(tiers: any): void {
    const dialogRef = this.dialog.open(UpdateTiersComponent, {
      data: tiers  // Passer les données du tiers (nom, email, etc.) dans le dialogue
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Le dialogue a été fermé avec des données:', result);
      }
    });
  }

  

 
}
