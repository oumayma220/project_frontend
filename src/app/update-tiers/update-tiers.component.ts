import { Component, Inject, OnInit } from '@angular/core';
import { TiersGeneralInfoRequest } from '../TiersGeneralInfoRequest';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TiersService } from '../Service/tiers.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-update-tiers',
  standalone: true,
  imports: [
    FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,  
        MatInputModule,      
        MatButtonModule,
        MatCardModule,
        MatButtonModule ,
        MatIconModule,
        MatDialogModule
  ],
  templateUrl: './update-tiers.component.html',
  styleUrl: './update-tiers.component.css'
})
export class UpdateTiersComponent implements OnInit {
  tiersForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tiersService: TiersService,  
    private dialogRef: MatDialogRef<UpdateTiersComponent>,  
    @Inject(MAT_DIALOG_DATA) public data: any  
  ) {
    this.tiersForm = this.fb.group({
      nom: [this.data.nom, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      numero: [this.data.numero, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.tiersForm.valid) {
      const updatedTiers: TiersGeneralInfoRequest = this.tiersForm.value;
      this.tiersService.updateTiersGeneralInfo(this.data.id, updatedTiers).subscribe({
        next: () => {
          this.dialogRef.close();  
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();  
  }}