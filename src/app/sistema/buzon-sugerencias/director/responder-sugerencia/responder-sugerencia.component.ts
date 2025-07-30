import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { BuzonSugerenciasDirectorService } from '../services/buzon-sugerencias-director.service';
import { BuzonSugerenciasEstudianteService } from '../../estudiante/services/buzon-sugerencias-estudiante.service';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-responder-sugerencia',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule, CommonModule, EditorComponent],
  templateUrl: './responder-sugerencia.component.html',
  styleUrls: ['./responder-sugerencia.component.scss'],
  providers: [{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
})
export class ResponderSugerenciaComponent implements OnInit, OnChanges {
  form: FormGroup;
  @Input() visible: boolean = false;
  private _selectedItem: any;
  @Output() eventSugerenciaRespondida = new EventEmitter<any>();
  @Output() eventCerrarResponderSugerencia = new EventEmitter<boolean>();
  archivos: any;
  editorKey = 0;

  @Input()
  set selectedItem(value: any) {
    this._selectedItem = value;
    if (this.form && value) {
      this.form.patchValue({
        cNombreEstudiante: this._selectedItem?.cNombreEstudiante,
        dtFechaCreacion: this._selectedItem?.dtFechaCreacion,
        cAsunto: this._selectedItem?.cAsunto,
        cPrioridadNombre: this._selectedItem?.cPrioridadNombre,
        cSugerencia: this._selectedItem?.cSugerencia,
        cRespuesta: '',
      });
    }
  }
  get selectedItem(): any {
    return this._selectedItem;
  }

  initEnunciado: EditorComponent['init'] = {
    base_url: '/tinymce', // Root for resources
    suffix: '.min', // Suffix to use when loading resources
    menubar: false,
    selector: 'textarea',
    placeholder: 'Escribe aqui...',
    height: 200,
    plugins: 'lists image table',
    toolbar:
      'undo redo | bold italic underline strikethrough | ' +
      'alignleft aligncenter alignright alignjustify | bullist numlist',
    editable_root: true,
    paste_as_text: true,
    branding: false,
    statusbar: false,
  };

  constructor(
    private fb: FormBuilder,
    private buzonSugerenciasDirectorService: BuzonSugerenciasDirectorService,
    private buzonSugerenciasEstudianteService: BuzonSugerenciasEstudianteService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      cNombreEstudiante: [null],
      dtFechaCreacion: [null],
      cAsunto: [null],
      cPrioridadNombre: [null],
      cSugerencia: [null],
      cRespuesta: [null, Validators.required],
    });
  }

  obtenerArchivosSugerencia() {
    this.buzonSugerenciasEstudianteService
      .obtenerListaArchivosSugerencia(this.selectedItem?.iSugerenciaId)
      .subscribe((response: any) => {
        this.archivos = response.data;
      });
  }

  cerrarDialog() {
    this.archivos = [];
    this.form.reset();
    this.visible = false;
    this.eventCerrarResponderSugerencia.emit(false);
  }

  enviarRespuesta() {
    if (this.form.valid) {
      this.buzonSugerenciasDirectorService
        .responderSugerencia(this.selectedItem?.iSugerenciaId, this.form.get('cRespuesta')?.value)
        .subscribe({
          next: (respuesta: any) => {
            const enviar = {
              respuesta: this.form.get('cRespuesta')?.value,
              fecha: respuesta.data.fecha,
            };
            this.eventSugerenciaRespondida.emit(enviar);
            this.visible = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: respuesta.message,
            });
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
          },
        });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue === true) {
      this.editorKey++;

      this.form.patchValue({
        cNombreEstudiante: this.selectedItem?.cNombreEstudiante,
        dtFechaCreacion: this.selectedItem?.dtFechaCreacion,
        cAsunto: this.selectedItem?.cAsunto,
        cPrioridadNombre: this.selectedItem?.cPrioridadNombre,
        cSugerencia: this.selectedItem?.cSugerencia,
        cRespuesta: this.selectedItem?.cRespuesta,
      });
      this.obtenerArchivosSugerencia();
    }
  }

  descargarArchivo(event: Event, archivo: string) {
    event.preventDefault();
    this.buzonSugerenciasEstudianteService
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
}
