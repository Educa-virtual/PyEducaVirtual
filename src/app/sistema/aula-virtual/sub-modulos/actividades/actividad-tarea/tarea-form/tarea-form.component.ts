import { Component, EventEmitter, inject, Input, Output, OnChanges } from '@angular/core';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { Message, MessageService } from 'primeng/api';
import { PrimengModule } from '@/app/primeng.module';
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { TAREA } from '@/app/sistema/aula-virtual/interfaces/actividad.interface';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { TareasService } from '@/app/servicios/aula/tareas.service';
import { DatePipe } from '@angular/common';
// Selector que se utiliza para referenciar este componente en la plantilla de otros componentes.
@Component({
  selector: 'app-tarea-form',
  standalone: true,
  imports: [PrimengModule, TypesFilesUploadPrimengComponent, ModalPrimengComponent],
  templateUrl: './tarea-form.component.html',
  styleUrl: './tarea-form.component.scss',
})
// Clase principal que gestiona el contenedor del formulario de tareas.
export class TareaFormComponent implements OnChanges {
  @Output() accionCloseForm = new EventEmitter<void>();
  @Output() accionRefresh = new EventEmitter<void>();

  @Input() showModal: boolean = false;
  @Input() accionTarea: string;
  @Input() semanaTarea;
  @Input() iTareaId: string | number | null;

  private _formBuilder = inject(FormBuilder);
  private _ConstantesService = inject(ConstantesService);
  private _GeneralService = inject(GeneralService);
  private _ValidacionFormulariosService = inject(ValidacionFormulariosService);
  private _MessageService = inject(MessageService);
  private _TareasService = inject(TareasService);

  pipe = new DatePipe('es-ES');
  date = this.ajustarAHorarioDeMediaHora(new Date());
  // Indica que el tipo de archivo "file" está habilitado o permitido.
  typesFiles = {
    file: true,
    url: true,
    youtube: true,
    repository: false,
    image: false,
  };

  semana: Message[] = [];
  filesUrl = [];

  ngOnChanges(changes) {
    if (changes.showModal.currentValue) {
      this.showModal = changes.showModal.currentValue;
    }
    if (changes.accionTarea.currentValue) {
      this.accionTarea = changes.accionTarea.currentValue;
    }
    if (changes.semanaTarea.currentValue) {
      this.semanaTarea = changes.semanaTarea.currentValue;
      this.semana = [
        {
          severity: 'info',
          detail: this.semanaTarea?.cContenidoSemTitulo || '-',
        },
      ];
    }
    if (changes.iTareaId.currentValue) {
      this.iTareaId = changes.iTareaId.currentValue;
      this.getTareasxiTareaId(this.iTareaId);
    }
  }

  isLoading: boolean = false;

  public formTareas = this._formBuilder.group({
    iTareaId: [''],
    iDocenteId: ['', Validators.required],
    cTareaTitulo: ['', Validators.required],
    cTareaDescripcion: ['', Validators.required],
    cTareaArchivoAdjunto: [''],
    bTareaEsGrupal: [false],
    dtTareaInicio: [this.date, Validators.required],
    dtTareaFin: [
      new Date(this.ajustarAHorarioDeMediaHora(new Date()).setHours(this.date.getHours() + 1)),
      Validators.required,
    ],
    iContenidoSemId: ['', Validators.required],
    iActTipoId: [0, Validators.required],
    idDocCursoId: ['', Validators.required],
    iCredId: ['', Validators.required],
  });

  // Método para obtener una tarea específica por su ID (iTareaId)
  getTareasxiTareaId(iTareaId) {
    if (this.accionTarea !== 'ACTUALIZAR') return;
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'tareas',
      ruta: 'list',
      data: {
        opcion: 'CONSULTARxiTareaId',
        iTareaId: iTareaId,
      },
      params: { skipSuccessMessage: true },
    };
    this._GeneralService.getGralPrefix(params).subscribe({
      next: resp => {
        const [data] = resp.data;

        this.formTareas.patchValue({
          iTareaId: data.iTareaId,
          iDocenteId: data.iDocenteId,
          cTareaTitulo: data.cTareaTitulo,
          cTareaDescripcion: data.cTareaDescripcion,
          dtTareaInicio: new Date(data.dtTareaInicio),
          dtTareaFin: new Date(data.dtTareaFin),
          bTareaEsGrupal: data.bTareaEsGrupal,
        });

        this.filesUrl = data.cTareaArchivoAdjunto ? JSON.parse(data.cTareaArchivoAdjunto) : [];
      },
    });
  }

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

  accionBtnItem(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;
    switch (accion) {
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

  enviarFormulario() {
    if (this.isLoading) return; // evitar doble clic
    this.isLoading = true;

    this.formTareas.patchValue({
      iContenidoSemId: this.semanaTarea?.iContenidoSemId,
      idDocCursoId: this.semanaTarea?.idDocCursoId,
      iDocenteId: this._ConstantesService.iDocenteId,
      iActTipoId: TAREA,
      iCredId: this._ConstantesService.iCredId,
      cTareaArchivoAdjunto: JSON.stringify(this.filesUrl),
    });

    const nombresCampos: Record<string, string> = {
      iDocenteId: 'Docente',
      cTareaTitulo: 'Título de la tarea',
      cTareaDescripcion: 'Descripción',
      dtTareaInicio: 'Fecha de inicio',
      dtTareaFin: 'Fecha de fin',
      iContenidoSemId: 'Semana de contenido',
      iActTipoId: 'Tipo de actividad',
      idDocCursoId: 'Curso',
      iCredId: 'Credencial',
    };
    const { valid, message } = this._ValidacionFormulariosService.validarFormulario(
      this.formTareas,
      nombresCampos
    );

    if (!valid && message) {
      this.mostrarMensajeToast(message);
      this.isLoading = false;
      return;
    }

    const data = {
      ...this.formTareas.value,
      dtTareaInicio: this.formTareas.value.dtTareaInicio
        ? this.pipe.transform(this.formTareas.value.dtTareaInicio, 'dd/MM/yyyy HH:mm:ss')
        : null,

      dtTareaFin: this.formTareas.value.dtTareaFin
        ? this.pipe.transform(this.formTareas.value.dtTareaFin, 'dd/MM/yyyy HH:mm:ss')
        : null,
    };

    if (this.iTareaId) {
      this.actualizarTarea(data);
    } else {
      this.guardarTarea(data);
    }
  }
  guardarTarea(data) {
    this._TareasService.guardarTareas(data).subscribe({
      next: resp => {
        if (resp.validated) {
          this.mostrarMensajeToast({
            severity: 'success',
            summary: '¡Genial!',
            detail: resp.message,
          });
          setTimeout(() => {
            this.accionRefresh.emit();
            this.accionCloseForm.emit();
          }, 500);
        }
        this.isLoading = false;
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
        this.isLoading = false;
      },
    });
  }
  actualizarTarea(data) {
    const params = {
      ...data,
      iCredId: this._ConstantesService.iCredId,
    };
    this._TareasService.actualizarTareasxiTareaId(this.iTareaId, params).subscribe({
      next: resp => {
        if (resp.validated) {
          this.mostrarMensajeToast({
            severity: 'success',
            summary: '¡Genial!',
            detail: resp.message,
          });
          setTimeout(() => {
            this.accionRefresh.emit();
            this.accionCloseForm.emit();
          }, 500);
        }
        this.isLoading = false;
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
        this.isLoading = false;
      },
    });
  }

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }
}
