import {
  Component,
  inject,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
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
import { MenuItem } from 'primeng/api';
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
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimengModule } from '@/app/primeng.module';
import { actividadesConfig } from '@/app/sistema/aula-virtual/constants/aula-virtual';
import { FormEvaluacionComponent } from '../../../../actividades/actividad-evaluacion/components/form-evaluacion/form-evaluacion.component';
import { NoDataComponent } from '../../../../../../../shared/no-data/no-data.component';
import { DOCENTE, ESTUDIANTE, PARTICIPANTE } from '@/app/servicios/perfilesConstantes';
import { VideoconferenciaFormContainerComponent } from '../../../../actividades/actividad-videoconferencia/videoconferencia-form-container/videoconferencia-form-container.component';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { CardOrderListComponent } from '@/app/shared/card-orderList/card-orderList.component';
import { CuestionarioFormComponent } from '../../../../actividades/actividad-cuestionario/cuestionario-form/cuestionario-form.component';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { EvaluacionesService } from '@/app/servicios/eval/evaluaciones.service';
import { SesionAprendizajeFormComponent } from '../../../../sesion-aprendizaje/sesion-aprendizaje-form/sesion-aprendizaje-form.component';
import { TareaFormComponent } from '../../../../actividades/actividad-tarea/tarea-form/tarea-form.component';
import { ActividadTiposService } from '@/app/servicios/aula/actividad-tipos.service';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { ContenidoSemanasService } from '@/app/servicios/acad/contenido-semanas.service';
import { INSTRUCTOR } from '@/app/servicios/seg/perfiles';

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
export class TabContenidoComponent extends MostrarErrorComponent implements OnInit, OnChanges {
  @Input() idDocCursoId;
  @Input() iCursoId;
  @Input() curso;
  @Input() iCapacitacionId;
  @Input() contenidoSemanas = [];

  @Output() recargarContenidoSemanas = new EventEmitter();

  public rangeDates: Date[] | undefined;
  public accionesContenido: MenuItem[];
  public actividadSelected: IActividad | undefined;
  public accionSeleccionada: string | undefined;

  // injeccion de dependencias
  private _ConstantesService = inject(ConstantesService);
  private _generalService = inject(GeneralService);
  private _confirmService = inject(ConfirmationModalService);
  private GeneralService = inject(GeneralService);
  private _EvaluacionesService = inject(EvaluacionesService);
  private _ActividadTiposService = inject(ActividadTiposService);
  private _dialogService = inject(DialogService);
  private router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _ContenidoSemanasService = inject(ContenidoSemanasService);

  tipoActivadedes = [];

  semanaSeleccionada = [];
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

  iPerfilId: number = null;
  public DOCENTE = DOCENTE;
  public ESTUDIANTE = ESTUDIANTE;
  public INSTRUCTOR = INSTRUCTOR;

  showModalSesionAprendizaje: boolean = false;

