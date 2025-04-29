import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxJsonViewerModule } from 'ngx-json-viewer'; // Importez le module
 import { Field } from '../Field';




@Component({
  selector: 'app-testdrag',
  standalone: true,
  imports: [FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  CommonModule,
  NgxJsonViewerModule],
  templateUrl: './testdrag.component.html',
  styleUrl: './testdrag.component.css'
})
export class TestdragComponent {
fields: Field[] = [];
generatedSchema: any = {};
addField(fieldsArray: Field[]) {
  fieldsArray.push({
    name: '',
    type: 'string',
    required: false
  });
}

removeField(fieldsArray: Field[], index: number) {
  fieldsArray.splice(index, 1);
}

onTypeChange(field: Field) {
  if (field.type === 'object' || field.type === 'array') {
    field.children = [];
  } else {
    delete field.children;
  }
}

generateSchema() {
  this.generatedSchema = this.buildSchema(this.fields);
}

buildSchema(fields: Field[]): any {
  const properties: any = {};
  const required: string[] = [];

  for (const field of fields) {
    let fieldSchema: any = {};

    if (field.type === 'object') {
      const childSchema = this.buildSchema(field.children || []);
      fieldSchema = {
        type: 'object',
        properties: childSchema.properties
      };
      if (childSchema.required && childSchema.required.length > 0) {
        fieldSchema.required = childSchema.required;
      }
    } else if (field.type === 'array') {
      const childSchema = this.buildSchema(field.children || []);
      fieldSchema = {
        type: 'array',
        items: {
          type: 'object',
          properties: childSchema.properties
        }
      };
      if (childSchema.required && childSchema.required.length > 0) {
        fieldSchema.items.required = childSchema.required;
      }
    } else {
      fieldSchema = { type: field.type };
    }

    properties[field.name] = fieldSchema;

    if (field.required) {
      required.push(field.name);
    }
  }

  const schema: any = {
    type: 'object',
    properties: properties
  };

  if (required.length > 0) {
    schema.required = required;
  }

  return schema;
}
copyToClipboard() {
  const jsonString = JSON.stringify(this.generatedSchema, null, 2); // formaté avec indentation
  navigator.clipboard.writeText(jsonString)
    .then(() => {
      alert('JSON copié dans le presse-papiers !');
    })
    .catch(err => {
      console.error('Erreur de copie :', err);
    });
}




  }



