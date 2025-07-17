import { Component, inject, Input, OnInit } from '@angular/core';
import {
  EVALUACION,
  FORO,
  IActividad,
  MATERIAL,
  TAREA,
  VIDEO_CONFERENCIA,
  CUESTIONARIO,
} from '@/app/sistema/aula-virtual/interfaces/actividad.interface';
import { TActividadActions } from '@/app/sistema/aula-virtual/interfaces/actividad-actions.iterface';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { provideIcons } from '@ng-icons/core';
import {
  matFactCheck,
  matQuiz,
  matAssignment,
  matDescription,
  matForum,
  matVideocam,
} from '@ng-icons/material-icons/baseline';
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config';
import { ActividadListaComponent } from '../../../../actividades/components/actividad-lista/actividad-lista.component';
import { ForoFormContainerComponent } from '../../../../actividades/actividad-foro/foro-form-container/foro-form-container.component';
import { ActividadFormComponent } from '../../../../actividades/components/actividad-form/actividad-form.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service';
import { PrimengModule } from '@/app/primeng.module';
import { actividadesConfig } from '@/app/sistema/aula-virtual/constants/aula-virtual';
import { FormEvaluacionComponent } from '../../../../actividades/actividad-evaluacion/components/form-evaluacion/form-evaluacion.component';
import { NoDataComponent } from '../../../../../../../shared/no-data/no-data.component';
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes';
import { VideoconferenciaFormContainerComponent } from '../../../../actividades/actividad-videoconferencia/videoconferencia-form-container/videoconferencia-form-container.component';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { CardOrderListComponent } from '@/app/shared/card-orderList/card-orderList.component';
import { CuestionarioFormComponent } from '../../../../actividades/actividad-cuestionario/cuestionario-form/cuestionario-form.component';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { EvaluacionesService } from '@/app/servicios/eval/evaluaciones.service';
import { SesionAprendizajeFormComponent } from '../../../../sesion-aprendizaje/sesion-aprendizaje-form/sesion-aprendizaje-form.component';
import { TareaFormComponent } from '../../../../actividades/actividad-tarea/tarea-form/tarea-form.component';

@Component({
  selector: 'app-tab-contenido',
  standalone: true,
  imports: [
    ActividadListaComponent,
    PrimengModule,
    FormEvaluacionComponent,
    NoDataComponent,
    ToolbarPrimengComponent,
    CardOrderListComponent,
    SesionAprendizajeFormComponent,
    TareaFormComponent,
  ],
  templateUrl: './tab-contenido.component.html',
  styleUrl: './tab-contenido.component.scss',
  providers: [
    DialogService,
    provideIcons({
      matFactCheck,
      matQuiz,
      matAssignment,
      matDescription,
      matForum,
      matVideocam,
    }),
  ],
})
export class TabContenidoComponent implements OnInit {
  @Input({ required: true }) private _iSilaboId: string;
  @Input() idDocCursoId;
  @Input() iCursoId;
  @Input() curso;

  public rangeDates: Date[] | undefined;
  public accionesContenido: MenuItem[];
  public actividadSelected: IActividad | undefined;
  public accionSeleccionada: string | undefined;
  public contenidoSemanas = [];
  public contenidosList = [];
  // public actividades = actividadesConfigList

  // injeccion de dependencias
  private _constantesService = inject(ConstantesService);
  private _generalService = inject(GeneralService);
  private _confirmService = inject(ConfirmationModalService);
  private _aulaService = inject(ApiAulaService);
  private _evalService = inject(ApiEvaluacionesService);
  private GeneralService = inject(GeneralService);
  private _EvaluacionesService = inject(EvaluacionesService);
  private _MessageService = inject(MessageService);

  // para mostrar las actividades de la semana
  // private semanaSeleccionadaS
  private _unsubscribe$ = new Subject<boolean>();
  tipoActivadedes = [];
  // this.search_perfiles.unshift({
  //     iPerfilId: '0',
  //     cPerfilNombre: 'Todos los perfiles',
  // }) // console.log('Request completed')
  semanaSeleccionada: any = null;
  semanaActivado: number | null = null;

