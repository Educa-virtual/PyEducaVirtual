import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import Tesseract from 'tesseract.js';

@Component({
  selector: 'app-ocr-reader',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ProgressBarModule, CardModule, MessageModule],
  providers: [MessageService],
  template: `
    <p-card header="Lector OCR con Tesseract.js">
      <p-fileUpload
        name="file"
        accept="image/*"
        mode="basic"
        chooseLabel="Seleccionar imagen"
        (onSelect)="onImageUpload($event)"
      >
      </p-fileUpload>

      <div class="mt-4" *ngIf="progress() > 0 && progress() < 100">
        <p>Procesando OCR... {{ progress() }}%</p>
        <p-progressBar [value]="progress()"></p-progressBar>
      </div>

      <div class="mt-4" *ngIf="textResult()">
        <h3>Resultado:</h3>
        <p>{{ textResult() }}</p>
      </div>
    </p-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class OcrReaderComponent {
  progress = signal(0);
  textResult = signal('');

  onImageUpload(event: any) {
    const file: File = event.files?.[0];
    if (!file) return;

    this.progress.set(1);
    this.textResult.set('');

    Tesseract.recognize(file, 'spa', {
      logger: m => {
        if (m.status === 'recognizing text') {
          this.progress.set(Math.floor(m.progress * 100));
        }
      },
    })
      .then(result => {
        this.textResult.set(result.data.text);
        this.progress.set(100);
      })
      .catch(err => {
        console.error('OCR error:', err);
        this.progress.set(0);
      });
  }
}
