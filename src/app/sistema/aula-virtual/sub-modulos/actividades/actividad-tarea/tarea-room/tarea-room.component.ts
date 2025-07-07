import { IconComponent } from '@/app/shared/icon/icon.component';
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component';
import { ILeyendaItem } from '@/app/sistema/aula-virtual/sub-modulos/actividades/components/leyenda-tareas/leyenda-item/leyenda-item.component';
import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { matListAlt, matPeople } from '@ng-icons/material-icons/baseline';
import { DialogService } from 'primeng/dynamicdialog';
import { CalificarTareaFormComponent } from '../calificar-tarea-form/calificar-tarea-form.component';
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config';
import { PrimengModule } from '@/app/primeng.module';
import { FileUploadPrimengComponent } from '../../../../../../shared/file-upload-primeng/file-upload-primeng.component';
import { FormGrupoComponent } from '../form-grupo/form-grupo.component';
import { GeneralService } from '@/app/servicios/general.service';
import { environment } from '@/environments/environment';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { FormTransferirGrupoComponent } from '../form-transferir-grupo/form-transferir-grupo.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ScrollerModule } from 'primeng/scroller';
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes';
import { RubricasComponent } from '@/app/sistema/aula-virtual/features/rubricas/rubricas.component';
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service';

import { CardOrderListComponent } from '@/app/shared/card-orderList/card-orderList.component';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { EmptySectionComponent } from '@/app/shared/components/empty-section/empty-section.component';
import { RecursosListaComponent } from '@/app/shared/components/recursos-lista/recursos-lista.component';
import { Location } from '@angular/common';
import { DescripcionActividadesComponent } from '../../components/descripcion-actividades/descripcion-actividades.component';
import { TabDescripcionActividadesComponent } from '../../components/tab-descripcion-actividades/tab-descripcion-actividades.component';
@Component({
  selector: 'app-tarea-room',
  standalone: true,
  imports: [
    IconComponent,
    PrimengModule,
    FileUploadPrimengComponent,
    FormGrupoComponent,
    FormTransferirGrupoComponent,
    ScrollerModule,
    RubricasComponent,
    CardOrderListComponent,
    ToolbarPrimengComponent,
    EmptySectionComponent,
    RecursosListaComponent,
    DescripcionActividadesComponent,
    TabDescripcionActividadesComponent,
  ],

  templateUrl: './tarea-room.component.html',
  styleUrl: './tarea-room.component.scss',
  providers: [provideIcons({ matListAlt, matPeople }), DialogService],
})
export class TareaRoomComponent implements OnChanges, OnInit {
  form: FormGroup;
  @Input() iIeCursoId;
  @Input() iSeccionId;
  @Input() iNivelGradoId;

  params = {
    iCursoId: 0,
    iDocenteId: 0,
    idDocCursoId: 0,
    iEvaluacionId: null,
  };

  @Input() iTareaId: string;
  private _dialogService = inject(DialogService);
  private GeneralService = inject(GeneralService);
  private _constantesService = inject(ConstantesService);
  private _confirmService = inject(ConfirmationModalService);
  private _evaluacionService = inject(ApiEvaluacionesService);
  private _formBuilder = inject(FormBuilder);
  private _aulaService = inject(ApiAulaService);
  private confirmationService = inject(ConfirmationService);

  students: any;

  iPerfilId: number;
  public DOCENTE = DOCENTE;
  public ESTUDIANTE = ESTUDIANTE;

  formTareas: any;
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  isDocente: boolean = this._constantesService.iPerfilId === DOCENTE;