  // lista de acciones base para la semana
  private handleActionsMap: Record<
    number,
    (action: TActividadActions, actividad: IActividad) => void
  > = {
    [TAREA]: this.handleTareaAction.bind(this),
    [FORO]: this.handleForoAction.bind(this),
    [EVALUACION]: this.handleEvaluacionAction.bind(this),
    [VIDEO_CONFERENCIA]: this.handleVideoconferenciaAction.bind(this),
    [MATERIAL]: this.handleMaterialAction.bind(this),
    [CUESTIONARIO]: this.handleCuestionarioAction.bind(this), // Asumiendo que CUESTIONARIO
  };

  constructor(
    private _dialogService: DialogService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  iPerfilId: number = null;
  public DOCENTE = DOCENTE;
  public ESTUDIANTE = ESTUDIANTE;

  showModalSesionAprendizaje: boolean = false;

  ngOnInit(): void {
    this.iPerfilId = this._constantesService.iPerfilId;
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    this.rangeDates = [today, nextWeek];
    this.getData();
  }

  // maneja el evento de seleccion de semana
  semanaSeleccionadaFiltrada: any = null;
  mostrarDetalleSemana(semana: any) {
    this.semanaActivado = semana.iContenidoSemId;
    const semanaSeleccionada = this.contenidoSemanas.find(
      (item: any) => item.iContenidoSemId === semana.iContenidoSemId
    );
    this.semanaSeleccionada = semanaSeleccionada;
    this.semanaSeleccionadaFiltrada = semanaSeleccionada;
  }

  private getData() {
    this.obtenerTipoActivadad();
    this.obtenerContenidoSemanas(null);
  }
  iActTipoId: number | string = 0;
  obtenerTipoActivadad() {
    this._aulaService.obtenerTipoActividades().subscribe({
      next: tipoActivadeds => {
        this.tipoActivadedes = tipoActivadeds;
        this.tipoActivadedes.unshift({
          iActTipoId: 0,
          cActTipoNombre: 'Todas las actividades',
        });
        // console.log('las actividades', this.tipoActivadedes)
        this.generarAccionesContenido();
      },
    });
  }
  loadingContenidoSemanas: boolean = true;
  idSesion: number = 0;
  private obtenerContenidoSemanas(semana) {
    this.loadingContenidoSemanas = true;

    this._aulaService
      .contenidoSemanasProgramacionActividades({
        iSilaboId: this._iSilaboId,
        perfil: this.iPerfilId === DOCENTE ? 'DOCENTE' : 'ESTUDIANTE',
        iContenidoSemId: semana ? semana.iContenidoSemId : null,
      })
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: data => {
          this.loadingContenidoSemanas = false;
          if (semana) {
            this.semanaSeleccionada = data.length ? data[0] : [];
            this.semanaActivado = semana.iContenidoSemId;

            this.contenidoSemanas = this.contenidoSemanas.map((item: any) =>
              item.iContenidoSemId === semana.iContenidoSemId
                ? {
                    ...item,
                    ...this.semanaSeleccionada,
                  }
                : item
            );

            this.contenidoSemanas = this.contenidoSemanas.map((item: any, index: number) => {
              return {
                ...item,
                cTitulo: `${index + 1}. SESIÓN DE APRENDIZAJE ${item.cContenidoSemNumero || ''}`,
                cDescripcion: item.cContenidoSemTitulo || '',
              };
            });
          } else {
            this.contenidoSemanas = data;
            this.contenidosList = this.contenidoSemanas.map((item: any, index: number) => {
              return {
                cTitulo: `${index + 1}. SESIÓN DE APRENDIZAJE ${item.cContenidoSemNumero || ''}`,
                cDescripcion: item.cContenidoSemTitulo || '',
                iContenidoSemId: item.iContenidoSemId,
              };
            });
            this.idSesion = this.contenidosList?.length + 1;
          }
        },
        error: error => {
          console.log(error);
          this.loadingContenidoSemanas = false;
        },
      });
  }
  accionBnt({ accion, item }: { accion: string; item?: any }): void {
    switch (accion) {
      case 'close-modal':
        console.log(item);
        this.showModalSesionAprendizaje = false;

        // this.showModal = false;
        // this.obtenerInstructores();
        break;
      case 'guardar':
        // this.accion = accion;
        // this.showModal = true;
        this.accion = 'guardar';
        this.showModalSesionAprendizaje = true;
        console.log('guardar');
        break;
      case 'editar':
        // this.accion = accion;
        // console.log(item);
        // this.instructor = item;
        // this.showModal = true;
        break;
      case 'eliminar':
        // this.eliminarInstructor(item);
        break;
    }
  }
  // guardar sesion aprendizaje
  guardarSesionDeAprendizaje(data: any) {
    const datos = {
      ...data,
      cTipoUsuario: 'DOCENTE',
      iYAcadId: this._constantesService.iYAcadId,
      idDocCursoId: this.idDocCursoId,
      iCredId: this._constantesService.iCredId,
    };
    const params = {
      petition: 'post',
      group: 'acad',
      prefix: 'contenido-semanas',
      data: datos,
      params: {
        iCredId: this._constantesService.iCredId,
      },
    };
    console.log('datos de semana 01', params);
    //Servicio para obtener los instructores
    this.GeneralService.getGralPrefixx(params).subscribe({
      next: response => {
        if (response.validated) {
          this.messageService.add({
            severity: 'success',
            summary: 'Acción exitosa',
            detail: response.message,
          });
          this.obtenerContenidoSemanas(this.semanaSeleccionada);
          // this.showModal = false
          // this.instructorForm.reset()
        }
      },
      error: error => {
        const errores = error?.error?.errors;
        if (error.status === 422 && errores) {
          // Recorre y muestra cada mensaje de error
          Object.keys(errores).forEach(campo => {
            errores[campo].forEach((mensaje: string) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: mensaje,
              });
            });
          });
        } else {
          // Error genérico si no hay errores específicos
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Ocurrió un error inesperado',
          });
        }
      },
    });
  }
  datosSesion: any;
  accion: string = '';
  //
  editarSesionDeAprendizaje() {
    const params = {
      petition: 'get',
      group: 'acad',
      prefix: 'contenido-semanas',
      ruta: this.semanaActivado,
      params: {
        iCredId: this._constantesService.iCredId,
      },
    };
    // Servicio para obtener los instructores
    this.GeneralService.getGralPrefixx(params).subscribe(Data => {
      const dataArray = (Data as any)['data'];
      this.datosSesion = Array.isArray(dataArray) && dataArray.length > 0 ? dataArray[0] : null;
      this.accion = 'editar';
      // console.log('Objeto único de sesión', this.datosSesion);
    });

    this.showModalSesionAprendizaje = true;
    // console.log(this.semanaSeleccionada)
  }

  //  función para eliminar sesiones de aprendizaje
  eliminarSesionDeAprendizaje() {
    // console.log('Eliminar', itemn);
    this._confirmService.openConfirm({
      header: '¿Esta seguro de eliminar la sesión:  ' + this.semanaSeleccionada.cContenidoSemTitulo,
      accept: () => {
        const params = {
          petition: 'delete',
          group: 'acad',
          prefix: 'contenido-semanas',
          ruta: this.semanaActivado,
          params: {
            iCredId: this._constantesService.iCredId,
          },
        };
        // Servicio para obtener los instructores
        this.GeneralService.getGralPrefixx(params).subscribe({
          next: resp => {
            if (resp.validated) {
              this.messageService.add({
                severity: 'success',
                summary: 'Acción exitosa',
                detail: resp.message,
              });
              // window.location.reload();
              this.getData();
              // this.semanaSeleccionada()
              // this.obtenerContenidoSemanas(this.semanaSeleccionada);
              // this.obtenerInstructores();
            }
          },
        });
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelado',
          detail: 'Acción cancelada',
        });
      },
    });
  }
  // botones de editar y eliminar semana
  btnAccion = [
    {
      label: 'Editar',
      icon: 'pi pi-file-edit',
      class: 'p-button-warning',
      action: () => this.editarSesionDeAprendizaje(),
      // action: () =>this.guardar()
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      class: 'p-button-danger',
      action: () => this.eliminarSesionDeAprendizaje(), //this.guardar()
    },
  ];

  setSemanaSeleccionada(semana) {
    this.semanaSeleccionada = semana;
  }

  // genera las acciones de contenido segun la configuracion de las actividades
  generarAccionesContenido() {
    this.accionesContenido = Object.keys(actividadesConfig).map(key => {
      const tipoActividadLocal = actividadesConfig[key];
      const tipoActividad = this.tipoActivadedes.find(
        act => act.iActTipoId == tipoActividadLocal.iActTipoId
      );
      return {
        label: tipoActividad.cActTipoNombre,
        icon: tipoActividadLocal.icon,
        command: () => {
          const actionHandler = this.handleActionsMap[tipoActividadLocal.iActTipoId];
          if (actionHandler) {
            actionHandler('CREAR', tipoActividadLocal);
          }
        },
      };
    });
  }

  // maneja las acciones de las segun el tipo de actividad
  actionSelected({ actividad, action }: { actividad: IActividad; action: string }) {
    this.actividadSelected = actividad;
    this.accionSeleccionada = action;

    if (actividad.iActTipoId === TAREA) {
      this.handleTareaAction(action, actividad);
      return;
    }

    if (actividad.iActTipoId === EVALUACION) {
      this.handleEvaluacionAction(action, actividad);
      return;
    }

    if (actividad.iActTipoId === FORO) {
      this.handleForoAction(action, actividad);
      return;
    }

    if (actividad.iActTipoId === VIDEO_CONFERENCIA) {
      this.handleVideoconferenciaAction(action, actividad);
      return;
    }
    if (actividad.iActTipoId === CUESTIONARIO) {
      this.handleCuestionarioAction(action, actividad);
      return;
    }

    if (actividad.iActTipoId === MATERIAL) {
      this.handleMaterialAction('EDITAR', actividad, 'Editar Material');
    }
  }

  // maneja las acciones de las tareas
  showModalTarea: boolean = false;
  accionTarea: string = '';
  semanaTarea;
  iTareaId: string | number = null;
  handleTareaAction(action: string, actividad: IActividad) {
    this.showModalTarea = false;
    this.accionTarea = null;
    this.semanaTarea = null;
    this.iTareaId = null;
    switch (action) {
      case 'CREAR':
      case 'EDITAR':
        this.showModalTarea = true;
        this.accionTarea = action === 'CREAR' ? 'AGREGAR' : 'ACTUALIZAR';
        this.semanaTarea = this.semanaSeleccionada;
        this.semanaTarea.idDocCursoId = this.idDocCursoId;
        this.iTareaId = actividad.ixActivadadId;
        break;
      case 'ELIMINAR':
        this._confirmService.openConfirm({
          header: '¿Esta seguro de eliminar la tarea ' + actividad['cTareaTitulo'] + ' ?',
          accept: () => {
            this.deleteTareaxiTareaid(actividad);
          },
        });
        break;
      case 'VER':
        this.router.navigate([
          'aula-virtual/areas-curriculares/' +
            'actividad' +
            '/' +
            actividad.iProgActId +
            '/' +
            actividad.ixActivadadId +
            '/' +
            actividad.iActTipoId +
            '/' +
            this.curso.iIeCursoId +
            '/' +
            this.curso.iSeccionId +
            '/' +
            this.curso.iNivelGradoId,
        ]);
        break;
    }
  }

  handleVideoconferenciaAction(action: string, actividad: IActividad) {
    switch (action) {
      case 'CREAR':
      case 'EDITAR':
        const ref: DynamicDialogRef = this._dialogService.open(
          VideoconferenciaFormContainerComponent,
          {
            ...MODAL_CONFIG,
            width: '40%',
            data: {
              contenidoSemana: this.semanaSeleccionada,
              iActTipoId: actividad.iActTipoId,
              actividad: actividad,
              idDocCursoId: this.idDocCursoId,
              action: action === 'EDITAR' ? 'ACTUALIZAR' : 'GUARDAR',
            },
            header: action === 'EDITAR' ? 'Editar Videoconferencia' : 'Crear Videoconferencia',
          }
        );
        ref.onClose.subscribe(result => {
          if (result) {
            this.obtenerContenidoSemanas(this.semanaSeleccionada);
          } else {
            console.log('Formulario cancelado');
          }
        });
        break;
      case 'ELIMINAR':
        this._confirmService.openConfirm({
          header:
            '¿Esta seguro de eliminar la videoconferencia ' + actividad['cRVirtualTema'] + ' ?',
          accept: () => {
            this.deleteReunionVirtualxiRVirtualId(actividad);
          },
        });
        break;
      case 'INGRESAR':
        window.open(actividad['cRVirtualUrlJoin'], '_blank');
        break;
    }
  }

  handleForoAction(action: string, actividad: IActividad) {
    if (action === 'EDITAR') {
      this._dialogService
        .open(ForoFormContainerComponent, {
          ...MODAL_CONFIG,
          data: {
            contenidoSemana: this.semanaSeleccionada,
            iActTipoId: actividad.iActTipoId,
            actividad: actividad,
            action: action === 'EDITAR' ? 'ACTUALIZAR' : 'GUARDAR',
            idDocCursoId: this.idDocCursoId,
          },
          header: action === 'EDITAR' ? 'Editar Foro' : 'Crear Foro',
        })
        .onClose.subscribe(result => {
          if (result) {
            this.obtenerContenidoSemanas(this.semanaSeleccionada);
          } else {
            console.log('Formulario cancelado');
          }
        });
    }
    if (action === 'CREAR') {
      this._dialogService
        .open(ForoFormContainerComponent, {
          ...MODAL_CONFIG,
          header: 'Crear Foro',
          data: {
            contenidoSemana: this.semanaSeleccionada,
            iActTipoId: actividad.iActTipoId,
            actividad: actividad,
            action: 'guardar',
            idDocCursoId: this.idDocCursoId,
          },
        })
        .onClose.subscribe(result => {
          if (result) {
            this.obtenerContenidoSemanas(this.semanaSeleccionada);
          } else {
            console.log('Formulario cancelado');
          }
        });
    }
    if (action === 'ELIMINAR') {
      this._confirmService.openConfirm({
        header: '¿Esta seguro de eliminar el Foro: ' + actividad['cProgActTituloLeccion'] + ' ?',
        accept: () => {
          this.deleteForosxiForoId(actividad);
        },
      });
    }
    if (action === 'VER') {
      this.router.navigate(
        [
          '../',
          'actividad',
          actividad.iProgActId,
          actividad.ixActivadadId,
          actividad.iActTipoId,
          this.curso.iIeCursoId,
          this.curso.iSeccionId,
          this.curso.iNivelGradoId,
        ],
        {
          queryParams: {
            iEvaluacionId: this.actividadSelected['iForo'],
            iCursoId: this.iCursoId,
            idDocCursoId: this.idDocCursoId,
            iEstudianteId: this._constantesService.iEstudianteId ?? undefined,
          },
          relativeTo: this._activatedRoute,
        }
      );
    }
  }

  handleCuestionarioAction(action: string, actividad: IActividad) {
    switch (action) {
      case 'CREAR':
      case 'EDITAR':
        const ref: DynamicDialogRef = this._dialogService.open(CuestionarioFormComponent, {
          ...MODAL_CONFIG,
          data: {
            contenidoSemana: this.semanaSeleccionada,
            iActTipoId: actividad.iActTipoId,
            actividad: actividad,
            idDocCursoId: this.idDocCursoId,
            action: action === 'EDITAR' ? 'ACTUALIZAR' : 'GUARDAR',
          },
          header: action === 'EDITAR' ? 'Editar Cuestionario' : 'Crear Cuestionario',
        });
        ref.onClose.subscribe(result => {
          if (result) {
            this.obtenerContenidoSemanas(this.semanaSeleccionada);
          } else {
            console.log('Formulario cancelado');
          }
        });
        break;
      case 'ELIMINAR':
        this._confirmService.openConfirm({
          header:
            '¿Esta seguro de eliminar el Cuestionario:  ' +
            actividad['cProgActTituloLeccion'] +
            ' ?',
          accept: () => {
            this.deleteCuestionarioxId(actividad);
          },
        });
        break;
      case 'VER':
        this.router.navigate([
          'aula-virtual/areas-curriculares/' +
            'actividad' +
            '/' +
            actividad.iProgActId +
            '/' +
            actividad.ixActivadadId +
            '/' +
            actividad.iActTipoId +
            '/' +
            this.curso.iIeCursoId +
            '/' +
            this.curso.iSeccionId +
            '/' +
            this.curso.iNivelGradoId,
        ]);
        break;
    }
  }

  handleMaterialAction(action: TActividadActions, actividad: IActividad, header) {
    if (action === 'EDITAR' || action === 'CREAR') {
      this._dialogService.open(ActividadFormComponent, {
        ...MODAL_CONFIG,
        data: actividad,
        header: header,
      });
    }
  }

  anularPublicacionEvaluacion({ iEvaluacionId }) {
    this._evalService.anularPublicacionEvaluacion({ iEvaluacionId }).subscribe({
      next: () => {
        this.obtenerContenidoSemanas(this.semanaSeleccionada);
      },
    });
  }

  // maneja las acciones de las evaluaciones
  showModalEvaluacion: boolean = false;
  itemActividad = [];
  tituloEvaluacion: string;
  opcionEvaluacion: string;
  semanaEvaluacion;
  dataActividad;
  iEvaluacionId: string | number;
  handleEvaluacionAction(action: string, actividad: IActividad) {
    switch (action) {
      case 'CREAR':
      case 'EDITAR':
        this.showModalEvaluacion = true;
        this.tituloEvaluacion = action === 'CREAR' ? 'AGREGAR' : 'ACTUALIZAR';
        this.opcionEvaluacion = action === 'CREAR' ? 'GUARDAR' : 'ACTUALIZAR';
        this.semanaEvaluacion = this.semanaSeleccionada;
        this.iEvaluacionId = actividad.ixActivadadId;
        break;
      case 'ELIMINAR':
        this._confirmService.openConfirm({
          header: '¿Esta seguro de eliminar la evaluación?',
          accept: () => {
            this.eliminarEvaluacion(actividad.ixActivadadId);
          },
        });
        break;
      case 'VER':
        this.router.navigate(
          [
            '../',
            'actividad',
            actividad.iProgActId,
            actividad.ixActivadadId,
            actividad.iActTipoId,
            this.curso.iIeCursoId,
            this.curso.iSeccionId,
            this.curso.iNivelGradoId,
          ],
          {
            queryParams: {
              iEvaluacionId: this.actividadSelected['iEvaluacionId'],
              iCursoId: this.iCursoId,
              idDocCursoId: this.idDocCursoId,
              iEstudianteId: this._constantesService.iEstudianteId ?? undefined,
              iNivelCicloId: this.curso.iNivelCicloId,
            },
            relativeTo: this._activatedRoute,
          }
        );
        break;
      case 'PUBLICAR':
        this._confirmService.openConfirm({
          header: '¿Esta seguro de publicar la evaluación?',
          accept: () => {
            this.publicarEvaluacion(actividad);
          },
        });
        break;
      case 'ANULAR_PUBLICACION':
        this._confirmService.openConfirm({
          header: '¿Esta seguro de anular la publicación de la evaluación?',
          accept: () => {
            this.anularPublicacionEvaluacion({
              iEvaluacionId: actividad.ixActivadadId,
            });
          },
        });
        break;
    }
    // if (action === 'CREAR' || action === 'EDITAR') {
    //     const ref = this._dialogService.open(
    //         EvaluacionFormContainerComponent,
    //         {
    //             ...MODAL_CONFIG,
    //             maximizable: true,
    //             header: !actividad['iEvaluacionId']
    //                 ? 'Crear Evaluación'
    //                 : 'Editar Evaluación',
    //             data: {
    //                 actividad,
    //                 semana: this.semanaSeleccionada,
    //             },
    //         }
    //     )
    //     this._dialogService.getInstance(ref).maximize()
    //     ref.onClose.pipe(takeUntil(this._unsubscribe$)).subscribe({
    //         next: () => {
    //             // todo validar solo cuando sea necesario
    //             this.obtenerContenidoSemanas()
    //         },
    //     })
    // }
  }

  publicarEvaluacion(actividad: IActividad) {
    console.log(actividad);
  }

  private eliminarEvaluacion(iEvaluacionId) {
    const params = {
      iCredId: this._constantesService.iCredId,
    };
    this._EvaluacionesService.eliminarEvaluacionesxiEvaluacionId(iEvaluacionId, params).subscribe({
      next: resp => {
        if (resp.validated) {
          this.mostrarMensajeToast({
            severity: 'success',
            summary: '¡Genial!',
            detail: resp.message,
          });
          this.obtenerContenidoSemanas(this.semanaSeleccionada);
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
          this.mostrarMensajeToast({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message || 'Ocurrió un error inesperado',
          });
        }
      },
    });
  }

  deleteTareaxiTareaid(actividad) {
    actividad.opcion = 'ELIMINARxiTareaid';
    actividad.iTareaId = actividad.ixActivadadId;
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'tareas',
      ruta: 'delete',
      data: actividad,
      params: { skipSuccessMessage: true },
    };
    this._generalService.getGralPrefix(params).subscribe({
      next: resp => {
        if (resp.validated) {
          this.obtenerContenidoSemanas(this.semanaSeleccionada);
        }
      },
    });
  }
  deleteCuestionarioxId(actividad) {
    const params = {
      petition: 'delete',
      group: 'aula-virtual',
      prefix: 'cuestionarios',
      ruta: (actividad.iCuestionarioId = actividad.ixActivadadId),
      params: {
        iCredId: this._constantesService.iCredId, // Asignar el ID del crédito
      },
    };

    this._generalService.getGralPrefixx(params).subscribe({
      next: resp => {
        if (resp.validated) {
          this.obtenerContenidoSemanas(this.semanaSeleccionada);
        }
      },
    });
  }

  deleteForosxiForoId(actividad) {
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'foros',
      ruta: 'eliminarxiForoId',
      data: {
        opcion: 'ELIMINARxiForoId',
        valorBusqueda: null,
        iForoId: actividad.ixActivadadId,
      },
    };
    this._generalService.getGralPrefix(params).subscribe({
      next: resp => {
        if (resp.validated) {
          this.obtenerContenidoSemanas(this.semanaSeleccionada);
        }
      },
    });
  }

  deleteReunionVirtualxiRVirtualId(actividad) {
    actividad.opcion = 'ELIMINARxiTareaid';
    actividad.iTareaId = actividad.ixActivadadId;
    const data = {
      petition: 'delete',
      group: 'aula-virtual',
      prefix: 'reunion-virtuales',
      data: actividad,
      ruta: actividad.ixActivadadId.toString(),
      params: {
        skipSuccessMessage: true,
        iCredId: this._constantesService.iCredId,
      },
    };
    this._generalService.getGralPrefixx(data).subscribe({
      next: resp => {
        if (resp.validated) {
          this.obtenerContenidoSemanas(this.semanaSeleccionada);
        }
      },
    });
  }

  accionBtnItem(elemento): void {
    const { accion } = elemento;
    //const { item } = elemento
    switch (accion) {
      case 'close-modal-validated':
        this.showModalEvaluacion = false;
        this.iEvaluacionId = null;
        this.obtenerContenidoSemanas(this.semanaSeleccionada);
        break;
      case 'close-modal':
        this.iEvaluacionId = null;
        this.showModalEvaluacion = false;
        break;
    }
  }

  filtrarSemanaSeleccionada(event: DropdownChangeEvent) {
    const iActTipoId = Number(event.value);
    this.semanaSeleccionada = { ...this.semanaSeleccionadaFiltrada }; // Hacer copia (opcional según cómo esté estructurado)

    if (!iActTipoId || !this.semanaSeleccionada) return;

    // Filtrar fechas que contienen actividades del tipo seleccionado
    const fechasFiltradas = this.semanaSeleccionada.fechas
      .map((fecha: any) => {
        const actividadesFiltradas = fecha.actividades.filter(
          (actividad: any) => Number(actividad.iActTipoId) === iActTipoId
        );

        if (actividadesFiltradas.length > 0) {
          return {
            ...fecha,
            actividades: actividadesFiltradas,
          };
        }

        return null;
      })
      .filter((fecha: any) => fecha !== null);

    this.semanaSeleccionada.fechas = fechasFiltradas;
  }

  mostrarMensajeToast(message) {
    this._MessageService.add(message);
  }

  recargarData() {
    this.obtenerContenidoSemanas(this.semanaSeleccionada);
  }
}
