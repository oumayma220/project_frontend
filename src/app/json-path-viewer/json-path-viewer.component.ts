import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-json-path-viewer',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatButtonModule , MatTabsModule
  ],
  templateUrl: './json-path-viewer.component.html',
  styleUrl: './json-path-viewer.component.css'
})
export class JsonPathViewerComponent {
  jsonInput: string = '';
  parsedJson: any = null;
  error: string = '';
  selectedPath: string = '';
  expandedPaths: Set<string> = new Set(['$']);

  parseJson(): void {
    if (!this.jsonInput.trim()) {
      this.error = 'Veuillez entrer du JSON';
      this.parsedJson = null;
      return;
    }

    try {
      this.parsedJson = JSON.parse(this.jsonInput);
      this.error = '';
      this.selectedPath = '';
      this.expandedPaths = new Set(['$']);  // Reset expanded state, but keep root expanded
    } catch (e) {
      this.error = `Erreur de parsing JSON: ${e instanceof Error ? e.message : String(e)}`;
      this.parsedJson = null;
    }
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
    if (this.isArray(value)) {
      return `[${value.length} éléments]`;
    }
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    if (value === null) {
      return 'null';
    }
    return String(value);
  }

  isNumerical(key: string): boolean {
    return /^\d+$/.test(key);
  }

  selectPath(path: string): void {
    // this.selectedPath = path;
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

