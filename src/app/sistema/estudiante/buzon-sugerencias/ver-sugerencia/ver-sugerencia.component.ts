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
import { BuzonSugerenciasService } from '../services/buzon-sugerencias.service';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';

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
  sugerenciaAlumno: string = 'Sugerencia del alumno';
  //private _selectedItem: any
  archivos: any[] = [];
  //nombreDirector: string = 'Director: '
  //fechaRespuesta: string = 'Fecha de respuesta'

  /*@Input()
    set selectedItem(value: any) {
        this._selectedItem = value
        if (this.form) {
            this.form.patchValue({
                cNombreEstudiante: this._selectedItem?.cNombreEstudiante,
                dtFechaCreacion: this._selectedItem?.dtFechaCreacion,
                cAsunto: this._selectedItem?.cAsunto,
                cPrioridadNombre: this._selectedItem?.cPrioridadNombre,
                cSugerencia: this._selectedItem?.cSugerencia,
                cRespuesta: this._selectedItem?.cRespuesta,
            })
            this.obtenerArchivosSugerencia()
        }
    }*/
  /*get selectedItem(): any {
        return this._selectedItem
    }*/
  constructor(
    private fb: FormBuilder,
    private buzonSugerenciasService: BuzonSugerenciasService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      cNombreEstudiante: [null],
      dtFechaCreacion: [null],
      cAsunto: [null],
      cPrioridadNombre: [null],
      cSugerencia: [null],
      cRespuesta: [null],
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
      });
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
