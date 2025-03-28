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
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ajout-mapping',
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
    MatFormFieldModule,
    ],
  templateUrl: './ajout-mapping.component.html',
  styleUrl: './ajout-mapping.component.css'
})
export class AjoutMappingComponent implements OnInit {
  methodId!: number;
  ApiMethodForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private tiersService: TiersService,
      private snackBar: MatSnackBar,private dialog: MatDialog
    ) { }
  ngOnInit(): void {
    this.methodId = Number(this.route.snapshot.paramMap.get('methodId'));

    this.ApiMethodForm = this.fb.group({
    
      fieldMappings: this.fb.array([])
    });

    this.addFieldMapping();

  }  
  get fieldMappings(): FormArray {
    return this.ApiMethodForm.get('fieldMappings') as FormArray;
  }

  addFieldMapping(): void {
    const mappingGroup = this.fb.group({
      source: ['',Validators.required],
      target: ['',Validators.required]
    });
    this.fieldMappings.push(mappingGroup);
  }

  removeFieldMapping(index: number): void {
    this.fieldMappings.removeAt(index);
  }

  onSubmit(): void {
    if (this.ApiMethodForm.invalid) {
      // this.ApiMethodForm.markAllAsTouched();
      // this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const configData = this.ApiMethodForm.value.fieldMappings; 

    console.log('Configuration envoyée:', configData);

    this.tiersService.addFieldMappings(this.methodId, configData).subscribe({
      next: () => {
        this.successMessage = 'Configuration ajoutée avec succès !';
        this.snackBar.open('Configuration enregistrée', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = "Une erreur s'est produite lors de l'ajout de la configuration.";
      }
    });
    
  }

}






