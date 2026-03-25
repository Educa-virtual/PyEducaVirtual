import { Component, EventEmitter, inject, Input, Output, OnChanges } from '@angular/core';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { Message } from 'primeng/api';
import { PrimengModule } from '@/app/primeng.module';
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { TAREA } from '@/app/sistema/aula-virtual/interfaces/actividad.interface';
import { ValidacionFormulariosService } from '@/app/servicios/validacion-formularios.service';
import { TareasService } from '@/app/servicios/aula/tareas.service';
import { DatePipe } from '@angular/common';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
// Selector que se utiliza para referenciar este componente en la plantilla de otros componentes.
@Component({
  selector: 'app-tarea-form',
  standalone: true,
  imports: [
    PrimengModule,
    TypesFilesUploadPrimengComponent,
    ModalPrimengComponent,
    TablePrimengComponent,
  ],
  templateUrl: './tarea-form.component.html',
  styleUrl: './tarea-form.component.scss',
})
// Clase principal que gestiona el contenedor del formulario de tareas.
export class TareaFormComponent extends MostrarErrorComponent implements OnChanges {
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
  private _TareasService = inject(TareasService);
  public query = inject(GeneralService);

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

  competencias = []; // agregado
  selectedItems = []; // agregado

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
      this.buscarCompetencias(this.semanaTarea.idDocCursoId);
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
    idDocCursoId: [''],
    iCredId: ['', Validators.required],

    iCapacitacionId: [''],
    iYAcadId: ['', Validators.required],
    // bCompetencia: [false],
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

        //se agrego validacion de competencias si ya existen
        const idsCompetencias = data.jCompetencias
          ? JSON.parse(data.jCompetencias).map((x: any) => Number(x))
          : [];

        this.selectedItems = this.competencias.filter(x =>
          idsCompetencias.includes(Number(x.iCompetenciaId))
        );

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

  setSelectedItems(event) {
    this.selectedItems = event;
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
      iCapacitacionId: this.semanaTarea?.iCapacitacionId,
      iDocenteId: this._ConstantesService.iDocenteId,
      iActTipoId: TAREA,
      iCredId: this._ConstantesService.iCredId,
      cTareaArchivoAdjunto: JSON.stringify(this.filesUrl),
      iYAcadId: this._ConstantesService.iYAcadId,
    });

    const nombresCampos: Record<string, string> = {
      cTareaTitulo: 'Título de la tarea',
      cTareaDescripcion: 'Descripción',
      dtTareaInicio: 'Fecha de inicio',
      dtTareaFin: 'Fecha de fin',
      iContenidoSemId: 'Semana de contenido',
      iActTipoId: 'Tipo de actividad',
      iCredId: 'Credencial',
      iYAcadId: 'Año académico',
      iDocenteId: 'Docente',
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

    const { idDocCursoId, iCapacitacionId } = this.formTareas.value;

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
    const ids = this.selectedItems.map(x => Number(x.iCompetenciaId));

    const data = {
      ...this.formTareas.value,
      dtTareaInicio: this.formTareas.value.dtTareaInicio
        ? this.pipe.transform(this.formTareas.value.dtTareaInicio, 'dd/MM/yyyy HH:mm:ss')
        : null,

      dtTareaFin: this.formTareas.value.dtTareaFin
        ? this.pipe.transform(this.formTareas.value.dtTareaFin, 'dd/MM/yyyy HH:mm:ss')
        : null,

      jCompetencias: JSON.stringify(ids),
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
        this.mostrarErrores(error);
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
        this.mostrarErrores(error);
        this.isLoading = false;
      },
    });
  }
  buscarCompetencias(idDocCursoId: number) {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          idDocCursoId: idDocCursoId,
        }),
        _opcion: 'competenciaXidDocCursoId',
      })
      .subscribe({
        next: (data: any) => {
          this.competencias = data.data;
          this.selectedItems = data.data;
        },
        error: error => {
          this.messageService.add({
            summary: 'Mensaje de sistema',
            detail: 'Error al cargar secciones de IE.' + error.error.message,
            life: 3000,
            severity: 'error',
          });
        },
      });
  }

  columns: IColumn[] = [
    {
      type: 'item',
      width: '5%',
      field: 'item',
      header: 'Item',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '90%',
      field: 'cCompetenciaNombre',
      header: 'Competencia',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'checkbox',
      width: '5%',
      field: 'checked',
      header: '',
      text_header: 'center',
      text: 'center',
    },
  ];
}
