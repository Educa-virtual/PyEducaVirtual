import { PrimengModule } from '@/app/primeng.module';
import { TipoExperienciaAprendizajeService } from '@/app/servicios/aula/tipo-experiencia-aprendizaje.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SubirArchivoComponent } from '../../../../../shared/subir-archivo/subir-archivo.component';
import { CalendarioPeriodosEvalacionesService } from '@/app/servicios/acad/calendario-periodos-evaluaciones.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@/environments/environment';
// import { validEvents } from '@tinymce/tinymce-angular/editor/Events';

@Component({
  selector: 'app-sesion-aprendizaje-form',
  standalone: true,
  imports: [ModalPrimengComponent, NgIf, PrimengModule, SubirArchivoComponent],
  templateUrl: './sesion-aprendizaje-form.component.html',
  styleUrl: './sesion-aprendizaje-form.component.scss',
})
export class SesionAprendizajeFormComponent implements OnChanges {
  @Output() accionCloseForm = new EventEmitter<void>();
  @Output() dataSesion = new EventEmitter<any>();
  @Output() editarSesion = new EventEmitter<any>();
  @Input() showModal: boolean = false;
  @Input() idSesion: number = 0;
  @Input() accion: string = '';
  @Input() datosSesion: any;
  @Input() bCapacitacion: boolean = false;

  private _TipoExperienciaAprendizajeService = inject(TipoExperienciaAprendizajeService);
  private _ConstantesService = inject(ConstantesService);
  private _MessageService = inject(MessageService);
  private _CalendarioPeriodosEvalacionesService = inject(CalendarioPeriodosEvalacionesService);
  private _formBuilder = inject(FormBuilder);

  tipoExperiencia = [];
  periodos = [];
  data: any;
  documentos: any;
  pdfURL: SafeResourceUrl | null = null;
  showPdf: boolean = false;
  rutaRelativa: string = '';

  public formSesines = this._formBuilder.group({
    cContenidoSemTitulo: ['', [Validators.required]],
    iPeriodoEvalAperId: ['', [Validators.required]],
    iTipExp: ['', [Validators.required]],
  });

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes) {
    // console.log('accion', this.accion, this.datosSesion)
    if (changes['showModal']) {
      this.idSesion;
      this.showModal = changes['showModal'].currentValue;
      if (!this.bCapacitacion) {
        this.obtenerTipoExperienciaAprendizaje();
        this.obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular();
      }

      this.formSesines.reset();
    }
    if (this.accion === 'editar') {
      this.rutaRelativa = this.datosSesion.cAdjunto;
      this.formSesines.patchValue({
        cContenidoSemTitulo: this.datosSesion.cContenidoSemTitulo,
        iPeriodoEvalAperId: this.datosSesion.iPeriodoEvalAperId,
        iTipExp: this.datosSesion.iTipExp,
      });
    } else {
      this.accion = '';
    }
    // console.log('datos pdf',this.documentos)
  }

  obtenerTipoExperienciaAprendizaje() {
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._TipoExperienciaAprendizajeService.obtenerTipoExperienciaAprendizaje(params).subscribe({
      next: resp => {
        if (resp.validated) {
          const data = resp.data;
          this.tipoExperiencia = data;
        }
      },
      error: error => {
        const errores = error?.error?.errors;
        if (error.status === 422 && errores) {
          // Recorre y muestra cada mensaje de error
          Object.keys(errores).forEach(campo => {
            errores[campo].forEach((mensaje: string) => {
              this.mostrarMensajeToast({
                severity: 'error',
                summary: 'Error de validación',
                detail: mensaje,
              });
            });
          });
        } else {
          // Error genérico si no hay errores específicos
          this.mostrarMensajeToast({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Ocurrió un error inesperado',
          });
        }
      },
    });
  }

  obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular() {
    const iYAcadId = this._ConstantesService.iYAcadId;
    const iSedeId = this._ConstantesService.iSedeId;
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._CalendarioPeriodosEvalacionesService
      .obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular(iYAcadId, iSedeId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            const data = resp.data;
            this.periodos = data;
          }
        },
        error: error => {
          const errores = error?.error?.errors;
          if (error.status === 422 && errores) {
            // Recorre y muestra cada mensaje de error
            Object.keys(errores).forEach(campo => {
              errores[campo].forEach((mensaje: string) => {
                this.mostrarMensajeToast({
                  severity: 'error',
                  summary: 'Error de validación',
                  detail: mensaje,
                });
              });
            });
          } else {
            // Error genérico si no hay errores específicos
            this.mostrarMensajeToast({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message || 'Ocurrió un error inesperado',
            });
          }
        },
      });
  }

  // guadar datos del formulario de sesion de aprendizaje
  guardarDatosdeSesion() {
    this.data = {
      ...this.formSesines.value,
      cAdjunto: this.documentos?.data,
    };
    this.formSesines.reset();
    this.dataSesion.emit(this.data);
    this.accionCloseForm.emit();
  }
  // funcion para actualizar los datos de las sesiones
  actualizarDatosdeSesion() {
    this.data = {
      ...this.formSesines.value,
      cAdjunto: this.documentos?.data ? this.documentos.data : this.rutaRelativa,
    };
    this.formSesines.reset();
    this.editarSesion.emit(this.data);
    this.accionCloseForm.emit();
  }
  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }

  obtenerArchivo(file) {
    this.documentos = file[0]['path'];
    // console.log(this.documentos);
  }
  verPdf() {
    this.showPdf = true;
    if (!this.rutaRelativa) {
      this.rutaRelativa = this.documentos.data;
      const baseURL = environment.backend + '/'; // cambia por tu URL real si estás en producción
      const url = baseURL + this.rutaRelativa;

      this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      const baseURL = environment.backend + '/'; // cambia por tu URL real si estás en producción
      const url = baseURL + this.rutaRelativa;

      this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
  cerrarModal() {
    this.showPdf = false;
  }
}
