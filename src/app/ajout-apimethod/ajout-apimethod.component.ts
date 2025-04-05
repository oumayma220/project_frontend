import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { TiersRequest } from '../TiersRequest';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelpMappingComponent } from '../help-mapping/help-mapping.component';
import { MatDialog } from '@angular/material/dialog';
import { TestComponent } from '../test/test.component';
import { Product } from '../Product';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core'; // Ajoutez cette importation



@Component({
  selector: 'app-ajout-apimethod',
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
          MatFormFieldModule],
  templateUrl: './ajout-apimethod.component.html',
  styleUrl: './ajout-apimethod.component.css'
})
export class AjoutApimethodComponent implements OnInit, AfterViewInit  {
  configId!: number;
  ApiMethodForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  tiersNom!: string;
  httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  parentConfig: any;
  produits: Product[] = [];
  targetFields = ['name', 'description', 'price', 'url', 'reference'];





  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tiersService: TiersService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone, 


    private snackBar: MatSnackBar,private dialog: MatDialog
  ) { }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.configId = Number(this.route.snapshot.paramMap.get('configId'));

    this.tiersService.getConfigsById(this.configId).subscribe({
      next: (config) => {
        this.parentConfig = config;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la configuration :', err);
      }
    });

    this.initializeForm();
    
    this.addFieldMapping();
  }

  private initializeForm(): void {
    this.ApiMethodForm = this.fb.group({
      httpMethod: ['', Validators.required],
      endpoint: ['', Validators.required],
      methodHeaders: [''],
      paginated: [false],
      paginationParamName: [''],  
      pageSizeParamName: [''],
      totalPagesFieldInResponse: [''],  
      contentFieldInResponse: [''],
      type: [''],
      fieldMappings: this.fb.array([])
    });

    // Utilisation de zone.run pour éviter les problèmes de détection
    this.ApiMethodForm.get('paginated')?.valueChanges.subscribe(paginated => {
      this.zone.run(() => {
        this.updatePaginationValidators(paginated);
      });
    });
  }

  private updatePaginationValidators(paginated: boolean): void {
    const paginationControls = [
      'paginationParamName',
      'totalPagesFieldInResponse'
    ];

    paginationControls.forEach(controlName => {
      const control = this.ApiMethodForm.get(controlName);
      if (control) {
        // Désactiver les événements pour éviter les cycles de détection supplémentaires
        if (paginated) {
          control.setValidators(Validators.required);
        } else {
          control.clearValidators();
          control.setValue('', { emitEvent: false });
        }
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }
  
  get fieldMappings(): FormArray {
    return this.ApiMethodForm.get('fieldMappings') as FormArray;
  }

  addFieldMapping(): void {
    const mappingGroup = this.fb.group({
      source: [''],
      target: ['']
    });
    this.fieldMappings.push(mappingGroup);
  }

  removeFieldMapping(index: number): void {
    this.fieldMappings.removeAt(index);
  }

  openHelpDialog() {
    this.dialog.open(HelpMappingComponent, {
      width: '1800px',
      height: '650px'
    });
  }

  onSubmit(): void {
    if (this.ApiMethodForm.invalid) {
      this.markFormGroupTouched(this.ApiMethodForm);
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const configData = this.ApiMethodForm.value;
    console.log('Configuration envoyée:', configData);

    this.tiersService.addApiMethodAndFieldMappings(this.configId, configData).subscribe({
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

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
 
  onTestClick() {
    if (!this.parentConfig || !this.parentConfig.url) {
      this.snackBar.open('Impossible de tester: URL de configuration non disponible', 'Fermer', { duration: 3000 });
      return;
    }

    const methodData = this.ApiMethodForm.value;
    
    const requestData = {
      ...methodData,
      url: this.parentConfig.url,
      headers: this.parentConfig.headers || ''
    };

    this.tiersService.importtestProducts(requestData).subscribe({
      next: (response) => {
        this.produits = response || [];
        const exampleProducts = response.slice(0, 5);
        
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

  getAvailableTargets(index: number): string[] {
    const selectedTargets = this.ApiMethodForm.get('fieldMappings')?.value
      .map((mapping: any, i: number) => i !== index ? mapping.target : null)
      .filter((target: string | null) => target !== null);
  
    return this.targetFields.filter(field => !selectedTargets.includes(field));
  }
}