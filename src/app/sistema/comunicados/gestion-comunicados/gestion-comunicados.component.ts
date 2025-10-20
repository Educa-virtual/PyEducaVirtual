import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { IActionTable } from '@/app/shared/table-primeng/table-primeng.component';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { SlicePipe } from '@angular/common';
import { ComunicadosService } from '../services/comunicados.services';

@Component({
  selector: 'app-gestion-comunicados',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './gestion-comunicados.component.html',
  styleUrl: './gestion-comunicados.component.scss',
  providers: [SlicePipe],
})
export class GestionComunicadosComponent implements OnInit {
  @ViewChild('filtro') filtro: ElementRef;

  selectedItem: any;
  iYAcadId: number;
  perfil: any;

  tipos_comunicados: Array<object>;

  comunicados: Array<any> = [];
  comunicados_filtrados: Array<any> = [];

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  constructor(
    private messageService: MessageService,
    private comunicadosService: ComunicadosService,
    private confirmService: ConfirmationModalService,
    private store: LocalStoreService,
    private router: Router
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.perfil = this.store.getItem('dremoPerfil');
    this.setBreadCrumbs();
  }

  ngOnInit() {
    try {
      this.comunicadosService
        .crearComunicado({
          iYAcadId: this.iYAcadId,
        })
        .subscribe((data: any) => {
          this.tipos_comunicados = this.comunicadosService.getTiposComunicados(
            data?.tipos_comunicados
          );
        });
    } catch (error) {
      console.error('Error al inicializar el formulario', error);
    }
    this.listarComunicados();
  }

  setBreadCrumbs() {
    this.breadCrumbItems = [{ label: 'Comunicados' }, { label: 'Gestionar comunicados' }];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  agregarComunicado() {
    this.router.navigate([`/comunicados/nuevo-comunicado`]);
  }

  listarComunicados() {
    this.comunicadosService
      .listarComunicados({
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          this.comunicados = data.data;
          this.filtrarTabla();
        },
        error: error => {
          console.error('Error obteniendo lista de comunicados:', error);
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
    this.comunicados_filtrados = this.comunicados.filter(comunicado => {
      if (
        comunicado.cComunicadoTitulo &&
        comunicado.cComunicadoTitulo.toLowerCase().includes(filtro.toLowerCase())
      )
        return comunicado;
      if (
        comunicado.cTipoComNombre &&
        comunicado.cTipoComNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return comunicado;
      if (
        comunicado.cPrioridadNombre &&
        comunicado.cPrioridadNombre.toLowerCase().includes(filtro.toLowerCase())
      )
        return comunicado;
      if (
        comunicado.cComunicadoDescripcion &&
        comunicado.cComunicadoDescripcion.toLowerCase().includes(filtro.toLowerCase())
      )
        return comunicado;
      if (
        comunicado.dtComunicadoEmision &&
        comunicado.dtComunicadoEmision.toLowerCase().includes(filtro.toLowerCase())
      )
        return comunicado;
      if (
        comunicado.dtComunicadoHasta &&
        comunicado.dtComunicadoHasta.toLowerCase().includes(filtro.toLowerCase())
      )
        return comunicado;
      return null;
    });
  }

  eliminarComunicado(item: any) {
    this.comunicadosService
      .borrarComunicado({
        iComunicadoId: item.iComunicadoId,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Comunicado eliminado',
          });
          this.listarComunicados();
        },
        error: error => {
          console.error('Error obteniendo lista de comunicados:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  verListaComunicados() {
    this.router.navigate([`/comunicados/lista-comunicados`]);
  }

  accionBtnItemTable({ accion, item }) {
    this.selectedItem = item;
    switch (accion) {
      case 'editar':
      case 'ver':
        this.router.navigate([`/comunicados/gestion-comunicados/${item.iComunicadoId}`]);
        break;
      case 'eliminar':
        this.confirmService.openConfirm({
          header: '¿Está seguro de eliminar el comunicado seleccionado?',
          accept: () => {
            this.eliminarComunicado(item);
          },
          reject: () => {},
        });
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
      isVisible: (rowData: any) => Number(rowData.puede_editar) === 1,
    },
    {
      labelTooltip: 'Ver',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-rounded p-button-secondary p-button-text',
      isVisible: (rowData: any) => Number(rowData.puede_editar) !== 1,
    },
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      isVisible: (rowData: any) => Number(rowData.puede_editar) === 1,
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
      field: 'cComunicadoTitulo',
      header: 'Comunicado',
      text_header: 'left',
      text: 'left',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cTipoComNombre',
      header: 'Tipo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5%',
      field: 'cPrioridadNombre',
      header: 'Prioridad',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '15%',
      field: 'dtComunicadoEmision',
      header: 'Desde',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '15%',
      field: 'dtComunicadoHasta',
      header: 'Hasta',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'actions',
      width: '10%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];
}
