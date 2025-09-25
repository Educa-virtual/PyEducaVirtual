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
//import { GestionEncuestaConfiguracionComponent } from './gestion-encuesta-configuracion/gestion-encuesta-configuracion.component'

@Component({
  selector: 'app-gestion-encuestas',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './gestion-encuestas.component.html',
  styleUrl: './gestion-encuestas.component.scss',
  providers: [SlicePipe],
})
export class GestionEncuestasComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;
  iCateId: number = null;
  categoria: any = null;
  selectedItem: any;
  mostrarDialogoNuevaEncuesta: boolean = false;
  mostrarDialogoAccesosEncuesta: boolean = false;
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
        next: (resp: any) => {
          this.encuestas = resp.data;
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
      if (encuesta.cEncNombre && encuesta.cEncNombre.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      if (
        encuesta.cEncCatNombre &&
        encuesta.cEncCatNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return encuesta;
      if (
        encuesta.cEncDurNombre &&
        encuesta.cEncDurNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return encuesta;
      if (encuesta.dEncInicio && encuesta.dEncInicio.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      if (encuesta.dEncFin && encuesta.dEncFin.toLowerCase().includes(filtro.toLowerCase()))
        return encuesta;
      return null;
    });
  }

  verEncuesta() {
    console.log('Ver encuesta:', this.selectedItem);
    this.messageService.add({
      severity: 'info',
      summary: 'Ver encuesta',
      detail: `Viendo encuesta: ${this.selectedItem.cTituloEncuesta}`,
    });
  }

  editarEncuesta(item: any) {
    this.router.navigate([
      `/encuestas/categorias/${this.iCateId}/gestion-encuestas/${item.iEncuId}`,
    ]);
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
          this.encuestas = this.encuestas.filter(encuesta => encuesta.iEncuId !== item.iEncuId);
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

  abrirDialogoNuevaEncuesta() {
    this.mostrarDialogoNuevaEncuesta = true;
  }

  cerrarDialogoNuevaEncuesta() {
    this.mostrarDialogoNuevaEncuesta = false;
  }

  abrirDialogoAccesosEncuesta() {
    this.mostrarDialogoAccesosEncuesta = true;
  }
  cerrarDialogoAccesosEncuesta() {
    this.mostrarDialogoAccesosEncuesta = false;
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
  ];

  columns: IColumn[] = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '8rem',
      field: 'cEncuNombre',
      header: 'Título de encuesta',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'cTiemDurNombre',
      header: 'Tiempo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '3rem',
      field: 'dEncuInicio',
      header: 'Desde',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '3rem',
      field: 'dEncuFin',
      header: 'Hasta',
      text_header: 'center',
      text: 'center',
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
}
