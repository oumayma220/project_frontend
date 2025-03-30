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
import { Product } from '../Product';
import { MatCell, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatRow, MatTable, MatTableModule } from '@angular/material/table';
import { TestComponent } from '../test/test.component';



@Component({
  selector: 'app-ajout-configuration',
  standalone: true,
  imports: [
    FormsModule,
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
    MatTableModule,
    MatInputModule
        ],
  templateUrl: './ajout-configuration.component.html',
  styleUrl: './ajout-configuration.component.css'
})
export class AjoutConfigurationComponent implements OnInit {

  tiersId!: number;
  configForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  tiersNom!: string;
  produits: Product[] = [];

  httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
targetFields = ['name', 'description', 'price', 'url', 'reference'];
//displayedColumns: string[] = ['name', 'description', 'price', 'reference', 'url'];



  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tiersService: TiersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.tiersId = Number(this.route.snapshot.paramMap.get('tiersId'));
    this.getTiersNom();

    this.configForm = this.fb.group({
      configName: ['', Validators.required],
      url: ['', Validators.required],
      headers: [''],
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
    this.configForm.get('paginated')?.valueChanges.subscribe((paginated: boolean) => {
      if (!paginated) {
        // Si la pagination est désactivée, on nettoie les champs
        this.configForm.get('paginationParamName')?.reset('');
        this.configForm.get('pageSizeParamName')?.reset('');
        this.configForm.get('totalPagesFieldInResponse')?.reset('');
      }
    });
  }

  get fieldMappings(): FormArray {
    return this.configForm.get('fieldMappings') as FormArray;
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

  getTiersNom(): void {
    this.tiersService.getTiersById(this.tiersId).subscribe({
      next: (tiers) => {
        this.tiersNom = tiers.nom;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du tiers :', err);
      }
    });
  }

  onSubmit(): void {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const configData = this.configForm.value;
    console.log('Configuration envoyée:', configData);

    this.tiersService.addConfigToTiers(this.tiersId, configData).subscribe({
      next: () => {
        this.successMessage = 'Configuration ajoutée avec succès !';
        this.snackBar.open('Configuration enregistrée', 'Fermer', { duration: 3000 });
        this.router.navigate(['adminhome/configlist', this.tiersId]);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = "Une erreur s'est produite lors de l'ajout de la configuration.";
      }
    });
  }
  openHelpDialog() {
      this.dialog.open(HelpMappingComponent, {
        width: '1800px',
        height:'650px'
      });
  }
  onCancel() {
    this.router.navigate(['adminhome/configlist', this.tiersId]);
  }
  
  onTestClick() {
    const requestData = this.configForm.value;
    this.tiersService.importtestProducts(requestData).subscribe({
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
              ? `Test réussi : ${this.produits.length} produits ont été trouvés pour cette configuartion , voici quelques exemples : ` 
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
  }}