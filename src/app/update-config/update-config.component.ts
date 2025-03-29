import { Component, Inject, OnInit } from '@angular/core';
import { TiersService } from '../Service/tiers.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigGeneralInfoRequest } from '../ConfigGeneralInfoRequest';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-update-config',
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
  templateUrl: './update-config.component.html',
  styleUrl: './update-config.component.css'
})
export class UpdateConfigComponent implements OnInit {
  configForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tiersService: TiersService,  // Assure-toi d'avoir un service tiers
    private dialogRef: MatDialogRef<UpdateConfigComponent>,  // Pour fermer le dialogue
    @Inject(MAT_DIALOG_DATA) public data: any  // Injecte les données passées dans le dialogue
  ) {
    this.configForm = this.fb.group({
      configName: [this.data.configName, Validators.required],
      url: [this.data.url, Validators.required,],
      headers: [this.data.headers]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.configForm.valid) {
      const updatedConfig: ConfigGeneralInfoRequest = this.configForm.value;
      this.tiersService.updateConfigGeneralInfo(this.data.id, updatedConfig).subscribe({
        next: () => {
          this.dialogRef.close();  // Ferme le dialogue après la soumission réussie
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour', err);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();  // Ferme le dialogue si l'utilisateur annule
  }}