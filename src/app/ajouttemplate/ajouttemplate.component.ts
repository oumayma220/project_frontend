import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TiersService } from '../Service/tiers.service';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-ajouttemplate',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,],
  templateUrl: './ajouttemplate.component.html',
  styleUrl: './ajouttemplate.component.css'
})
export class AjouttemplateComponent implements OnInit {
  methodId!: number;
  ApiMethodForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private tiersService: TiersService,
      private snackBar: MatSnackBar,
      private toastr: ToastrService
    ) { }
  ngOnInit(): void {
    this.methodId = Number(this.route.snapshot.paramMap.get('methodId'));
    this.ApiMethodForm = this.fb.group({
      payloadTemplates: this.fb.array([])
    });
    this.addPayload();
  }  
  get payloadTemplates(): FormArray {
    return this.ApiMethodForm.get('payloadTemplates') as FormArray;
  }
  addPayload(): void {
    const template = this.fb.group({
      pathParam: [''],
      template: ['',Validators.required],
      payloadSchema: ['',Validators.required],
      succesRespone: ['',Validators.required],
    
    });
    this.payloadTemplates.push(template);
  }
  
  onSubmit(): void {
    if (this.ApiMethodForm.invalid) {
      return;
    }
    const configData = this.ApiMethodForm.value.payloadTemplates; 
    console.log('Configuration envoyée:', configData);
    this.tiersService.addPayloadTemplate(this.methodId, configData).subscribe({
      next: () => {
        this.successMessage = 'payload ajoutée avec succès !';
        this.toastr.success('Configuration enregistrée avec succès !', 'Succès');
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = "Une erreur s'est produite lors de l'ajout de la payload.";
      this.toastr.error(this.errorMessage, 'Erreur');
      }
    });
    }
    removePayload(index: number): void {
      this.payloadTemplates.removeAt(index);
    }
    

}
