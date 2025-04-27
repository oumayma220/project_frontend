import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { TestComponent } from '../test/test.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


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
    MatInputModule,
    DragDropModule
  ],
  templateUrl: './ajout-configuration.component.html',
  styleUrl: './ajout-configuration.component.css'
})
export class AjoutConfigurationComponent implements OnInit, AfterViewInit {

  tiersId!: number;
  baseConfigForm!: FormGroup;
  advancedConfigForm!: FormGroup;
  testResponse: any = null;
  completeForm!: FormGroup;
  payloadTemplateForm!: FormGroup;

  parsedJson: any = null;
  selectedPath: string = '';
  expandedPaths: Set<string> = new Set(['$']);
  error: string = '';
  successMessage = '';
  errorMessage = '';
  tiersNom!: string;
  produits: Product[] = [];

  httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  targetFields = ['name', 'description', 'price', 'url', 'reference'];
  variables: string[] = ['employeId', 'produitId', 'nomProduit', 'prixUnitaire','total', 'quantite'];
  blocks: string[] = [
    '{{#each lignes}}',
    '{{#unless @last}},{{/unless}}{{/each}}'
  ];
  templateText: string = '';
  validationMessage: string = '';
  isValid: boolean = true;
  isDragOver: boolean = false;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tiersService: TiersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.tiersId = Number(this.route.snapshot.paramMap.get('tiersId'));
    this.getTiersNom();
    this.initializeFormGroups();
    
    this.advancedConfigForm.get('paginated')?.valueChanges.subscribe(paginated => {
      this.zone.run(() => {
        this.updatePaginationValidators(paginated);
      });
    });
    
    this.baseConfigForm.get('httpMethod')?.valueChanges.subscribe(method => {
      this.zone.run(() => {
        if (method === 'GET') {
          this.advancedConfigForm.get('type')?.setValidators(Validators.required);
        } else {
          this.advancedConfigForm.get('type')?.clearValidators();
        }
        this.advancedConfigForm.get('type')?.updateValueAndValidity();
      });
    });
  }

  private initializeFormGroups(): void {
    this.baseConfigForm = this.fb.group({
      configName: ['', Validators.required],
      url: ['', Validators.required],
      headers: [''],
      httpMethod: ['', Validators.required],
      endpoint: ['', Validators.required],
      methodHeaders: ['']
    });

    this.advancedConfigForm = this.fb.group({
      paginated: [false],
      paginationParamName: [''],
      totalPagesFieldInResponse: [''],
      contentFieldInResponse: [''],
      type: [''],
      fieldMappings: this.fb.array([])

    });
   
      this.addFieldMapping();
      this.payloadTemplateForm = this.fb.group({
        payloadTemplates: this.fb.array([])
    });
    this.addPayloadTemplate(); 
  }
  get payloadTemplates(): FormArray {
    return this.payloadTemplateForm.get('payloadTemplates') as FormArray;
}

addPayloadTemplate(template: string = '', payloadSchema: string='', succesRespone: string=''): void {
    const templateGroup = this.fb.group({
        template: [template, Validators.required],
        payloadSchema: [payloadSchema, Validators.required],
        succesRespone: [succesRespone, Validators.required]
        // pathParam: [pathParam]
    });
    this.payloadTemplates.push(templateGroup);
}

removePayloadTemplate(index: number): void {
    this.payloadTemplates.removeAt(index);
}

  private updatePaginationValidators(paginated: boolean): void {
    const paginationControls = [
      'paginationParamName',
      'totalPagesFieldInResponse'
    ];

    paginationControls.forEach(controlName => {
      const control = this.advancedConfigForm.get(controlName);
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

  get fieldMappings(): FormArray {
    return this.advancedConfigForm.get('fieldMappings') as FormArray;
  }

  isGetMethod(): boolean {
    return this.baseConfigForm.get('httpMethod')?.value === 'GET';
  }
  isPostMethod(): boolean {
    return this.baseConfigForm.get('httpMethod')?.value === 'POST';
  }


  getSourcePlaceholder(): string {
    const type = this.advancedConfigForm.get('type')?.value;
    return type === 'reflection' ? 'name' : '$.name';
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

  mergeFormData(): any {
    return {
      ...this.baseConfigForm.value,
      ...this.advancedConfigForm.value,
      ...this.payloadTemplateForm.value
    };
  }

  onSubmit(): void {
    if (this.baseConfigForm.invalid || 
        (this.isGetMethod() && this.advancedConfigForm.invalid) 
        ) {
      
      this.baseConfigForm.markAllAsTouched();
      this.advancedConfigForm.markAllAsTouched();
      
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const configData = this.mergeFormData();
    console.log('Configuration envoyée:', configData);

    this.tiersService.addConfigToTiers(this.tiersId, configData).subscribe({
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

  onTestClick() {
    const requestData = this.mergeFormData();
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

  openHelpDialog() {
    this.dialog.open(HelpMappingComponent, {
      width: '1800px',
      height:'650px'
    });
  }

  onCancel() {
    this.router.navigate(['success/configlist', this.tiersId]);
  }

  getAvailableTargets(index: number): string[] {
    const selectedTargets = this.advancedConfigForm.get('fieldMappings')?.value
      .map((mapping: any, i: number) => i !== index ? mapping.target : null)
      .filter((target: string | null) => target !== null);
  
    return this.targetFields.filter(field => !selectedTargets.includes(field));
  }
 
  testApiFromForm(): void {
    const url = this.baseConfigForm.get('url')?.value;
    const endpoint = this.baseConfigForm.get('endpoint')?.value;
  
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
  
  
}