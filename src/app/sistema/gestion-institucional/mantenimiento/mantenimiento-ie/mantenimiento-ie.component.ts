import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { EditarMantenimientoIeComponent } from './editar-mantenimiento-ie/editar-mantenimiento-ie.component';
import { MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { AgregarMantenimientoIeComponent } from './agregar-mantenimiento-ie/agregar-mantenimiento-ie.component';
import { MantenimientoIeService, FiltrosIE } from './mantenimiento-ie.service';

@Component({
  selector: 'app-mantenimiento-ie',
  standalone: true,
  imports: [
    TablePrimengComponent,
    PrimengModule,
    EditarMantenimientoIeComponent,
    AgregarMantenimientoIeComponent,
  ],
  templateUrl: './mantenimiento-ie.component.html',
  styleUrl: './mantenimiento-ie.component.scss',
})
export class MantenimientoIeComponent implements OnInit {
  selectedItem: any;
  titleEditarMantenimiento: string = 'Editar Institución Educativa';
  titleAgregarMantenimiento: string = 'Agregar Institución Educativa';
  mostrarEditarMantenimiento: boolean = false;
  mostrarAgregarMantenimiento: boolean = false;
  dataMantenimiento: any[] = [];
  loading: boolean = false;
  totalRegistros: number = 0;
  paginaActual: number = 1;
  registrosPorPagina: number = 20;

  columns = [
    {
      type: 'text',
      width: '12rem',
      field: 'cIieeCodigoModular',
      header: 'Código Modular',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '20rem',
      field: 'cIieeNombre',
      header: 'Instituciones Educativas',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '15rem',
      field: 'cDsttNombre',
      header: 'Distrito',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '15rem',
      field: 'cUgelNombre',
      header: 'UGEL',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '10rem',
      field: 'cZonaNombre',
      header: 'Zona',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '12rem',
      field: 'cSedeNombre',
      header: 'Sede',
      text_header: 'center',
      text: 'left',
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

  constructor(
    private messageService: MessageService,
    private confirmationModalService: ConfirmationModalService,
    private mantenimientoIeService: MantenimientoIeService
  ) {}

  ngOnInit() {
    console.log('mantenimiento-ie component loaded');
    this.cargarDatos();
  }

  cargarDatos(filtros?: FiltrosIE) {
    this.loading = true;

    const filtrosCompletos: FiltrosIE = {
      pagina: this.paginaActual,
      registros_por_pagina: this.registrosPorPagina,
      ...filtros,
    };

    this.mantenimientoIeService.obtenerInstitucionEducativa(filtrosCompletos).subscribe({
      next: response => {
        this.loading = false;
        if (response.validated && response.data) {
          this.dataMantenimiento = response.data;
          console.log('Datos cargados:', this.dataMantenimiento);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: response.mensaje || 'No se encontraron datos',
          });
        }
      },
      error: error => {
        this.loading = false;
        console.error('Error al cargar datos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las instituciones educativas',
        });
      },
    });
  }

  buscarInstituciones(termino: string) {
    this.cargarDatos({ termino_busqueda: termino });
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.cargarDatos();
  }

  agregarMantenimiento() {
    this.mostrarAgregarMantenimiento = true;
  }

  EditarMantenimiento() {
    this.mostrarEditarMantenimiento = true;
  }

  eliminarMantenimiento(item: any) {
    this.confirmationModalService.openConfirm({
      header: '¿Está seguro de eliminar esta institución educativa?',
      accept: () => {
        this.eliminarInstitucionEducativa(item.iIieeId);
      },
    });
  }

  eliminarInstitucionEducativa(id: number) {
    const iSesionId = 1;

    this.mantenimientoIeService.eliminarInstitucionEducativa(id, iSesionId).subscribe({
      next: response => {
        if (response.validated) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Institución educativa eliminada correctamente',
          });
          this.cargarDatos();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensaje || 'Error al eliminar',
          });
        }
      },
      error: error => {
        console.error('Error al eliminar:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la institución educativa',
        });
      },
    });
  }

  cerrarModalAgregar(estado: boolean) {
    this.mostrarAgregarMantenimiento = estado;
    if (!estado) {
      this.selectedItem = null;
      this.cargarDatos();
    }
  }

  cerrarModalEdicion(estado: boolean) {
    this.mostrarEditarMantenimiento = estado;
    if (!estado) {
      this.selectedItem = null;
      this.cargarDatos();
    }
  }

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'editar':
        this.selectedItem = item;
        this.EditarMantenimiento();
        break;
      case 'eliminar':
        this.eliminarMantenimiento(item);
        break;
    }
  }

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar institución',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
    {
      labelTooltip: 'Eliminar institución',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];
}
