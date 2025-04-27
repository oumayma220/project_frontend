import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-help-dialog',
  standalone: true,
  imports: [MatDialogModule],
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
// handlebarsBlocks: { [key: string]: string } = {
//   each: '{{#each lignes}}',
//   unless: '{{#unless @last}}',
//   endEach: '{{/each}}',
//   endUnless: '{{/unless}}'
// };

}
