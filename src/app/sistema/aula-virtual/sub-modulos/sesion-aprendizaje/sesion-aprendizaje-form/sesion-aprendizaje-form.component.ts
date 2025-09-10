import { PrimengModule } from '@/app/primeng.module';
import { TipoExperienciaAprendizajeService } from '@/app/servicios/aula/tipo-experiencia-aprendizaje.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { SubirArchivoComponent } from '../../../../../shared/subir-archivo/subir-archivo.component';
import { CalendarioPeriodosEvalacionesService } from '@/app/servicios/acad/calendario-periodos-evaluaciones.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@/environments/environment';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';

@Component({
  selector: 'app-sesion-aprendizaje-form',
  standalone: true,
  imports: [ModalPrimengComponent, NgIf, PrimengModule, SubirArchivoComponent],
  templateUrl: './sesion-aprendizaje-form.component.html',
  styleUrl: './sesion-aprendizaje-form.component.scss',
})
export class SesionAprendizajeFormComponent extends MostrarErrorComponent implements OnChanges {
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
  private _CalendarioPeriodosEvalacionesService = inject(CalendarioPeriodosEvalacionesService);
  private _formBuilder = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);

  tipoExperiencia = [];
  periodos = [];
  data: any;
  documentos: any;
  pdfURL: SafeResourceUrl | null = null;
  showPdf: boolean = false;
  rutaRelativa: string = '';

  isLoading: boolean = false;

  public formSesiones = this._formBuilder.group({
    cContenidoSemTitulo: ['', [Validators.required]],
    iPeriodoEvalAperId: [''],
    iTipExp: [''],
  });

  cTituloModal: string = '';
  ngOnChanges(changes) {
    if (changes['showModal']) {
      this.idSesion;
      this.showModal = changes['showModal'].currentValue;
      if (!this.bCapacitacion) {
        this.obtenerTipoExperienciaAprendizaje();
        this.obtenerPeriodosxiYAcadIdxiSedeIdxFaseRegular();
        this.cTituloModal = 'SESIÓN DE APRENDIZAJE';
      } else {
        this.cTituloModal = 'SESIÓN ACADÉMICA';
      }

      this.formSesiones.reset();
    }
    if (this.accion === 'editar') {
      this.rutaRelativa = this.datosSesion.cAdjunto;
      this.formSesiones.patchValue({
        cContenidoSemTitulo: this.datosSesion.cContenidoSemTitulo,
        iPeriodoEvalAperId: this.datosSesion.iPeriodoEvalAperId,
        iTipExp: this.datosSesion.iTipExp,
      });
    } else {
      this.accion = '';
    }
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
        this.mostrarErrores(error);
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
          this.mostrarErrores(error);
        },
      });
  }

  // guadar datos del formulario de sesion de aprendizaje
  guardarDatosdeSesion() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    const nombresCampos: Record<string, string> = {
      cContenidoSemTitulo: 'Contenido de la sesión',
    };
    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formSesiones,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading = false;
      return;
    }

    // if(!this.bCapacitacion){
    //   if(this.formSesiones.value.iTipExp === null || this.formSesiones.value.iTipExp === ''){
    //     this.mostrarMensajeToast('Seleccione un tipo de experiencia de aprendizaje');
    //     this.isLoading = false;
    //     return;
    //   }
    //   if(this.formSesiones.value.iPeriodoEvalAperId === null || this.formSesiones.value.iPeriodoEvalAperId === ''){
    //     this.mostrarMensajeToast('Seleccione un periodo de evaluación');
    //     this.isLoading = false;
    //     return;
    //   }
    //    if(!this.documentos.data){
    //     this.mostrarMensajeToast('Seleccione un periodo de evaluación');
    //     this.isLoading = false;
    //     return;
    //   }
    // }

    this.data = {
      ...this.formSesiones.value,
      cAdjunto: this.documentos?.data,
    };
    this.formSesiones.reset();
    this.dataSesion.emit(this.data);
    this.accionCloseForm.emit();
  }
  // funcion para actualizar los datos de las sesiones
  actualizarDatosdeSesion() {
    this.data = {
      ...this.formSesiones.value,
      cAdjunto: this.documentos?.data ? this.documentos.data : this.rutaRelativa,
    };
    this.formSesiones.reset();
    this.editarSesion.emit(this.data);
    this.accionCloseForm.emit();
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
