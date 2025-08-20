import { PrimengModule } from '@/app/primeng.module';
import { CuestionariosService } from '@/app/servicios/aula/cuestionarios.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component';
import {
  CUESTIONARIO,
  IActividad,
} from '@/app/sistema/aula-virtual/interfaces/actividad.interface';
import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-cuestionario-form',
  standalone: true,
  templateUrl: './cuestionario-form.component.html',
  styleUrls: ['./cuestionario-form.component.scss'],
  imports: [PrimengModule, TypesFilesUploadPrimengComponent],
})
export class CuestionarioFormComponent extends MostrarErrorComponent implements OnInit {
  @Input() contenidoSemana;

  private _formBuilder = inject(FormBuilder);
  private _ConstantesService = inject(ConstantesService);
  private dialogConfig = inject(DynamicDialogConfig);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _CuestionariosService = inject(CuestionariosService);

  // Crea una instancia de la clase DatePipe para formatear fechas en español
  pipe = new DatePipe('es-ES');
  date = this.ajustarAHorarioDeMediaHora(new Date());
  private ref = inject(DynamicDialogRef);
  semana: Message[] = [];

  typesFiles = {
    file: true,
    url: true,
    youtube: true,
    repository: false,
    image: false,
  };
  // Propiedad para almacenar la actividad actual (opcional).
  actividad: IActividad | undefined;
  action: string;
  opcion: string = 'GUARDAR';
  isLoading: boolean = false;

  public formCuestionario = this._formBuilder.group({
    cTitulo: ['', [Validators.required]],
    cDescripcion: ['', [Validators.required]],
    dtInicio: [this.date, Validators.required],
    dtFin: [
      new Date(this.ajustarAHorarioDeMediaHora(new Date()).setHours(this.date.getHours() + 1)),
      Validators.required,
    ],
    cArchivoAdjunto: [],

    iDocenteId: [0, Validators.required],
    iContenidoSemId: ['', Validators.required],
    iActTipoId: [0, Validators.required],
    idDocCursoId: [''],
    iCredId: ['', Validators.required],

    iCapacitacionId: [''],
    iYAcadId: ['', Validators.required],
  });

  ngOnInit() {
    this.contenidoSemana = this.dialogConfig.data.contenidoSemana;
    this.action = this.dialogConfig.data.action;
    this.actividad = this.dialogConfig.data.actividad;

    if (this.actividad?.ixActivadadId && this.action === 'ACTUALIZAR') {
      this.obtenerCuestionarioPorId(this.actividad.ixActivadadId);
    } else {
      this.opcion = 'GUARDAR';
    }

    this.semana = [
      {
        severity: 'info',
        detail: this.contenidoSemana?.cContenidoSemTitulo,
      },
    ];
  }
  // funcio  cancelar
  cancelar() {
    this.ref.close(null);
  }
  // funcion que cierra el  modal
  closeModal(resp: boolean) {
    this.ref.close(resp);
  }

