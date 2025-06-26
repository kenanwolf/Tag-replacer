import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Tag {
  key: string;
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  inputText = 'It supports \\{escaping} and it ignores {unknown} tags';
  result = '';
  tags: Tag[] = [];
  detectedTags: string[] = [];
  newTagInput = '';

  constructor(private snackBar: MatSnackBar) {
    // Initialize with demo data
    setTimeout(() => {
      this.onInputChange();
    }, 100);
  }

  addTag(key: string = '', value: string = ''): void {
    const newTag: Tag = { key, value };
    this.tags.push(newTag);
    this.processText();
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
    this.processText();
  }

  addNewTag(): void {
    const key = this.newTagInput.trim();
    
    if (!key) {
      this.showNotification('Please enter a tag identifier', 'error');
      return;
    }
    
    if (!this.isValid(key)) {
      this.showNotification('Tag must start with a letter and contain only letters, numbers, or underscores', 'error');
      return;
    }
    
    if (this.tags.find(t => t.key === key)) {
      this.showNotification('Tag already exists', 'error');
      return;
    }
    
    this.addTag(key, '');
    this.newTagInput = '';
    this.showNotification(`Tag "${key}" added successfully`, 'success');
  }

  isValid(tag: string): boolean {
    return /^[A-Za-z][A-Za-z0-9_]*$/.test(tag);
  }
    //findet all gültigen Platzhalter im Text
  detectTags(text: string): string[] {
    const tagRegex = /(?<!\\){([A-Za-z][A-Za-z0-9_]*)}/g;
    const matches = [...text.matchAll(tagRegex)];
    return [...new Set(matches.map(match => match[1]))]; 
  }

  onInputChange(): void {//wird aufgerufen wenn der input text sich ändert
    this.updateDetectedTags(); // anaylisert den neuen eingabewert
    this.processText();// ersetzen
  }

  onTagValueChange(): void {//sofortige anzeigen von text
    this.processText();
  }

  updateDetectedTags(): void {
    this.detectedTags = this.detectTags(this.inputText);
    
    // Auto-add detected tags that aren't configured yet
    this.detectedTags.forEach(tagKey => {
      if (!this.tags.find(t => t.key === tagKey)) {
        this.addTag(tagKey, '');
      }
    });
    
    // Remove tags that are no longer in the text and have no value
    this.tags = this.tags.filter(tag => 
      this.detectedTags.includes(tag.key) || tag.value !== ''
    );
  }

  processText(): void {
    if (!this.inputText.trim()) { //wemm der nutzer nur leerzeichen, etc eingibt wird leer ausgegebne
      this.result = '';
      return;
    }

    let output = this.inputText;

    this.tags.forEach(tag => {
      if (tag.key && tag.value) {
        const regex = new RegExp(`(?<!\\\\){${tag.key}}`, 'g');
        output = output.replace(regex, tag.value);
      }
    });

    output = output
      .replace(/\\{([^}]+)}/g, '{$1}')
      .replace(/\\\\/g, '\\')
      .replace(/\\(.)/g, '$1');

    this.result = output;
  }

  copyResult(): void {
    if (!this.result) {
      this.showNotification('No text to copy', 'error');
      return;
    }

    navigator.clipboard.writeText(this.result).then(() => {
      this.showNotification('✅ Text copied to clipboard!', 'success');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea'); //unsichtbarer textarea
      textArea.value = this.result;
      document.body.appendChild(textArea);
      textArea.select(); //text auswählen
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showNotification('✅ Text copied to clipboard!', 'success');
    });
  }

  focusAddInput(): void {
    const inputElement = document.querySelector('input[placeholder*="userName"]') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    const config = {
      duration: 3000,
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar'],
      horizontalPosition: 'right' as const,
      verticalPosition: 'top' as const,
    };

    this.snackBar.open(message, 'OK', config);
  }
  
}