  constructor(
    private messageService: MessageService,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      editor: [''],
    });
  }
  public entregarEstud: FormGroup = this._formBuilder.group({
    cTareaEstudianteUrlEstudiante: [''],
    iEstudianteId: [1],
  });

  ngOnInit() {
    this.items = [
      {
        label: 'Mis Áreas Curriculares',
        routerLink: '/aula-virtual/areas-curriculares',
      },
      {
        label: 'Contenido',
        command: () => this.goBack(),
        routerLink: '/',
      },
      { label: 'Tarea' },
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.iPerfilId = this._constantesService.iPerfilId;
    if (Number(this.iPerfilId) == ESTUDIANTE) {
      this.obtenerTareaxiTareaidxiEstudianteId();
    } else {
      this.obtenerEscalaCalificaciones();
    }

    this.form.get('editor').disable();
  }
  goBack() {
    this.location.back();
  }
  ngOnChanges(changes) {
    if (changes.iTareaId?.currentValue) {
      this.iTareaId = changes.iTareaId.currentValue;
      this.getTareasxiTareaid();
    }
  }
  showModal: boolean = false;
  estudiantes = [];
  grupos = [];
  public leyendaTareas: ILeyendaItem[] = [
    {
      color: 'bg-red-100',
      total: 3,
      nombre: 'Faltan',
    },
    {
      color: 'bg-yellow-100',
      total: 20,
      nombre: 'En Proceso',
    },
    {
      color: 'bg-green-100',
      total: 3,
      nombre: 'Enviados',
    },
  ];
  columnas: IColumn[] = [
    {
      field: 'id',
      header: '#',
      text: 'actividad',
      text_header: 'left',
      width: '3rem',
      type: 'text',
    },
    {
      field: 'nombre',
      header: 'Estudiantes',
      text: 'actividad',
      text_header: 'left',
      width: '5rem',
      type: 'text',
    },

    {
      field: 'cActividad',
      header: 'Estado',
      text: 'Estado',
      text_header: 'left',
      width: '5rem',
      type: 'text',
    },

    {
      field: 'cActividad',
      header: 'Nota',
      text: 'actividad',
      text_header: 'left',
      width: '5rem',
      type: 'text',
    },

    {
      field: '',
      header: 'Acciones',
      text: '',
      text_header: 'left',
      width: '5rem',
      type: 'actions',
    },
  ];
  data;
  grupoSeleccionado;
  iTareaEstudianteId;
  cTareaTitulo: string;
  cTareaDescripcion: string;
  tareaAsignar: number;
  FilesTareas = [];
  tareaOptions = [
    { name: 'Individual', value: 0 },
    { name: 'Grupal', value: 1 },
  ];
  escalaCalificaciones = [];
  iEscalaCalifId;
  cTareaEstudianteComentarioDocente;
  getInformation(params, condition) {
    this.GeneralService.getGralPrefix(params).subscribe({
      next: response => {
        this.accionBtnItem({ accion: condition, item: response.data });
      },
      complete: () => {},
      error: error => {
        console.log(error);
      },
    });
  }

  estadoCheckbox: boolean = false;

  changeEstadoCheckbox() {
    this.estadoCheckbox = !this.estadoCheckbox;
    //this.estudiantes.map((i) => (i.iCheckbox = this.estadoCheckbox))
  }

  documentos = [
    {
      iDocumentoId: '1',
      url: '',
      cDocumento: 'Proyecto Virtual',
    },
  ];
  public acciones = [
    {
      labelTooltip: 'Agregar',
      icon: 'pi pi-plus',
      accion: 'calificar',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
  ];
  tareasFalta: number = 0;
  tareasCulminado: number = 0;
  gruposFalta: number = 0;
  gruposCulminado: number = 0;
  FilesTareasEstudiantes = [];
  iEstadoEstudianteTarea: string = '';
  notaTareaEstudiante: string = '';
  comentarioTareaEstudiante: string = '';

  iEstadoEstudianteTareaGrupal: string = '';
  notaTareaEstudianteGrupal: string = '';
  comentarioTareaEstudianteGrupal: string = '';
  FilesTareasEstudiantesGrupal = [];

  accionRubrica(elemento): void {
    if (!elemento) return;
    this.obtenerRubricas();
  }

  rubricas = [];

  obtenerRubricas() {
    const params = {
      iDocenteId: this._constantesService.iDocenteId,
    };
    this._evaluacionService.obtenerRubricas(params).subscribe({
      next: data => {
        data.forEach(element => {
          this.rubricas.push(element);
        });
      },
    });
  }

  public accionBtnItem(elemento) {
    const { accion } = elemento;
    const { item } = elemento;
    let falta;
    let culminado;
    switch (accion) {
      case 'calificar':
        this._dialogService.open(CalificarTareaFormComponent, {
          ...MODAL_CONFIG,
          header: 'Calificar Actividad',
        });
        break;
      case 'close-modal':
        this.showModal = false;
        break;
      case 'get-tarea-estudiantes':
        this.estudiantes = item;
        this.estudiantes = this.estudiantes.map((item: any) => {
          return {
            ...item,
            cTitulo:
              (item.cPersNombre || '') +
              ' ' +
              (item.cPersPaterno || '') +
              ' ' +
              (item.cPersMaterno || ''),
          };
        });
        falta = this.estudiantes.filter(i => i.cEstado === '0');
        culminado = this.estudiantes.filter(i => i.cEstado === '1');

        this.tareasFalta = falta.length;
        this.tareasCulminado = culminado.length;

        break;
      case 'update-tareas':
        !this.tareaAsignar ? this.getTareaEstudiantes() : this.getTareaCabeceraGrupos();

        break;
      case 'get-tarea-cabecera-grupos':
        this.grupos = item;
        this.grupos.forEach(i => {
          i.json_estudiantes = i.json_estudiantes ? JSON.parse(i.json_estudiantes) : [];
        });

        this.grupos.forEach(i => {
          i.json_estudiantes_asignado = i.json_estudiantes.filter(j => j.bAsignado === 1);
        });

        falta = this.grupos.filter(i => i.cEstado === '0');
        culminado = this.grupos.filter(i => i.cEstado === '1');

        this.tareasFalta = falta.length;
        this.tareasCulminado = culminado.length;

        console.log(this.grupos);
        break;
      case 'save-tarea-cabecera-grupos':
        this.showModal = false;
        !this.tareaAsignar ? this.getTareaEstudiantes() : this.getTareaCabeceraGrupos();
        break;
      case 'get-tareas':
        // this.data = item.length ? item[0] : []
        // this.data = item.length? {
        //     ...item.item[0]
        // }:{}
        this.data = item.length
          ? {
              ...item[0],
              cTitle: 'Tarea: ' + (item[0]?.cTareaTitulo || 'Título no disponible'),
              dInicio: item[0].dtTareaInicio,
              dFin: item[0].dtTareaFin,
              cDescripcion: item[0].cTareaDescripcion,
              cDocumentos: item[0].cTareaArchivoAdjunto
                ? JSON.parse(item[0].cTareaArchivoAdjunto)
                : [],
              iEstado: Number(item[0].iEstado),
            }
          : {};
        // console.log('datos generales de tarea',this.data)
        this.cTareaTitulo = this.data?.cTareaTitulo;
        this.cTareaDescripcion = this.data?.cTareaDescripcion;
        this.FilesTareas = this.data?.cTareaArchivoAdjunto
          ? JSON.parse(this.data?.cTareaArchivoAdjunto)
          : [];
        this.tareaAsignar = Number(this.data?.bTareaEsGrupal);
        this.tareaAsignar !== null
          ? this.accionBtnItem({
              accion: 'save-tarea-cabecera-grupos',
              item: [],
            })
          : null;

        break;
      case 'get-escala-calificaciones':
        this.escalaCalificaciones = item;
        break;
      case 'guardar-calificacion-docente':
        this.iEscalaCalifId = null;
        this.estudianteSeleccionado = null;
        this.getTareaEstudiantes();
        break;
      case 'eliminar-tarea-cabecera-grupos':
        this.grupoSeleccionadoCalificar = [];
        this.getTareaCabeceraGrupos();
        break;
      case 'guardar-calificacion-tarea-cabecera-grupos-docente':
        this.iEscalaCalifId = null;
        this.grupoSeleccionadoCalificar = [];
        this.getTareaCabeceraGrupos();
        break;
      case 'close-modal-transferir':
        this.showModalTransferir = false;
        break;
      case 'save-modal-transferir':
        this.showModalTransferir = false;
        this.getTareaCabeceraGrupos();
        break;
      case 'subir-archivo-tareas-estudiantes':
        this.FilesTareasEstudiantes.push({
          type: 1, //1->file
          nameType: 'file',
          name: item.file.name,
          size: item.file.size,
          ruta: item.name,
        });
        break;
      case 'subir-archivo-tarea-cabecera-grupos':
        this.FilesTareasEstudiantesGrupal.push({
          type: 1, //1->file
          nameType: 'file',
          name: item.file.name,
          size: item.file.size,
          ruta: item.name,
        });
        break;
      case 'obtenerTareaxiTareaidxiEstudianteId':
        const data = item.length ? item[0] : [];
        this.FilesTareasEstudiantes = data.cTareaEstudianteUrlEstudiante
          ? JSON.parse(data.cTareaEstudianteUrlEstudiante)
          : [];
        this.iEstadoEstudianteTarea = data.cEstadoIndividual;
        this.iEstadoEstudianteTareaGrupal = data.cEstadoGrupal;
        this.notaTareaEstudiante = data.cEscalaCalifNombre;
        this.comentarioTareaEstudiante = data.cTareaEstudianteComentarioDocente;

        this.notaTareaEstudianteGrupal = data.cEscalaCalifNombre;
        this.comentarioTareaEstudianteGrupal = data.cTareaGrupoComentarioDocente;
        this.FilesTareasEstudiantesGrupal = data.cTareaGrupoUrl
          ? JSON.parse(data.cTareaGrupoUrl)
          : [];
        break;
      case 'eliminar-tareas-estudiantes':
        this.getTareaCabeceraGrupos();
        break;
      case 'entregar-estudiante-tarea':
      case 'entregar-estudiante-tarea-grupal':
        this.obtenerTareaxiTareaidxiEstudianteId();
        break;
      default:
        break;
    }
  }

  estudianteSeleccionado;
  cTareaEstudianteUrlEstudiante;

  updateTareas() {
    this.estudianteSeleccionado = null;
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'tareas',
      ruta: 'updatexiTareaId',
      data: {
        opcion: 'ACTUALIZARxiTareaId',
        iTareaId: this.iTareaId,
        bTareaEsGrupal: this.tareaAsignar ? true : false,
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, 'update-tareas');
  }

  getTareaEstudiantes() {
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'tarea-estudiantes',
      ruta: 'list',
      data: {
        opcion: 'CONSULTAR-ASIGNACIONxiTareaId',
        iTareaId: this.iTareaId,
        iIeCursoId: this.iIeCursoId,
        iYAcadId: this._constantesService.iYAcadId,
        iSedeId: this._constantesService.iSedeId,
        iSeccionId: this.iSeccionId,
        iNivelGradoId: this.iNivelGradoId,
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, 'get-' + params.prefix);
  }

  getTareaCabeceraGrupos() {
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'tarea-cabecera-grupos',
      ruta: 'list',
      data: {
        opcion: 'CONSULTAR-ASIGNACIONxiTareaId',
        iTareaId: this.iTareaId,
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, 'get-' + params.prefix);
  }

  getTareasxiTareaid() {
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'tareas',
      ruta: 'list',
      data: {
        opcion: 'CONSULTARxiTareaId',
        iTareaId: this.iTareaId,
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, 'get-' + params.prefix);
  }

  obtenerEscalaCalificaciones() {
    const params = {
      petition: 'post',
      group: 'evaluaciones',
      prefix: 'escala-calificaciones',
      ruta: 'list',
      data: {
        opcion: 'CONSULTAR',
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, 'get-' + params.prefix);
  }
  guardarTareaEstudiantesxDocente() {
    if (!this.iEscalaCalifId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Falta Entregar su tarea',
        detail: 'Seleccione calificación para guardar',
      });
      return;
    }
    // Verifica que los datos requeridos estén completos antes de continuar
    if (this.iTareaEstudianteId && this.iEscalaCalifId) {
      const params = {
        petition: 'post',
        group: 'aula-virtual',
        prefix: 'tarea-estudiantes',
        ruta: 'guardar-calificacion-docente',
        data: {
          opcion: 'GUARDAR-CALIFICACION-DOCENTE',
          iTareaEstudianteId: this.iTareaEstudianteId,
          iEscalaCalifId: this.iEscalaCalifId,
          cTareaEstudianteComentarioDocente: this.cTareaEstudianteComentarioDocente,
          nTareaEstudianteNota: 0,
        },
      };
      this.getInformation(params, 'guardar-calificacion-docente');
    }
  }

  goLinkDocumento(ruta: string) {
    const backend = environment.backend;
    window.open(backend + '/' + ruta, '_blank');
  }
  buscarEstudiante() {
    const params = {
      petition: 'get',
      group: 'aula-virtual',
      prefix: 'tareas',
      ruta: 'list',
      data: {
        opcion: 'CONSULTARxiTareaId',
        iTareaId: this.iTareaId,
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, 'get-' + params.prefix);
  }
  eliminarTareaCabeceraGrupos(item) {
    this._confirmService.openConfirm({
      header: '¿Esta seguro de eliminar el grupo ' + item.cTareaGrupoNombre + ' ?',
      accept: () => {
        const params = {
          petition: 'post',
          group: 'aula-virtual',
          prefix: 'tarea-cabecera-grupos',
          ruta: 'eliminarTareaCabeceraGrupos',
          data: item,
          params: { skipSuccessMessage: true },
        };
        this.getInformation(params, 'eliminar-' + params.prefix);
      },
    });
  }
  iTareaCabGrupoId;
  cTareaGrupoUrl;
  cTareaGrupoComentarioDocente;
  grupoSeleccionadoCalificar = [];
  nTareaGrupoNota;

  seleccionarGrupo(item) {
    console.log(item);
    this.grupoSeleccionadoCalificar = [];
    this.grupoSeleccionadoCalificar.push(item);
    this.iTareaCabGrupoId = item.iTareaCabGrupoId;
    this.cTareaGrupoUrl = item.cTareaGrupoUrl ? JSON.parse(item.cTareaGrupoUrl) : [];
    this.iEscalaCalifId = item.iEscalaCalifId;
    this.cTareaGrupoComentarioDocente = item.cTareaGrupoComentarioDocente;
  }

  guardarTareaCabeceraGruposxDocente() {
    if (!this.iEscalaCalifId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Falta Entregar su tarea',
        detail: 'Seleccione calaficación para guardar',
      });
      return;
    }
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'tarea-cabecera-grupos',
      ruta: 'guardarCalificacionTareaCabeceraGruposDocente',
      data: {
        opcion: 'GUARDAR-CALIFICACION-DOCENTE',
        iTareaCabGrupoId: this.iTareaCabGrupoId,
        iEscalaCalifId: this.iEscalaCalifId,
        cTareaGrupoComentarioDocente: this.cTareaGrupoComentarioDocente,
        nTareaGrupoNota: 0,
      },
    };
    this.getInformation(params, 'guardar-calificacion-tarea-cabecera-grupos-docente');
  }
  grupoTransferir;
  showModalTransferir: boolean = false;
  iTareaEstudianteIdGrupo;
  iEstudianteIdGrupo;
  transferirEstudiante(item) {
    this.iTareaEstudianteIdGrupo = item.iTareaEstudianteId;
    this.iEstudianteIdGrupo = item.iEstudianteId;
    this.grupos.forEach(i => {
      i.json_estudiantes_respaldo.filter(j => {
        if (j.iEstudianteId == item.iEstudianteId) {
          const iTareaCabGrupoId = i.iTareaCabGrupoId;

          this.grupoTransferir = this.grupos.filter(k => k.iTareaCabGrupoId !== iTareaCabGrupoId);
        }
      });
    });
    this.showModalTransferir = true;
    // console.log(this.grupoTransferir)
  }

  eliminarEstudiante(item) {
    this.confirmationService.confirm({
      message: 'Deseas eliminar del grupo al estudiante ' + item.cPersNombre + ' ?',
      header: 'Eliminar Estudiante del Grupo',
      // icon: 'pi pi-info-circle', // Se ha activado el icono predeterminado
      acceptButtonStyleClass: 'p-button-success  ', // Estilo para el botón de aceptar
      rejectButtonStyleClass: 'p-button-danger', // Estilo para el botón de rechazar
      acceptIcon: 'pi pi-check', // Icono de aceptación
      rejectIcon: 'pi pi-times', // Icono de rechazo
      acceptLabel: 'SI',
      rejectLabel: 'No',

      accept: () => {
        const params = {
          petition: 'post',
          group: 'aula-virtual',
          prefix: 'tarea-estudiantes',
          ruta: 'eliminarEstudianteTarea',
          data: {
            opcion: 'ACTUALIZARxiTareaEstudianteIdxiEstudianteId-iTareaCabGrupoId',
            iTareaEstudianteId: item.iTareaEstudianteId,
            iEstudianteId: item.iEstudianteId,
          },
        };
        this.getInformation(params, 'eliminar-tareas-estudiantes');
      },
      reject: () => {},
    });
  }

  entregartaraeaestudiante() {
    if (!this.FilesTareasEstudiantes || this.FilesTareasEstudiantes.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'A un no subio su tarea Para revisar',
        detail: '',
      });
      return;
    }

    const comment = this.entregarEstud.value;
    comment.iTareaId = this.iTareaId;
    console.log('Enviar Tarea', comment);
    this._aulaService.guardarRespuesta(comment).subscribe(
      response => {
        console.log('Comentario Guardado:', response);

        this.entregarEstud.get('cForoRptaRespuesta')?.reset();
      },
      error => {
        console.error('Comentario:', error);
      }
    );
    //console.log(this.grupoTransferir)
  }

  miTarea;

  entregarEstudianteTarea() {
    // Obtener la fecha y hora actual
    const now = new Date();
    const fechaEntrega = now.toLocaleDateString(); // Ejemplo: "21/11/2024"
    const horaEntrega = now.toLocaleTimeString(); // Ejemplo: "10:45:23"

    // Mostrar mensaje con fecha y hora
    this.messageService.add({
      severity: 'success',
      summary: 'Tarea entregada',
      detail: `La tarea fue entregada el ${fechaEntrega} a las ${horaEntrega}.`,
    });

    this.miTarea = `La tarea fue entregada el ${fechaEntrega} a las ${horaEntrega}.`;

    if (!this.FilesTareasEstudiantes.length) return;
    console.log('entregarEstudianteTarea');
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'tarea-estudiantes',
      ruta: 'entregarEstudianteTarea',
      data: {
        cTareaEstudianteUrlEstudiante: JSON.stringify(this.FilesTareasEstudiantes),
        iTareaId: this.iTareaId,
        iEstudianteId: this._constantesService.iEstudianteId,
      },
    };
    this.getInformation(params, 'entregar-estudiante-tarea');
  }

  entregarEstudianteTareaGrupal() {
    this.messageService.add({
      severity: 'success',
      summary: 'Tarea enviada',
      detail: 'La tarea ha sido entregada exitosamente.',
    });

    if (!this.FilesTareasEstudiantesGrupal.length) return;
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'tarea-cabecera-grupos',
      ruta: 'entregarEstudianteTareaGrupal',
      data: {
        cTareaGrupoUrl: JSON.stringify(this.FilesTareasEstudiantesGrupal),
        iTareaId: this.iTareaId,
        iEstudianteId: this._constantesService.iEstudianteId,
      },
    };
    this.getInformation(params, 'entregar-estudiante-tarea-grupal');
  }
  obtenerTareaxiTareaidxiEstudianteId() {
    const params = {
      petition: 'post',
      group: 'aula-virtual',
      prefix: 'tareas',
      ruta: 'obtenerTareaxiTareaidxiEstudianteId',
      data: {
        iTareaId: this.iTareaId,
        iEstudianteId: this._constantesService.iEstudianteId,
      },
    };
    this.getInformation(params, params.ruta);
  }
  // Continúa con la lógica si la validación es exitosa
  validarEscalaCalifId(): void {
    if (this.iEscalaCalifId == 1 || this.iEscalaCalifId === '' || isNaN(this.iEscalaCalifId)) {
      alert(
        'Error: El ID de la escala de calificación no puede estar vacío y debe ser un número válido.'
      );
    } else {
      console.log('El ID de la escala de calificación es válido.');
    }
  }
  // Estilos - eliminar y trabajo grupal
  nEstudiante: number = null;
  nGrupal: number = null;

  onGlobalFilter(table: Table, event: Event) {
    if (!table) return;
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  isDisabled: boolean = true;

  validarFormulario(): boolean {
    if (!this.notaTareaEstudianteGrupal || this.notaTareaEstudianteGrupal.trim() === '') {
      alert('Por favor, ingrese una nota válida.');
      return false;
    }
    if (
      !this.comentarioTareaEstudianteGrupal ||
      this.comentarioTareaEstudianteGrupal.trim() === ''
    ) {
      alert('Por favor, ingrese un comentario.');
      return false;
    }
    return true;
  }
  getListFiles(files) {
    if (files === null || files === undefined || files === '') {
      return [];
    }

    if (typeof files === 'string') {
      return JSON.parse(files);
    }

    if (typeof files === 'object') {
      return files;
    }
    return [];
  }

  obtenerEstudianteSeleccionado(item) {
    this.estudianteSeleccionado = item;
    this.cTareaEstudianteUrlEstudiante = item.cTareaEstudianteUrlEstudiante
      ? JSON.parse(item.cTareaEstudianteUrlEstudiante)
      : [];
    this.iTareaEstudianteId = item.iTareaEstudianteId;
    this.iEscalaCalifId = item.iEscalaCalifId;
    this.cTareaEstudianteComentarioDocente = item.cTareaEstudianteComentarioDocente;
  }
}
