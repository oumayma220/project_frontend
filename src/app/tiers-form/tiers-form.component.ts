import { Component } from '@angular/core';
import { TiersRequest } from '../TiersRequest';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TiersService } from '../Service/tiers.service';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HelpMappingComponent } from '../help-mapping/help-mapping.component';
import { MatDialog } from '@angular/material/dialog';
import { TestComponent } from '../test/test.component';
import { Product } from '../Product';
@Component({
  selector: 'app-tiers-form',
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
      
        ],
  templateUrl: './tiers-form.component.html',
  styleUrl: './tiers-form.component.css'
})
export class TiersFormComponent {
  tiersInfoForm: FormGroup;
  configForm: FormGroup;
  fieldMappingsForm: FormGroup;
  produits: Product[] = [];
  

  constructor(private fb: FormBuilder, private tiersService: TiersService, private router: Router,private dialog: MatDialog) {
    this.tiersInfoForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numero: ['', Validators.required],
    });

    this.configForm = this.fb.group({
      configName: [''],
      url: [''],
      headers: [''],
      // httpMethod: ['', Validators.required],
      httpMethod: [''],
      endpoint: [''],
      methodHeaders: [''],
      paginated: [false],
      paginationParamName: [''],
      pageSizeParamName: [''],
      totalPagesFieldInResponse: [''],
      contentFieldInResponse: [''],
      type: ['']

    });

    this.fieldMappingsForm = this.fb.group({
      fieldMappings: this.fb.array([])
    });
  }

  get fieldMappings(): FormArray {
    return this.fieldMappingsForm.get('fieldMappings') as FormArray;
  }

  addFieldMapping() {
    const mapping = this.fb.group({
      source: ['', Validators.required],
      target: ['', Validators.required]
    });

    this.fieldMappings.push(mapping);
  }

  removeFieldMapping(index: number) {
    this.fieldMappings.removeAt(index);
  }

  onSubmit() {
    //  if (this.tiersInfoForm.invalid || this.configForm.invalid || this.fieldMappingsForm.invalid) {
      if (this.tiersInfoForm.invalid || this.configForm.invalid ) {
      alert('Formulaire incomplet !');
      return;
    }
    const request: TiersRequest = {
      ...this.tiersInfoForm.value,
      ...this.configForm.value,
      fieldMappings: this.fieldMappingsForm.value.fieldMappings
    };

    console.log(request);

    this.tiersService.createTiers(request).subscribe({
      next: (response) => {
        alert('Tiers ajouté avec succès !');
        this.router.navigate(['adminhome/tiers']);

        // this.resetForms();
      },
      error: (err) => {
        alert('Erreur lors de l\'ajout du tiers : ' + (err.error?.message || 'Erreur inconnue'));
      }
    });
  }

  resetForms() {
    this.tiersInfoForm.reset();
    this.configForm.reset();
    this.fieldMappings.clear();
  }
  openHelpDialog() {
    this.dialog.open(HelpMappingComponent, {
      width: '1800px',
      height:'650px'
    });
}
onTestClick() {
  const requestData = {
    ...this.configForm.value,
    ...this.fieldMappingsForm.value
  };

  this.tiersService.importProducts(requestData).subscribe({
    next: (response) => {
      this.produits = response || [];

      // Prendre les 5 premiers produits comme exemple
      const exampleProducts = response.slice(0, 5);
      
      // Ouvrir le dialog avec les résultats
      const dialogRef = this.dialog.open(TestComponent, {
        width: '800px',
        data: {
          success: exampleProducts.length > 0,
          message: exampleProducts.length > 0 
            ? `Test réussi : ${this.produits.length} produits ont été trouvés pour cette configuration, voici quelques exemples : ` 
            : 'Aucun produit n\'a pu être importé.',
          products: exampleProducts
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.onSubmit();
        }
      });
    },
    error: (error) => {
      this.dialog.open(TestComponent, {
        width: '800px',
        data: {
          success: false,
          message: 'Erreur lors de l\'importation des produits. Vérifiez votre configuration.',
          products: []
        }
      });
    }
  });
}

}