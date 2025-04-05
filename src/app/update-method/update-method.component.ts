import { Component, Inject, OnInit } from '@angular/core';
import { TiersService } from '../Service/tiers.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { ActivatedRoute } from '@angular/router';
import { Config } from '../Config';
import { TestComponent } from '../test/test.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../Product';

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
  config: Config | null = null; 
    produits: Product[] = [];
  
  constructor(
    private fb: FormBuilder,
    private tiersService: TiersService,  
    private route: ActivatedRoute,
        private snackBar: MatSnackBar,private dialog: MatDialog,
    
    private dialogRef: MatDialogRef<UpdateMethodComponent>,  
    @Inject(MAT_DIALOG_DATA) public data: any  
  ) {
    this.configForm = this.fb.group({
      httpMethod: [this.data.httpMethod, Validators.required],
      endpoint: [this.data.endpoint, Validators.required,],
      methodHeaders: [this.data.methodHeaders],
      paginated: [this.data.paginated || false],
      paginationParamName: [this.data.paginationParamName],
      // pageSizeParamName: [this.data.pageSizeParamName],
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
    this.config = data.config;

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
  onTestClick() {
    if (!this.config || !this.config.url) {
      this.snackBar.open("Configuration invalide : l'URL est manquante.", 'Fermer', { duration: 3000 });
      return;
    }
    console.log('URL de la configuration récupérée:', this.config.url);

    const methodData = this.configForm.value;
    const requestData = {
      ...methodData,
      url: this.config.url,
      headers: this.config.headers || ''
    };
    console.log('URL utilisée pour le test :', requestData.url);
    console.log('endpint utilisée pour le test :', requestData.endpoint);

    this.tiersService.importtestProducts(requestData).subscribe({
      next: (response) => {
        this.produits = response || [];
        const exampleProducts = this.produits.slice(0, 5);

        const dialogRef = this.dialog.open(TestComponent, {
          width: '800px',
          data: {
            success: exampleProducts.length > 0,
            message: exampleProducts.length > 0
              ? `Test réussi : ${this.produits.length} produits ont été trouvés.`
              : 'Aucun produit n\'a été trouvé.',
            products: exampleProducts
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.onSubmit();
          }
        });
      },
      error: () => {
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


  

  onCancel() {
    this.dialogRef.close();  
  }}