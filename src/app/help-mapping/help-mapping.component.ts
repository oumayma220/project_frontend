import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs'; // ✅ ajouter cet import




@Component({
  selector: 'app-help-mapping',
  standalone: true,
  imports: [MatButtonModule , MatTabsModule ],
  templateUrl: './help-mapping.component.html',
  styleUrl: './help-mapping.component.css'
})
export class HelpMappingComponent {
  constructor(private dialogRef: MatDialogRef<HelpMappingComponent>) {}
  close() {
    this.dialogRef.close();
  }
 
}
