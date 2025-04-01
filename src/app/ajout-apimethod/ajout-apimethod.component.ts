import { Component, OnInit } from '@angular/core';
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
export class AjoutApimethodComponent implements OnInit {
  configId!: number;
  ApiMethodForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  tiersNom!: string;
  httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  parentConfig: any;
  produits: Product[] = [];




  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tiersService: TiersService,
    private snackBar: MatSnackBar,private dialog: MatDialog
  ) { }

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

    // Ajout d'un mapping par défaut
    this.addFieldMapping();

    // Gérer l'affichage conditionnel des champs de pagination
    this.ApiMethodForm.get('paginated')?.valueChanges.subscribe((paginated: boolean) => {
      if (!paginated) {
        this.ApiMethodForm.get('paginationParamName')?.reset('');
        this.ApiMethodForm.get('pageSizeParamName')?.reset('');
        this.ApiMethodForm.get('totalPagesFieldInResponse')?.reset('');
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
      height:'650px'
    });
}

  onSubmit(): void {
    if (this.ApiMethodForm.invalid) {
      this.ApiMethodForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const configData = this.ApiMethodForm.value;
    console.log('Configuration envoyée:', configData);

    this.tiersService.addApiMethodAndFieldMappings(this.configId, configData).subscribe({
      next: () => {
        this.successMessage = 'Configuration ajoutée avec succès !';
        this.snackBar.open('Configuration enregistrée', 'Fermer', { duration: 3000 });
        this.router.navigate(['/tiers', this.configId]);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = "Une erreur s'est produite lors de l'ajout de la configuration.";
      }
    });
  }
 
  onTestClick() {
    if (!this.parentConfig || !this.parentConfig.url) {
      this.snackBar.open('Impossible de tester: URL de configuration non disponible', 'Fermer', { duration: 3000 });
      return;
    }

    const methodData = this.ApiMethodForm.value;
    
    // Créer un objet combiné avec les données du formulaire et l'URL de la configuration parente
    const requestData = {
      ...methodData,
      url: this.parentConfig.url,
      // Si nécessaire, ajoutez d'autres champs de la configuration parente
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
}
