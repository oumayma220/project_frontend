import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-help-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './help-dialog.component.html',
  styleUrl: './help-dialog.component.css'
})
export class HelpDialogComponent {
  payloadExample: string = `
  {
    "employe": {{employe}},
    "details": [
      {
        "ref": {{produitId}},
        "nom": "{{nomProduit}}",
        "prix": {{prixUnitaire}},
        "qte": {{quantite}}
      }
    ]
  }
  `;
  
    // Variables contenant les syntaxes Handlebars (sous forme de texte)
    hbEach = '{{#each lignes}}';
    hbEndEach = '{{/each}}';
    hbUnless = '{{#unless @last}},{{/unless}}';
    
    // Exemples d'utilisation prêts à afficher
    tableauSimple = `[
    {{#each lignes}}
      { 
        "produitId": {{produitId}},
        "nomProduit": "{{nomProduit}}",
        "quantite": {{quantite}}
      }{{#unless @last}},{{/unless}}
    {{/each}}
  ]`;
  
    objetJSON = `{
    "employe": {{employe}},
    "lignes": [
      {{#each lignes}}
      {
        "ref": {{produitId}},
        "nom": "{{nomProduit}}",
        "prix": {{prixUnitaire}},
        "qte": {{quantite}}
      }{{#unless @last}},{{/unless}}
      {{/each}}
    ]
  }`;
  helpText: string = `
  <code>{{#unless @last}},{{/unless}}</code> : Ajoute une virgule sauf après le dernier élément
`;
 helpText1: string = `
    Pour éviter les virgules en trop, utilisez <code>{{#unless @last}},{{/unless}}</code>
`;

  }