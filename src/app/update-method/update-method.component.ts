import { Component, Inject, OnInit } from '@angular/core';
import { TiersService } from '../Service/tiers.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiMethodGeneralInfoRequest } from '../ApiMethodGeneralInfoRequest';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-update-method',
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
                MatDialogModule,
                MatCheckboxModule
                
  ],
  templateUrl: './update-method.component.html',
  styleUrl: './update-method.component.css'
})
export class UpdateMethodComponent implements OnInit {
  configForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private tiersService: TiersService,  
    private dialogRef: MatDialogRef<UpdateMethodComponent>,  
    @Inject(MAT_DIALOG_DATA) public data: any  
  ) {
    this.configForm = this.fb.group({
      httpMethod: [this.data.httpMethod, Validators.required],
      endpoint: [this.data.endpoint, Validators.required,],
      methodHeaders: [this.data.methodHeaders],
      paginated: [this.data.paginated || false],
      paginationParamName: [this.data.paginationParamName],
      pageSizeParamName: [this.data.pageSizeParamName],
      totalPagesFieldInResponse: [this.data.totalPagesFieldInResponse],

      contentFieldInResponse: [this.data.contentFieldInResponse],
      type: [this.data.type]


    });
    this.configForm.get('paginated')?.valueChanges.subscribe(paginated => {
      if (paginated) {
        this.configForm.get('paginationParamName')?.setValidators(Validators.required);
        this.configForm.get('totalPagesFieldInResponse')?.setValidators(Validators.required);
      } else {
        this.configForm.get('paginationParamName')?.clearValidators();
        this.configForm.get('totalPagesFieldInResponse')?.clearValidators();
      }
      this.configForm.get('paginationParamName')?.updateValueAndValidity();
      this.configForm.get('totalPagesFieldInResponse')?.updateValueAndValidity();
    });
  
    
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.configForm.valid) {
      const updatedmethod: ApiMethodGeneralInfoRequest = this.configForm.value;
      this.tiersService.updateApiMethod(this.data.id, updatedmethod).subscribe({
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