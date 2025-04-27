import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PanierItem } from '../PanierItem';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-commande-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-commande-dialog.component.html',
  styleUrl: './confirm-commande-dialog.component.css'
})
export class ConfirmCommandeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmCommandeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      panierItems: PanierItem[],
      total: number,
      adresse: string
    }
  ) {}

  onConfirmer(): void {
    this.dialogRef.close(true); 
  }

  onAnnuler(): void {
    this.dialogRef.close(false); 
  }
}



