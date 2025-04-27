import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-testdrag',
  standalone: true,
  imports: [FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  CommonModule],
  templateUrl: './testdrag.component.html',
  styleUrl: './testdrag.component.css'
})
export class TestdragComponent {
  variables: string[] = ['employeId', 'produitId', 'nomProduit', 'prixUnitaire', 'quantite'];
  blocks: string[] = [
    '{{#each lignes}}',
    '{{#unless @last}},{{/unless}}{{/each}}'
  ];

  
  templateText: string = '';

  validationMessage: string = '';
  isValid: boolean = true;
  // onDragStart(event: DragEvent, variable: string) {
  //   if (event.dataTransfer) {
  //     event.dataTransfer.setData('text/plain', `{{${variable}}}`);
  //   }
  // }
  onDragStart(event: DragEvent, item: string, isVariable: boolean = false) {
    if (event.dataTransfer) {
      // Ajoute {{}} seulement si c'est une variable
      const data = isVariable ? `{{${item}}}` : item;
      event.dataTransfer.setData('text/plain', data);
    }
  }



  onDragOver(event: DragEvent) {
    event.preventDefault(); // Important pour permettre le drop
  }

  
  onDrop(event: DragEvent) {
    event.preventDefault();
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



