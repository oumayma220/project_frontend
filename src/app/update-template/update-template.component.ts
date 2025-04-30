import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { TiersService } from '../Service/tiers.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';
import { MatCardModule } from '@angular/material/card'; 
import { PayloadTemplate } from '../PayloadTemplate';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-update-template',
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
    MatCardModule,
    MatDividerModule],
  templateUrl: './update-template.component.html',
  styleUrl: './update-template.component.css'
})
export class UpdateTemplateComponent implements OnInit {
  templateForm: FormGroup;
  originalValues: PayloadTemplate = { pathParam: '', template: '' ,payloadSchema:'',succesRespone:''};

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { methodId: number, payloadTemplates: PayloadTemplate[] },
    private tiersService: TiersService,
    private snackBar: MatSnackBar
  ) {
    this.templateForm = this.fb.group({
      // pathParam: ['',Validators.required],
      template: ['', Validators.required],
      payloadSchema:['', Validators.required],
      succesRespone:['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('Data received:', this.data);
    
    if (this.data && this.data.payloadTemplates && this.data.payloadTemplates.length > 0) {
      const template = this.data.payloadTemplates[0];
          this.originalValues = {
        pathParam: template.pathParam || '',
        template: template.template || '',
        payloadSchema:template.payloadSchema|| '',
        succesRespone:template.succesRespone|| ''
      };
      
      this.templateForm.patchValue(this.originalValues);
    } else {
      console.warn('No payload template data received or structure is incorrect');
    }
  }
  saveChanges(): void {
    if (this.templateForm.valid) {
      const updatedTemplate = this.templateForm.value;
      console.log('Saving template with methodId:', this.data.methodId);
      console.log('Payload:', updatedTemplate);
      
      this.tiersService.updatetemplate(this.data.methodId, [updatedTemplate]).subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.snackBar.open('Template mis à jour avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(updatedTemplate);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du template:', error);
          this.snackBar.open('Erreur lors de la mise à jour du template', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.templateForm.markAllAsTouched();
      this.snackBar.open('Veuillez remplir tous les champs requis', 'Fermer', { duration: 3000 });
    }
  }

  resetForm(): void {
    this.templateForm.reset(this.originalValues);
  }
}