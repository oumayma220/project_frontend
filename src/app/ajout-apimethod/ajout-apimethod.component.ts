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
import { NgZone } from '@angular/core'; 
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';
import { Field } from '../Field';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { TestdragComponent } from '../testdrag/testdrag.component';
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
          MatFormFieldModule,
          NgxJsonViewerModule ],
  templateUrl: './ajout-apimethod.component.html',
  styleUrl: './ajout-apimethod.component.css'
})
export class AjoutApimethodComponent implements OnInit, AfterViewInit  {
  configId!: number;
  tiersId!: number;
  ApiMethodForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  tiersNom!: string;
  httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  parentConfig: any;
  produits: Product[] = [];
  targetFields = ['name', 'description', 'price', 'url', 'reference'];
  parsedJson: any = null;
  selectedPath: string = '';
  expandedPaths: Set<string> = new Set(['$']);
  error: string = '';
  testResponse: any = null;
  variables: string[] = ['employeId','nomEmploye', 'produitId', 'nomProduit', 'prixUnitaire','total', 'quantite','adresse','dateCommande'];
  blocks: string[] = [
    '{{#each lignes}}',
    '{{#unless @last}},{{/unless}}{{/each}}'
  ];
  templateText: string = '';
  validationMessage: string = '';
  isValid: boolean = true;
  isDragOver: boolean = false;
  schemaFields: Field[] = [];
  generatedSchema: any = {};


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tiersService: TiersService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone, 
    private snackBar: MatSnackBar,private dialog: MatDialog
  ) {

   }
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

    this.tiersService.getTiersIdByConfigId(this.configId).subscribe({
      next: (tiersId) => {
        console.log('tiersId:', tiersId);
        this.tiersId = tiersId;
    
        // Une fois le tiersId récupéré, vérifier s'il a déjà une méthode POST
        this.tiersService.hasPostMethodForTiers(this.tiersId).subscribe({
          next: (hasPost: boolean) => {
            // Ne garder POST que s’il n’est pas encore utilisé
            this.httpMethods = hasPost
              ? ['GET', 'PUT', 'DELETE']
              : ['GET', 'POST', 'PUT', 'DELETE'];
          },
          error: (err) => {
            console.error('Erreur lors de la vérification de la méthode POST :', err);
            // En cas d’erreur, on garde toutes les méthodes par défaut
            this.httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du tiersId :', err);
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
      fieldMappings: this.fb.array([]),
      payloadTemplates: this.fb.array([]) 
      
          });    
    this.ApiMethodForm.get('httpMethod')?.valueChanges.subscribe(method => {
      if (method === 'POST' && this.payloadTemplates.length === 0) {
        this.payloadTemplates.push(this.fb.group({
          // pathParam: [''],
          payloadSchema: [''],
          succesRespone: [''],
          template: ['']
        }));
      }
    
      if (method !== 'POST') {
        this.payloadTemplates.clear();
      }
    });
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
  get payloadTemplates(): FormArray {
    return this.ApiMethodForm.get('payloadTemplates') as FormArray;
  }
  
  
  get fieldMappings(): FormArray {
    return this.ApiMethodForm.get('fieldMappings') as FormArray;
  }

  addFieldMapping(): void {
    const isFirstMapping = this.fieldMappings.length === 0;
  
    const mappingGroup = this.fb.group({
      source: ['', isFirstMapping ? Validators.required : []],
      target: [isFirstMapping ? 'reference' : '']
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
    if (this.isGetMethod() &&this.ApiMethodForm.invalid) {
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
        this.router.navigate(['success/configlist', this.tiersId]);

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
  isGetMethod(): boolean {
    return this.ApiMethodForm.get('httpMethod')?.value === 'GET';
  }
  isPostMethod(): boolean {
    return this.ApiMethodForm.get('httpMethod')?.value === 'POST';
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
  testApiFromForm(): void {
    const url = this.parentConfig.url;
    const endpoint = this.ApiMethodForm.get('endpoint')?.value;
  
    if (!url || !endpoint) {
      this.snackBar.open('Veuillez saisir à la fois l’URL de base et l’endpoint.', 'Fermer', { duration: 3000 });
      return;
    }
  
    this.tiersService.testExternalApi(url, endpoint).subscribe({
      next: (response) => {
        this.testResponse = response;
        this.parsedJson = response; 
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
  
  onDragStart(event: DragEvent, item: string, isVariable: boolean = false) {
    if (event.dataTransfer) {
      // Ajoute {{}} seulement si c'est une variable
      const data = isVariable ? `{{${item}}}` : item;
      event.dataTransfer.setData('text/plain', data);
    }
  }



  onDragOver(event: DragEvent) {
    event.preventDefault(); // Important pour permettre le drop
    this.isDragOver = true;

  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer) {
      const data = event.dataTransfer.getData('text/plain');
      const target = event.target as HTMLTextAreaElement;
      const cursorPos = target.selectionStart || this.templateText.length;
      
      this.templateText = 
        this.templateText.slice(0, cursorPos) + 
        data + 
        this.templateText.slice(cursorPos);
    }
  }
  onDragLeave(event: DragEvent) {
    this.isDragOver = false;
  }
  validateTemplate() {
    const placeholders = [...this.templateText.matchAll(/{{\s*(\w+)\s*}}/g)].map(match => match[1]);
    const invalidPlaceholders = placeholders.filter(ph => !this.variables.includes(ph));

    if (invalidPlaceholders.length > 0) {
      this.isValid = false;
      this.validationMessage = `Erreur: Ces placeholders ne sont pas autorisés: ${invalidPlaceholders.join(', ')}`;
    } else {
      this.isValid = true;
      this.validationMessage = 'Template valide ✅';
    }
  }
  openHelpDialogtemplate() {
    this.dialog.open(HelpDialogComponent, {
      width: '1100px'
    });
  }
  //payloadSchema 
  
  openDialog1() {
    this.dialog.open(TestdragComponent, {
      width: '80%',
      height: '80%'
    });
  }

  //ajout
   }