  cuestionario: any;
  obtenerCuestionarioPorId(iCuestionarioId: string | number) {
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._CuestionariosService
      .obtenerCuestionarioxiCuestionarioId(iCuestionarioId, params)
      .subscribe({
        next: resp => {
          if (resp.validated) {
            let data = resp.data;
            data = data.length ? data[0] : this.closeModal(resp.validated);
            data.cArchivoAdjunto = data.cArchivoAdjunto ? JSON.parse(data.cArchivoAdjunto) : [];
            this.filesUrl = data.cArchivoAdjunto;
            this.formCuestionario.patchValue({
              ...data,
              dtInicio: new Date(data.dtInicio),
              dtFin: new Date(data.dtFin),
            });
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }

  enviarFormulario() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    this.formCuestionario.patchValue({
      iContenidoSemId: this.contenidoSemana?.iContenidoSemId,
      idDocCursoId: this.dialogConfig.data.idDocCursoId,
      iCapacitacionId: this.dialogConfig.data.iCapacitacionId,
      iActTipoId: CUESTIONARIO,
      iCredId: this._ConstantesService.iCredId,
      iYAcadId: this._ConstantesService.iYAcadId,
      iDocenteId: this._ConstantesService.iDocenteId,
      cArchivoAdjunto: JSON.stringify(this.filesUrl),
    });

    const nombresCampos: Record<string, string> = {
      cTitulo: 'Título del cuestionario',
      cDescripcion: 'Descripción',
      dtInicio: 'Fecha de inicio',
      dtFin: 'Fecha de fin',
      iContenidoSemId: 'Semana de contenido',
      iActTipoId: 'Tipo de actividad',
      iCredId: 'Credencial',
      iYAcadId: 'Año académico',
      iDocenteId: 'Docente',
    };
    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formCuestionario,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading = false;
      return;
    }

    const { idDocCursoId, iCapacitacionId } = this.formCuestionario.value;

    const soloUnoPresente = Boolean(idDocCursoId) !== Boolean(iCapacitacionId);

    if (!soloUnoPresente) {
      this.mostrarMensajeToast({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontró el curso',
      });
      this.isLoading = false;
      return;
    }

    const data = {
      ...this.formCuestionario.value,
      dtInicio: this.formCuestionario.value.dtInicio
        ? this.pipe.transform(this.formCuestionario.value.dtInicio, 'dd/MM/yyyy HH:mm:ss')
        : null,

      dtFin: this.formCuestionario.value.dtFin
        ? this.pipe.transform(this.formCuestionario.value.dtFin, 'dd/MM/yyyy HH:mm:ss')
        : null,
    };

    if (this.actividad.ixActivadadId) {
      this.actualizarCuestionario(data);
    } else {
      this.guardarCuestionario(data);
    }
  }
  // metodo para guardar el cuestionario
  guardarCuestionario(data) {
    this._CuestionariosService
      .guardarCuestionario(data)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            setTimeout(() => {
              this.closeModal(resp);
            }, 500);
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }

  // método para actualizar el cuestionario
  actualizarCuestionario(data) {
    const params = {
      ...data,
      iCredId: this._ConstantesService.iCredId,
    };
    this._CuestionariosService
      .actualizarCuestionarioxiCuestionarioId(this.actividad.ixActivadadId, params)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: resp => {
          if (resp.validated) {
            this.mostrarMensajeToast({
              severity: 'success',
              summary: '¡Genial!',
              detail: resp.message,
            });
            setTimeout(() => {
              this.closeModal(resp);
            }, 500);
          }
        },
        error: error => {
          this.mostrarErrores(error);
        },
      });
  }

  // metodo para ajustar la fecha a la hora más cercana de media hora
  ajustarAHorarioDeMediaHora(fecha) {
    const minutos = fecha.getMinutes(); // Obtener los minutos actuales
    const minutosAjustados = minutos <= 30 ? 30 : 0; // Decidir si ajustar a 30 o 0 (hora siguiente)
    if (minutos > 30) {
      fecha.setHours(fecha.getHours() + 1); // Incrementar la hora si los minutos pasan de 30
    }
    fecha.setMinutes(minutosAjustados); // Ajustar los minutos
    fecha.setSeconds(0); // Opcional: Resetear los segundos a 0
    fecha.setMilliseconds(0); // Opcional: Resetear los milisegundos a 0
    return fecha;
  }

  filesUrl = [];
  accionBtnItem(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;
    // let params
    switch (accion) {
      case 'close-modal':
        // this.showModal = false
        break;
      case 'subir-file-tareas':
        this.filesUrl.push({
          type: 1, //1->file
          nameType: 'file',
          name: item.file.name,
          size: item.file.size,
          ruta: item.name,
        });
        break;
      case 'url-tareas':
        this.filesUrl.push({
          type: 2, //2->url
          nameType: 'url',
          name: item.name,
          size: '',
          ruta: item.ruta,
        });
        break;
      case 'youtube-tareas':
        this.filesUrl.push({
          type: 3, //3->youtube
          nameType: 'youtube',
          name: item.name,
          size: '',
          ruta: item.ruta,
        });
        break;
    }
  }
}
