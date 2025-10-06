import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestasService } from '../services/encuestas.services';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { SlicePipe } from '@angular/common';
import { DIRECTOR_IE } from '@/app/servicios/seg/perfiles';
import { GestionPlantillasComponent } from '../plantillas/gestion-plantillas/gestion-plantillas.component';

@Component({
  selector: 'app-gestion-encuestas',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, GestionPlantillasComponent],
  templateUrl: './gestion-encuestas.component.html',
  styleUrl: './gestion-encuestas.component.scss',
  providers: [SlicePipe],
})
export class GestionEncuestasComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;

  iCateId: number = null;
  categoria: any = null;
  selectedItem: any;
  iYAcadId: number;
  perfil: any;
  cCateNombre: string;

  encuestas: Array<any> = [];
  encuestas_filtradas: Array<any> = [];

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  ESTADO_BORRADOR: number = this.encuestasService.ESTADO_BORRADOR;
  ESTADO_APROBADA: number = this.encuestasService.ESTADO_APROBADA;

  USUARIO_ENCUESTADOR: number = this.encuestasService.USUARIO_ENCUESTADOR;

  CATEGORIA_SATISFACCION: number = this.encuestasService.CATEGORIA_SATISFACCION;
  CATEGORIA_AUTOEVALUACION: number = this.encuestasService.CATEGORIA_AUTOEVALUACION;

  constructor(
    private messageService: MessageService,
    private encuestasService: EncuestasService,
    private confirmService: ConfirmationModalService,
    private route: ActivatedRoute,
    private store: LocalStoreService,
    private router: Router,
    private slicePipe: SlicePipe
  ) {
    this.route.params.subscribe(params => {
      this.iCateId = params['iCateId'];
    });
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.setBreadCrumbs();
  }

  ngOnInit() {
    if (this.iCateId) {
      this.verCategoria();
      this.listarEncuestas();
    }
  }

  setBreadCrumbs() {
    this.breadCrumbItems = [
      { label: 'Encuestas' },
      { label: 'Categorías', routerLink: '/encuestas/categorias' },
      {
        label: this.categoria?.cCateNombre
          ? String(this.slicePipe.transform(this.categoria?.cCateNombre, 0, 20))
          : 'Categoría',
      },
      { label: 'Gestionar encuestas' },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  agregarEncuesta() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/nueva-encuesta`]);
  }

  generarEncuestaPlantilla(encuesta_reemplazada: any | null = null) {
    if (Number(this.iCateId) === this.CATEGORIA_SATISFACCION) {
      this.encuestasService
        .crearEncuestaSatisfaccion({
          iCateId: this.iCateId,
          iYAcadId: this.iYAcadId,
          iEncuId: encuesta_reemplazada?.iEncuId,
        })
        .subscribe({
          next: () => {
            this.listarEncuestas();
          },
          error: error => {
            console.error('Error obteniendo lista de encuestas:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
          },
        });
    } else if (Number(this.iCateId) === this.CATEGORIA_AUTOEVALUACION) {
      this.encuestasService
        .crearEncuestaAutoevaluacion({
          iCateId: this.iCateId,
          iYAcadId: this.iYAcadId,
          iEncuId: encuesta_reemplazada?.iEncuId,
        })
        .subscribe({
          next: () => {
            this.listarEncuestas();
          },
          error: error => {
            console.error('Error obteniendo lista de encuestas:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
          },
        });
    }
  }

  verCategoria() {
    this.encuestasService
      .verCategoria({
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.categoria = data.data;
          this.setBreadCrumbs();
        },
        error: error => {
          console.error('Error obteniendo datos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message ?? 'Ocurrió un error',
          });
        },
      });
  }

  listarEncuestas() {
    this.encuestasService
      .listarEncuestas({
        iCateId: this.iCateId,
        iYAcadId: this.iYAcadId,
        iTipoUsuario: this.USUARIO_ENCUESTADOR,
      })
      .subscribe({
        next: (data: any) => {
          this.encuestas = data.data;
          this.encuestas_filtradas = this.encuestas;
        },
        error: error => {
          console.error('Error obteniendo lista de encuestas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  filtrarTabla() {
    const filtro = this.filtro.nativeElement.value;
    this.encuestas_filtradas = this.encuestas.filter(encuesta => {
      if (encuesta.cEncuNombre && encuesta.cEncuNombre.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      if (encuesta.cCateNombre && encuesta.cCateNombre.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      if (
        encuesta.cTiemDurNombre &&
        encuesta.cTiemDurNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return encuesta;
      if (encuesta.dEncuInicio && encuesta.dEncuInicio.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      if (encuesta.dEncuFin && encuesta.dEncuFin.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      return null;
    });
  }

  eliminarEncuesta(item: any) {
    this.encuestasService
      .borrarEncuesta({
        iEncuId: item.iEncuId,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Encuesta eliminada',
          });
          this.listarEncuestas();
        },
        error: error => {
          console.error('Error obteniendo lista de encuestas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  actualizarEncuestaEstado(item: any, iEstado: number) {
    this.encuestasService
      .actualizarEncuestaEstado({
        iCredEntPerfId: this.perfil.iCredEntPerfId,
        iEncuId: item.iEncuId,
        iEstado: iEstado,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualización exitosa',
            detail: 'Se actualizó el estado de la encuesta',
          });
          this.listarEncuestas();
        },
        error: error => {
          console.error('Error actualizando estado de encuesta:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  listarPlantillas() {
    this.router.navigate([`/encuestas/categorias/${this.iCateId}/gestion-plantillas`]);
  }

  accionBtnItemTable({ accion, item }) {
    this.selectedItem = item;
    switch (accion) {
      case 'editar':
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${item.iEncuId}`,
        ]);
        break;
      case 'ver':
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${item.iEncuId}`,
        ]);
        break;
      case 'preguntas':
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${item.iEncuId}/preguntas`,
        ]);
        break;
      case 'eliminar':
        this.confirmService.openConfirm({
          header: '¿Está seguro de eliminar la encuesta seleccionada?',
          accept: () => {
            this.eliminarEncuesta(item);
          },
          reject: () => {},
        });
        break;
      case 'aprobar':
        this.confirmService.openConfirm({
          message: '¿Está seguro de aprobar la encuesta seleccionada?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.actualizarEncuestaEstado(item, this.ESTADO_APROBADA);
          },
          reject: () => {},
        });
        break;
      case 'desaprobar':
        this.confirmService.openConfirm({
          message: '¿Está seguro de cambiar el estado de la encuesta seleccionada?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.actualizarEncuestaEstado(item, this.ESTADO_BORRADOR);
          },
          reject: () => {},
        });
        break;
      case 'respuestas':
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${item.iEncuId}/respuestas`,
        ]);
        break;
      case 'resumen':
        this.router.navigate([
          `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${item.iEncuId}/resumen`,
        ]);
        break;
      case 'reemplazar':
        this.generarEncuestaPlantilla(item);
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-file-edit',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_BORRADOR && Number(rowData.puede_editar) === 1,
    },
    {
      labelTooltip: 'Ver',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-rounded p-button-secondary p-button-text',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) !== this.ESTADO_BORRADOR || Number(rowData.puede_editar) !== 1,
    },
    {
      labelTooltip: 'Ver Preguntas',
      icon: 'pi pi-question',
      accion: 'preguntas',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
    {
      labelTooltip: 'Aprobar',
      icon: 'pi pi-check',
      accion: 'aprobar',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_BORRADOR && Number(rowData.puede_editar) === 1,
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_BORRADOR && Number(rowData.puede_editar) === 1,
    },
    {
      labelTooltip: 'Ver respuestas',
      icon: 'pi pi-users',
      accion: 'respuestas',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) === this.ESTADO_APROBADA &&
        Number(rowData.puede_ver_respuestas) === 1,
    },
    {
      labelTooltip: 'Ver resumen',
      icon: 'pi pi-chart-pie',
      accion: 'resumen',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
      isVisible: (rowData: any) =>
        Number(rowData.iEstado) == this.ESTADO_APROBADA && Number(rowData.puede_ver_resumen) === 1,
    },
    {
      labelTooltip: 'Reemplazar',
      icon: 'pi pi-sync',
      accion: 'reemplazar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
      isVisible: (rowData: any) =>
        Number(this.categoria.bEsFija) === 1 &&
        Number(this.perfil.iPerfilId) === DIRECTOR_IE &&
        !rowData.iSedeId &&
        new Date() < new Date(rowData.dEncuInicio),
    },
  ];

  columns: IColumn[] = [
    {
      type: 'item',
      width: '5%',
      field: 'item',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '30%',
      field: 'cEncuNombre',
      header: 'Título de encuesta',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cTiemDurNombre',
      header: 'Tiempo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '15%',
      field: 'dEncuInicio',
      header: 'Desde',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '15%',
      field: 'dEncuFin',
      header: 'Hasta',
      text_header: 'center',
      text: 'center',
    },
    {
      field: 'cEstadoNombre',
      type: 'tag',
      width: '10%',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
      styles: {
        BORRADOR: 'danger',
        APROBADA: 'success',
      },
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