  ngOnInit(): void {
    this.iPerfilId = this._ConstantesService.iPerfilId;
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    this.rangeDates = [today, nextWeek];
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contenidoSemanas'] && changes['contenidoSemanas'].currentValue) {
      const nuevasSemanas = changes['contenidoSemanas'].currentValue as any[];

      this.contenidoSemanas = (nuevasSemanas || [])
        .filter(semana => semana.iContenidoSemId !== 0)
        .map((item, index) => ({
          ...item,
          cTitulo: `${index + 1}. SESIÓN DE APRENDIZAJE ${item.cContenidoSemNumero || ''}`,
          cDescripcion: item.cContenidoSemTitulo || '',
          iContenidoSemId: item.iContenidoSemId,
        }));
    }
  }
  datos: any;
  obtenerActividadesxiContenidoSemId(semana) {
    // this.semanaSeleccionada = semana
    this.datos = semana;
    // console.log('datos seleccionado', this.datos)
    const iContenidoSemId = semana.iContenidoSemId;
    if (!iContenidoSemId) return;
    let cPerfil: string | undefined;

    switch (this.iPerfilId) {
      case ESTUDIANTE:
        cPerfil = 'ESTUDIANTE';
        break;
      case DOCENTE:
        cPerfil = 'DOCENTE';
        break;
      case INSTRUCTOR:
        cPerfil = 'INSTRUCTOR';
        break;
      case PARTICIPANTE:
        cPerfil = 'PARTICIPANTE';
        break;
    }
    const params = {
      iCredId: this._ConstantesService.iCredId,
      cPerfil,
      idDocCursoId: this.idDocCursoId,
      iCapacitacionId: this.iCapacitacionId,
    };
    this._ContenidoSemanasService
      .obtenerActividadesxiContenidoSemId(iContenidoSemId, params)
      .subscribe({
        next: (resp: any) => {
          if (resp.validated) {
            const data = resp.data || [];
            this.semanaSeleccionada = data;
            this.semanaSeleccionadaFiltrada = data;
            // console.log(resp.data);
          }
        },
        error: error => this.mostrarErrores(error),
      });
  }
  // maneja el evento de seleccion de semana
  semanaSeleccionadaFiltrada: any = null;
  mostrarDetalleSemana(semana: any) {
    this.semanaActivado = semana.iContenidoSemId;
    const semanaSeleccionada = this.contenidoSemanas.find(
      (item: any) => item.iContenidoSemId === semana.iContenidoSemId
    );
    this.semanaSeleccionada = semanaSeleccionada;
    console.log('datos de selecc', this.semanaSeleccionada);
    this.semanaSeleccionadaFiltrada = semanaSeleccionada;
  }

  private getData() {
    switch (this.iPerfilId) {
      case ESTUDIANTE:
      case PARTICIPANTE:
        this.btnAccion = [];
        break;
      case DOCENTE:
      case INSTRUCTOR:
        this.btnAccion = [
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
        break;
    }
    this.obtenerTipoActivadad();
  }

  iActTipoId: number | string = 0;
  obtenerTipoActivadad() {
    this._ActividadTiposService.obtenerTipoActividades().subscribe({
      next: tipoActivadeds => {
        this.tipoActivadedes = tipoActivadeds || [];

        const yaExisteTodas = this.tipoActivadedes.some(actividad => actividad.iActTipoId === 0);

        if (!yaExisteTodas) {
          this.tipoActivadedes.unshift({
            iActTipoId: 0,
            cActTipoNombre: 'Todos las actividades',
          });
        }

        this.generarAccionesContenido();
      },
    });
  }

  // guardar sesion aprendizaje
  guardarSesionDeAprendizaje(data: any) {
    const datos = {
      ...data,
      cTipoUsuario: this.iCapacitacionId ? 'INSTRUCTOR' : 'DOCENTE',
      iYAcadId: this._ConstantesService.iYAcadId,
      idDocCursoId: this.idDocCursoId,
      iCapacitacionId: this.iCapacitacionId,
      iCredId: this._ConstantesService.iCredId,
    };
    this._ContenidoSemanasService.guardarSesionDeAprendizaje(datos).subscribe({
      next: response => {
        if (response.validated) {
          this.messageService.add({
            severity: 'success',
            summary: 'Acción exitosa',
            detail: response.message,
          });
          this.recargarContenidoSemanas.emit();
        }
      },
      error: error => {
        this.mostrarErrores(error);
      },
    });
  }

  // funcion para actualizar datos
  actualizarSesionDeAprendizaje(data: any) {
    const datos = {
      ...data,
      cTipoUsuario: this.iCapacitacionId ? 'INSTRUCTOR' : 'DOCENTE',
      iCredId: this._ConstantesService.iCredId,
      iContenidoSemId: this.datos.iContenidoSemId,
    };
    this._ContenidoSemanasService.actualizarContenidoSemanas(datos).subscribe({
      next: response => {
        if (response.validated) {
          this.datos.cDescripcion = data.cContenidoSemTitulo;
          this.datos.cContenidoSemTitulo = data.cContenidoSemTitulo;
          this.messageService.add({
            severity: 'success',
            summary: 'Acción exitosa',
            detail: response.message,
          });
          this.recargarContenidoSemanas.emit();
        }
      },
      error: error => {
        this.mostrarErrores(error);
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
      ruta: this.datos.iContenidoSemId,
      params: {
        iCredId: this._ConstantesService.iCredId,
      },
    };
    // console.log('editar', params);
    // return
    // Servicio para obtener los instructores
    this.GeneralService.getGralPrefixx(params).subscribe(Data => {
      const dataArray = (Data as any)['data'];
      this.datosSesion = Array.isArray(dataArray) && dataArray.length > 0 ? dataArray[0] : null;
      this.accion = 'editar';
      this.recargarContenidoSemanas.emit();
      // this.datos
      // console.log('Objeto único de sesión', this.datosSesion);
    });

    this.showModalSesionAprendizaje = true;
    // console.log(this.semanaSeleccionada)
  }

  //  función para eliminar sesiones de aprendizaje
  eliminarSesionDeAprendizaje() {
    // console.log('Eliminar', itemn);
    this._confirmService.openConfirm({
      header: '¿Está seguro de eliminar la sesión?',
      //message: this.semanaSeleccionada.cContenidoSemTitulo,
      accept: () => {
        const params = {
          petition: 'delete',
          group: 'acad',
          prefix: 'contenido-semanas',
          ruta: this.datos.iContenidoSemId,
          params: {
            iCredId: this._ConstantesService.iCredId,
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
              this.recargarContenidoSemanas.emit();
              this.semanaSeleccionada = [];
              this.datos = '';
              this.getData();
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
  btnAccion = [];

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
        this.semanaTarea = this.datos;
        this.semanaTarea.idDocCursoId = this.idDocCursoId;
        this.semanaTarea.iCapacitacionId = this.iCapacitacionId;
        this.iTareaId = actividad.ixActivadadId;
        break;
      case 'ELIMINAR':
        this._confirmService.openConfirm({
          header: '¿Esta seguro de eliminar la tarea ' + actividad['cProgActTituloLeccion'] + ' ?',
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
            (this.curso.iIeCursoId || 0) +
            '/' +
            (this.curso.iSeccionId || 0) +
            '/' +
            (this.curso.iNivelGradoId || 0),
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
              contenidoSemana: this.datos,
              iActTipoId: actividad.iActTipoId,
              actividad: actividad,
              idDocCursoId: this.idDocCursoId,
              iCapacitacionId: this.iCapacitacionId,
              action: action === 'EDITAR' ? 'ACTUALIZAR' : 'GUARDAR',
            },
            header: action === 'EDITAR' ? 'Editar Videoconferencia' : 'Crear Videoconferencia',
          }
        );
        ref.onClose.subscribe(result => {
          if (result) {
            this.obtenerActividadesxiContenidoSemId(this.datos);
          } else {
            console.log('Formulario cancelado');
          }
        });
        break;
      case 'ELIMINAR':
        this._confirmService.openConfirm({
          header:
            '¿Esta seguro de eliminar la videoconferencia ' +
            actividad['cProgActTituloLeccion'] +
            ' ?',
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
            contenidoSemana: this.datos,
            iActTipoId: actividad.iActTipoId,
            actividad: actividad,
            action: action === 'EDITAR' ? 'ACTUALIZAR' : 'GUARDAR',
            idDocCursoId: this.idDocCursoId,
            iCapacitacionId: this.iCapacitacionId,
          },
          header: action === 'EDITAR' ? 'Editar Foro' : 'Crear Foro',
        })
        .onClose.subscribe(result => {
          if (result) {
            this.obtenerActividadesxiContenidoSemId(this.datos);
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
            contenidoSemana: this.datos,
            iActTipoId: actividad.iActTipoId,
            actividad: actividad,
            action: 'guardar',
            idDocCursoId: this.idDocCursoId,
            iCapacitacionId: this.iCapacitacionId,
          },
        })
        .onClose.subscribe(result => {
          if (result) {
            this.obtenerActividadesxiContenidoSemId(this.datos);
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
          (this.curso.iIeCursoId || 0) +
          '/' +
          (this.curso.iSeccionId || 0) +
          '/' +
          (this.curso.iNivelGradoId || 0),
      ]);
    }
  }

  handleCuestionarioAction(action: string, actividad: IActividad) {
    switch (action) {
      case 'CREAR':
      case 'EDITAR':
        const ref: DynamicDialogRef = this._dialogService.open(CuestionarioFormComponent, {
          ...MODAL_CONFIG,
          data: {
            contenidoSemana: this.datos,
            iActTipoId: actividad.iActTipoId,
            actividad: actividad,
            idDocCursoId: this.idDocCursoId,
            iCapacitacionId: this.iCapacitacionId,
            action: action === 'EDITAR' ? 'ACTUALIZAR' : 'GUARDAR',
          },
          header: action === 'EDITAR' ? 'Editar Cuestionario' : 'Crear Cuestionario',
        });
        ref.onClose.subscribe(result => {
          if (result) {
            this.obtenerActividadesxiContenidoSemId(this.datos);
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
        this.semanaEvaluacion = this.datos;
        this.semanaEvaluacion.idDocCursoId = this.idDocCursoId;
        this.semanaEvaluacion.iCapacitacionId = this.iCapacitacionId;
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
            this.curso.iIeCursoId || 0,
            this.curso.iSeccionId || 0,
            this.curso.iNivelGradoId || 0,
          ],
          {
            queryParams: {
              iEvaluacionId: this.actividadSelected['iEvaluacionId'],
              iCursoId: this.iCursoId,
              idDocCursoId: this.idDocCursoId,
              iEstudianteId: this._ConstantesService.iEstudianteId ?? undefined,
              iNivelCicloId: this.curso.iNivelCicloId,
            },
            relativeTo: this._activatedRoute,
          }
        );
        break;
    }
  }

  private eliminarEvaluacion(iEvaluacionId) {
    const params = {
      iCredId: this._ConstantesService.iCredId,
    };
    this._EvaluacionesService.eliminarEvaluacionesxiEvaluacionId(iEvaluacionId, params).subscribe({
      next: resp => {
        if (resp.validated) {
          this.mostrarMensajeToast({
            severity: 'success',
            summary: '¡Genial!',
            detail: resp.message,
          });
          this.obtenerActividadesxiContenidoSemId(this.datos);
        }
      },
      error: error => {
        this.mostrarErrores(error);
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
          this.obtenerActividadesxiContenidoSemId(this.datos);
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
        iCredId: this._ConstantesService.iCredId, // Asignar el ID del crédito
      },
    };

    this._generalService.getGralPrefixx(params).subscribe({
      next: resp => {
        if (resp.validated) {
          this.obtenerActividadesxiContenidoSemId(this.datos);
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
          this.obtenerActividadesxiContenidoSemId(this.datos);
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
        iCredId: this._ConstantesService.iCredId,
      },
    };
    this._generalService.getGralPrefixx(data).subscribe({
      next: resp => {
        if (resp.validated) {
          this.obtenerActividadesxiContenidoSemId(this.datos);
        }
      },
    });
  }

  filtrarSemanaSeleccionada(event: DropdownChangeEvent) {
    const iActTipoId = Number(event.value);
    this.semanaSeleccionada = [...this.semanaSeleccionadaFiltrada];

    if (!iActTipoId) {
      return;
    }

    this.semanaSeleccionada = this.semanaSeleccionada.filter(
      (actividad: any) => Number(actividad.iActTipoId) === iActTipoId
    );
  }

  recargarData() {
    this.obtenerActividadesxiContenidoSemId(this.datos);
  }
}
