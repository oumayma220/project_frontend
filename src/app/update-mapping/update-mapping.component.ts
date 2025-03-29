import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { TiersService } from '../Service/tiers.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { MatCardModule } from '@angular/material/card'; // Importer MatCardModule



@Component({
  selector: 'app-update-mapping',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule
],
  templateUrl: './update-mapping.component.html',
  styleUrl: './update-mapping.component.css'
})
export class UpdateMappingComponent implements OnInit {
  mappingForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateMappingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { methodId: number, fieldMappings: any[] },
    private tiersService: TiersService,
    private snackBar: MatSnackBar
  ) {
    this.mappingForm = this.fb.group({
      mappings: this.fb.array([])
    });
  }
  
  ngOnInit(): void {
    if (this.data.fieldMappings && this.data.fieldMappings.length > 0) {
      this.data.fieldMappings.forEach(mapping => {
        this.addMapping(mapping.source, mapping.target);
      });
    }
  }
  
  get mappingsArray(): FormArray {
    return this.mappingForm.get('mappings') as FormArray;
  }
  
  addMapping(source: string = '', target: string = ''): void {
    this.mappingsArray.push(
      this.fb.group({
        source: [source],
        target: [target]
      })
    );
  }
  
  removeMapping(index: number): void {
    this.mappingsArray.removeAt(index);
  }
  
  saveChanges(): void {
    if (this.mappingForm.valid) {
      const mappings = this.mappingsArray.value;
      
      this.tiersService.updatemapping(this.data.methodId, mappings).subscribe({
        next: (response) => {
          this.snackBar.open('Mappings mis à jour avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(mappings);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour des mappings', error);
          this.snackBar.open('Erreur lors de la mise à jour des mappings', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}