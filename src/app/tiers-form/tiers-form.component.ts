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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
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
      MatCardModule
      
      
        ],
  templateUrl: './tiers-form.component.html',
  styleUrl: './tiers-form.component.css'
})
export class TiersFormComponent {
  tiersInfoForm: FormGroup;
  configForm: FormGroup;
  fieldMappingsForm: FormGroup;
  produits: Product[] = [];
  targetFields = ['name', 'description', 'price', 'url', 'reference'];
  parsedJson: any = null;
  selectedPath: string = '';
  expandedPaths: Set<string> = new Set(['$']);
  error: string = '';
  testResponse: any = null;

  constructor(private fb: FormBuilder,
     private tiersService: TiersService,
      private router: Router,
      private dialog: MatDialog,
          private snackBar: MatSnackBar
  ) {
    this.tiersInfoForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      numero: ['', Validators.required],
    });
    this.configForm = this.fb.group({
      configName: [''],
      url: [''],
      headers: [''],
      httpMethod: [''],
      endpoint: [''],
      methodHeaders: [''],
      paginated: [false],
      paginationParamName: [''],
      totalPagesFieldInResponse: [''],
      contentFieldInResponse: [''],
      type: [''],
      payloadTemplates: this.fb.array([])

    });
    this.configForm.get('paginated')?.valueChanges.subscribe(paginated => {
      if (paginated) {
        this.configForm.get('paginationParamName')?.setValidators(Validators.required);
        this.configForm.get('totalPagesFieldInResponse')?.setValidators(Validators.required);
      } else {
        this.configForm.get('paginationParamName')?.clearValidators();
        this.configForm.get('totalPagesFieldInResponse')?.clearValidators();
      }
    
    });
    this.configForm.get('httpMethod')?.valueChanges.subscribe(method => {
      if (method === 'POST' && this.payloadTemplates.length === 0) {
        this.payloadTemplates.push(this.fb.group({
          pathParam: [''],
          payloadSchema: [''],
          succesRespone: [''],
          template: ['']
        }));
      }
    
      if (method !== 'POST') {
        this.payloadTemplates.clear();
      }
    });
    

    this.fieldMappingsForm = this.fb.group({
      fieldMappings: this.fb.array([])
    });
    this.addFieldMapping()

  }

  get fieldMappings(): FormArray {
    return this.fieldMappingsForm.get('fieldMappings') as FormArray;
  }

  addFieldMapping(): void {
    const isFirstMapping = this.fieldMappings.length === 0;
  
    const mappingGroup = this.fb.group({
      source: ['', isFirstMapping ? Validators.required : []],
      target: [isFirstMapping ? 'reference' : '']
    });
  
    this.fieldMappings.push(mappingGroup);
  }

  removeFieldMapping(index: number) {
    this.fieldMappings.removeAt(index);
  }
  onSubmittiers() {
      if (this.tiersInfoForm.invalid  ) {
      alert('Formulaire incomplet !');
      return;
    }
    const request: TiersRequest = {
      ...this.tiersInfoForm.value,
    };

    console.log(request);

    this.tiersService.createTiers(request).subscribe({
      next: (response) => {
        alert('Tiers ajouté avec succès !');
         this.router.navigate(['success/tiers'])

         this.resetForms();
      },
      error: (err) => {
        alert('Erreur lors de l\'ajout du tiers : ' + (err.error?.message || 'Erreur inconnue'));
      }
    });
  }
  onSubmit1() {
    if (this.tiersInfoForm.invalid  ) {
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
       this.router.navigate(['success/tiers'])

       this.resetForms();
    },
    error: (err) => {
      alert('Erreur lors de l\'ajout du tiers : ' + (err.error?.message || 'Erreur inconnue'));
    }
  });
}
  

  onSubmit() {
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
         this.router.navigate(['success/tiers'])

         this.resetForms();
      },
      error: (err) => {
        alert('Erreur lors de l\'ajout du tiers : ' + (err.error?.message || 'Erreur inconnue'));
      }
    });
  }
  get payloadTemplates(): FormArray {
    return this.configForm.get('payloadTemplates') as FormArray;
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
  const selectedTargets = this.fieldMappings.controls
    .map((control, i) => i !== index ? control.get('target')?.value : null)
    .filter(target => target !== null);

  return this.targetFields.filter(field => !selectedTargets.includes(field));
}
testApiFromForm(): void {
  const url = this.configForm.get('url')?.value;
  const endpoint = this.configForm.get('endpoint')?.value;

  if (!url || !endpoint) {
    this.snackBar.open('Veuillez saisir à la fois l’URL de base et l’endpoint.', 'Fermer', { duration: 3000 });
    return;
  }

  this.tiersService.testExternalApi(url, endpoint).subscribe({
    next: (response) => {
      this.testResponse = response;
      this.parsedJson = response; // pour activer l’exploration JSON
      this.expandedPaths = new Set(['$']); // expand root
      this.error = '';
      this.selectedPath = '';
    },
    error: (error) => {
      this.testResponse = error.error;
      this.parsedJson = error.error; // si tu veux explorer aussi les erreurs
      this.expandedPaths = new Set(['$']);
      this.error = '';
      this.selectedPath = '';
    }
  });
}
isObject(value: any): boolean {
  return value !== null && typeof value === 'object';
}

isArray(value: any): boolean {
  return Array.isArray(value);
}

getObjectKeys(obj: any): string[] {
  return Object.keys(obj);
}

formatValue(value: any): string {
  if (this.isArray(value)) return `[${value.length} éléments]`;
  if (typeof value === 'string') return `"${value}"`;
  if (value === null) return 'null';
  return String(value);
}

selectPath(path: string): void {
  this.selectedPath = path.replace(/\[\d+\]/g, '[*]');
}

isExpanded(path: string): boolean {
  return this.expandedPaths.has(path);
}

toggleExpand(path: string): void {
  if (this.expandedPaths.has(path)) {
    this.expandedPaths.delete(path);
  } else {
    this.expandedPaths.add(path);
  }
}

getChildPath(parentPath: string, key: string): string {
  if (this.isArray(this.getNodeByPath(parentPath))) {
    return `${parentPath}[${key}]`;
  }
  return parentPath === '$' ? `$.${key}` : `${parentPath}.${key}`;
}

getType(value: any): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

getNodeByPath(path: string): any {
  const pathParts = this.parseJsonPath(path);
  let current = this.parsedJson;

  for (const part of pathParts) {
    if (current === undefined || current === null) return null;
    current = current[part];
  }

  return current;
}

private parseJsonPath(path: string): (string | number)[] {
  if (path === '$') return [];

  const parts = path.substring(2).split(/\.|\[|\]/g).filter(p => p !== '');
  return parts.map(p => isNaN(Number(p)) ? p : Number(p));
}


}