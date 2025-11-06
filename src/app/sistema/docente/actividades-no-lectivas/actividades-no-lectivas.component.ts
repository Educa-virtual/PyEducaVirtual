import { Component, inject, Input, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { Message, MessageService } from 'primeng/api';
import { TablePrimengComponent } from '../../../shared/table-primeng/table-primeng.component';
import { FormActividadesNoLectivasComponent } from './components/form-actividades-no-lectivas/form-actividades-no-lectivas.component';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { GeneralService } from '@/app/servicios/general.service';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';

@Component({
  selector: 'app-actividades-no-lectivas',
  standalone: true,
  imports: [
    PrimengModule,
    TablePrimengComponent,
    FormActividadesNoLectivasComponent,
    ContainerPageComponent,
  ],
  templateUrl: './actividades-no-lectivas.component.html',
  styleUrl: './actividades-no-lectivas.component.scss',
  providers: [MessageService],
})
export class ActividadesNoLectivasComponent implements OnInit {
  @Input() bAprobarActividad: boolean = false; // Para mostrar el botón de agregar actividad no lectiva
  @Input() iDocenteId: number = null;
  perfil: any = {};
  bAprobacion: boolean = false; // Para mostrar el modal de aprobación de actividad no lectiva
  showModalAprobarActividad: boolean = false;

  private _ConstantesService = inject(ConstantesService);
  private _GeneralService = inject(GeneralService);
  private _ConfirmationModalService = inject(ConfirmationModalService);
  private _confirmService = inject(ConfirmationModalService);
  //private _LocalStoreService = inject(LocalStoreService)
  private _MessageService = inject(MessageService);

  selectActividad: any;

  constructor(private _LocalStoreService: LocalStoreService) {
    this.perfil = this._LocalStoreService.getItem('dremoPerfil');
  }

  mensaje: Message[] = [
    {
      severity: 'info',
      detail:
        'En esta sección podrá visualizar sus actividades no lectivas como también gestionar y subir evidencias.',
    },
  ];
  date = new Date();
  showModal: boolean = false;
  bAprobar: boolean = false;
  cObservacion: any | undefined;

  actionsContainer = [
    {
      labelTooltip: 'Agregar',
      text: 'Agregar',
      icon: 'pi pi-plus',
      accion: 'agregar',
      class: 'p-button-primary',
      disabled: this.bAprobarActividad,
    },
    // {
    //     labelTooltip: 'Refrescar lista de metodologías',
    //     text: 'Refrescar',
    //     icon: 'pi pi-sync',
    //     accion: 'refrescar',
    //     class: 'p-button-danger',
    // },
  ];
  actions = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'actualizar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
      isVisible: rowData => {
        return rowData.iEstado != 1 && !this.bAprobarActividad;
      },
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: rowData => {
        return rowData.iEstado != 1 && !this.bAprobarActividad;
      },
    },
    {
      labelTooltip: 'Aprobar',
      icon: 'pi  pi-check-square',
      accion: 'aprobar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
      isVisible: () => this.bAprobarActividad,
    },
  ];

  observar: any;
  data = [];
  filtrar = [];
  tiposCargaNoLectivas = [];
  item: { iDetCargaNoLectId?: number } = {};
  titulo: string = '';
  opcion: string = '';
  informacion: any = [];
  columns = [
    {
      type: 'item',
      width: '1rem',
      field: 'cItem',
      header: 'Nº',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'cSemAcadNombre',
      header: 'Semestre Académico',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'cTipoCargaNoLectNombre',
      header: 'Nombre de la Actividad',
      text_header: 'justify',
      text: 'justify',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'descripcion',
      header: 'Descripcion',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date-time',
      width: '2rem',
      field: 'dtInicio',
      header: 'Fecha de Registro',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'nDetCargaNoLectHoras',
      header: 'Duración Horas',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '2rem',
      field: 'iEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'cObservacion',
      header: 'Observacion',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'list_json_file',
      width: '2rem',
      field: 'cDetCargaNoLectEvidencias',
      header: 'Evidencias',
      text_header: 'center',
      text: 'justify',
    },
    {
      type: 'actions',
      width: '3rem',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];

  ngOnInit() {
    if (this.perfil.cPerfilNombre === 'DOCENTE') {
      this.bAprobarActividad = false;
      if (!this.tiposCargaNoLectivas.length) {
        this.obtenerTiposCargaNoLectivas();
      }

      this.obtenerCargaNoLectivasxTiposDedicaciones();
      this.obtenerCargaNoLectivas();
    }

    // Si el perfil es ADMINISTRADOR o DIRECTOR, se muestra el botón de aprobar actividad no lectiva
    else if (this.perfil.cPerfilNombre === 'DIRECTOR IE') {
      this.bAprobarActividad = true;
      this.actionsContainer = [];

      this.obtenerCargaNoLectivas();
      this.obtenerCargaNoLectivasxTiposDedicaciones();
      this.obtenerTiposCargaNoLectivas();
    }
  }

  accionBtnItem(elemento): void {
    this.showModalAprobarActividad = false;

    const { accion } = elemento;
    const { item } = elemento;
    switch (accion) {
      case 'close-modal':
        this.showModal = false;
        break;
      case 'aprobar':
        this.bAprobar = true;
        this.item = item;
        this.cObservacion = item.cObservacion;
        break;
      case 'agregar':
      case 'actualizar':
        const iDocenteId = this._ConstantesService.iDocenteId;
        if (iDocenteId) {
          this.showModal = true;
          this.item = item;
          const dtInicio = item.dtInicio ? item.dtInicio.split(' ')[0] : null;
          this.item['dtInicio'] = dtInicio;
          this.titulo =
            accion === 'agregar'
              ? 'AGREGAR ACTIVIDADES DE GESTION'
              : 'ACTUALIZAR ACTIVIDADES DE GESTION';
          this.opcion = accion === 'agregar' ? 'GUARDAR' : 'ACTUALIZAR';
        } else {
          this._MessageService.add({
            severity: 'error',
            summary: 'Mensaje de sistema',
            detail: 'Debe Asignarle el Rol de Docente',
          });
        }
        break;

      case 'eliminar':
        this._ConfirmationModalService.openConfirm({
          header:
            '¿Esta seguro de eliminar la carga no lectiva ' + item['cTipoCargaNoLectNombre'] + ' ?',
          accept: () => {
            this.eliminarDetalleCargaNoLectivas(item);
          },
        });
        break;
      case 'GUARDAR':
      case 'ACTUALIZAR':
        this.showModal = false;
        this.GuardarActualizarDetalleCargaNoLectivas(item);
        this.obtenerCargaNoLectivas();

        break;
      case 'store-carga-no-lectivas':
      case 'update-carga-no-lectivas':
      case 'update-detalle-carga-no-lectivas':
        this.obtenerCargaNoLectivas();
        this.obtenerCargaNoLectivasxTiposDedicaciones();
        break;
      case 'list-carga-no-lectivas':
        this.data = item;
        this.data.forEach(list => {
          if (list.cDescripcion.length > 80) {
            list.descripcion = list.cDescripcion.substring(0, 80) + '...';
          } else {
            list.descripcion = list.cDescripcion;
          }
        });

        this.data.forEach(i => {
          i.cDetCargaNoLectEvidencias = i.cDetCargaNoLectEvidencias
            ? JSON.parse(i.cDetCargaNoLectEvidencias)
            : [];
        });

        this.filtrar = this.data;
        break;
      case 'list-tipos-carga-no-lectivas':
        this.tiposCargaNoLectivas = item;
        break;
      case 'delete-detalle-carga-no-lectivas':
        this.obtenerCargaNoLectivas();
        this.obtenerCargaNoLectivasxTiposDedicaciones();
        break;
      case 'CONSULTARxiDocenteIdxTiposDedicaciones':
        this.informacion = item.length ? item[0] : null;
        if (this.informacion && this.informacion.iFalta === '.00') {
          this.informacion.iFalta = '0.00';
        }
        break;
    }
  }

  obtenerTiposCargaNoLectivas() {
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'tipos-carga-no-lectivas',
      ruta: 'list',
      data: {
        opcion: 'CONSULTAR',
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, params.ruta + '-' + params.prefix);
  }
  obtenerCargaNoLectivasxTiposDedicaciones() {
    const iYearId = this._LocalStoreService.getItem('dremoYear');
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'carga-no-lectivas',
      ruta: 'list',
      data: {
        opcion: 'CONSULTARxiDocenteIdxTiposDedicaciones',
        iDocenteId: this.iDocenteId ? this.iDocenteId : this._ConstantesService.iDocenteId,
        valorBusqueda: iYearId,
        iSedeId: this._ConstantesService.iSedeId,
      },
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, 'CONSULTARxiDocenteIdxTiposDedicaciones');
  }
  obtenerCargaNoLectivas() {
    const iYearId = this._LocalStoreService.getItem('dremoYear');
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'carga-no-lectivas',
      ruta: 'list',
      data: {
        opcion: 'CONSULTARxiDocenteIdxiYearId',
        iDocenteId: this.iDocenteId ? this.iDocenteId : this._ConstantesService.iDocenteId,
        valorBusqueda: iYearId,
      },
    };
    this.getInformation(params, params.ruta + '-' + params.prefix);
  }
  formatearFecha(fecha: Date) {
    const obtenerFecha =
      fecha.getFullYear() +
      '-' +
      (fecha.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      fecha.getDate().toString().padStart(2, '0');
    const obtenerHora =
      fecha.getHours().toString().padStart(2, '0') +
      ':' +
      fecha.getMinutes().toString().padStart(2, '0') +
      ':00';
    return obtenerFecha + 'T' + obtenerHora;
  }
  GuardarActualizarDetalleCargaNoLectivas(item) {
    if (Number(item['nDetCargaNoLectHoras']) > 0) {
      const iYearId = this._LocalStoreService.getItem('dremoYear');
      item.dtInicio = item.dtInicio ? this.formatearFecha(item.dtInicio) : null;
      (item.iDocenteId = this.iDocenteId ? this.iDocenteId : this._ConstantesService.iDocenteId),
        (item.valorBusqueda = iYearId);
      const ruta = item.opcion === 'GUARDAR' ? 'store' : 'update';
      const prefix = item.opcion === 'GUARDAR' ? 'carga-no-lectivas' : 'detalle-carga-no-lectivas';
      item.opcion =
        item.opcion === 'GUARDAR'
          ? item.opcion + 'xDetalleCargaNoLectiva'
          : item.opcion + 'xiDetCargaNoLectId';
      const params = {
        petition: 'post',
        group: 'docente',
        prefix: prefix,
        ruta: ruta,
        data: item,
        params: { skipSuccessMessage: true },
      };
      this.getInformation(params, params.ruta + '-' + params.prefix);
    } else {
      this._MessageService.add({
        severity: 'error',
        summary: 'Mensaje de sistema',
        detail: 'Verificar los datos de Ingreso',
      });
    }
  }

  eliminarDetalleCargaNoLectivas(item) {
    item.opcion = 'ELIMINARxiDetCargaNoLectId';
    item.cDetCargaNoLectEvidencias = item.cDetCargaNoLectEvidencias
      ? JSON.stringify(item.cDetCargaNoLectEvidencias)
      : null;
    const params = {
      petition: 'post',
      group: 'docente',
      prefix: 'detalle-carga-no-lectivas',
      ruta: 'delete',
      data: item,
      params: { skipSuccessMessage: true },
    };
    this.getInformation(params, params.ruta + '-' + params.prefix);
  }

  getInformation(params, accion) {
    this._GeneralService.getGralPrefix(params).subscribe({
      next: response => {
        this.accionBtnItem({ accion, item: response?.data });
        if (accion === 'store-carga-no-lectivas' || accion === 'update-detalle-carga-no-lectivas') {
          this._MessageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: response.mensaje,
          });
        }
      },
      complete: () => {},
      error: error => {
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
    });
  }

  cambioAprobacion() {
    this.item['cObservacion'] = this.cObservacion;
    this.bAprobacion = this.item['iEstado'] == 1 ? true : false;

    this._confirmService.openConfirm({
      header: 'Advertencia de actividades no lectivas',
      message: 'Desea aprobar la actividad no lectiva?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Acción para eliminar el registro
        this.aprobarActividad(1);
        this._MessageService.add({
          severity: 'success',
          summary: 'Mensaje de sistema',
          detail: 'Actividad aprobada',
        });
      },
      reject: () => {
        // Mensaje de cancelación (opcional)
        this.aprobarActividad(0);
        this._MessageService.add({
          severity: 'error',
          summary: 'Mensaje de sistema',
          detail: 'Actividad desaprobada',
        });
      },
    });
  }

  aprobarActividad(iEstado) {
    const iDetCargaNoLectId = this.item.iDetCargaNoLectId;
    const cObservacion = this.item['cObservacion'];
    this.showModalAprobarActividad = false;

    const params = {
      iDetCargaNoLectId: Number(iDetCargaNoLectId),
      cObservacion: cObservacion,
      iEstado: iEstado,
      iSesionId: Number(this.perfil.iCredId),
    };

    this._GeneralService
      .updateCalAcademico({
        json: JSON.stringify(params),
        _opcion: 'updAprobacionCargaNoLectiva',
      })
      .subscribe({
        error: error => {
          this._MessageService.add({
            severity: 'error',
            summary: 'Mensaje de sistema',
            detail: 'Error. No se proceso petición ' + error.message,
          });
          this.cObservacion = undefined;
          this.bAprobar = false;
        },
        complete: () => {
          this._MessageService.add({
            severity: 'success',
            summary: 'Mensaje de sistema',
            detail: 'Proceso exitoso',
          });

          this.obtenerCargaNoLectivas();
          this.obtenerCargaNoLectivasxTiposDedicaciones();
          this.cObservacion = undefined;
          this.bAprobar = false;
        },
      });
  }

  filtrarActividades() {
    //console.log("revisar #1",this.selectActividad);
    const filtrar = this.data.filter(item => item.iTipoCargaNoLectId == this.selectActividad);
    this.filtrar = filtrar;
  }
  //validar iDetCargaNoLectId

  //this._GeneralService.updateCalendario(params) .subscribe()
}
