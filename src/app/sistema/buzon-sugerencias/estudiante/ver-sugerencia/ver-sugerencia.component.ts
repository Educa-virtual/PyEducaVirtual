import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { BuzonSugerenciasEstudianteService } from '../services/buzon-sugerencias-estudiante.service';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-ver-sugerencia',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule, EditorModule],
  templateUrl: './ver-sugerencia.component.html',
  styleUrl: './ver-sugerencia.component.scss',
})
export class VerSugerenciaComponent implements OnInit, OnChanges {
  @Input() vista: string = 'estudiante';
  @Input() visible: boolean = false;
  @Input() titulo: string = 'Ver sugerencia';
  @Output() cerrarDialogVerSugerenciaEvent = new EventEmitter<boolean>();
  form: FormGroup;
  @Input() selectedItem: any = null;
  sugerenciaHtml: SafeHtml = '';
  respuestaHtml: SafeHtml = '';
  archivos: any[] = [];
  constructor(
    private fb: FormBuilder,
    private buzonSugerenciasService: BuzonSugerenciasEstudianteService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      cNombreEstudiante: [null],
      dtFechaCreacion: [null],
      cAsunto: [null],
      cPrioridadNombre: [null],
      cSugerencia: [null],
      cRespuesta: [null],
      dtFechaRespuesta: [null],
      cNombreDirector: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue === true) {
      this.form.patchValue({
        cNombreEstudiante: this.selectedItem?.cNombreEstudiante,
        dtFechaCreacion: this.selectedItem?.dtFechaCreacion,
        cAsunto: this.selectedItem?.cAsunto,
        cPrioridadNombre: this.selectedItem?.cPrioridadNombre,
        cSugerencia: this.selectedItem?.cSugerencia,
        cRespuesta: this.selectedItem?.cRespuesta,
        dtFechaRespuesta: this.selectedItem?.dtFechaRespuesta,
        cNombreDirector: this.selectedItem?.cNombreDirector,
      });
      this.sugerenciaHtml = this.sanitizer.bypassSecurityTrustHtml(
        this.form.get('cSugerencia')?.value
      );
      this.respuestaHtml = this.sanitizer.bypassSecurityTrustHtml(
        this.form.get('cRespuesta')?.value
      );
      this.obtenerArchivosSugerencia();
    }
  }

  obtenerArchivosSugerencia() {
    this.buzonSugerenciasService
      .obtenerListaArchivosSugerencia(this.selectedItem?.iSugerenciaId)
      .subscribe((response: any) => {
        this.archivos = response.data;
      });
  }

  descargarArchivo(event: Event, archivo: string) {
    event.preventDefault();
    this.buzonSugerenciasService
      .descargarArchivoSugerencia(this.selectedItem?.iSugerenciaId, archivo)
      .subscribe({
        next: (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = archivo;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al descargar el archivo',
            detail: error.message,
          });
        },
      });
  }

  cerrarDialog() {
    this.archivos = [];
    this.form.reset();
    this.cerrarDialogVerSugerenciaEvent.emit(false);
  }
}
