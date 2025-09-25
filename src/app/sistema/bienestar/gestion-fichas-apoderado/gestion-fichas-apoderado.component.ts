import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { PrimengModule } from '@/app/primeng.module';
import { Router } from '@angular/router';
import {
  TablePrimengComponent,
  IColumn,
  IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component';

import { LocalStoreService } from '@/app/servicios/local-store.service';

import { RouterModule } from '@angular/router';
import { DatosFichaBienestarService } from '../services/datos-ficha-bienestar.service';
import { MenuItem, MessageService } from 'primeng/api';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-gestion-fichas-apoderado',
  standalone: true,
  imports: [
    TablePrimengComponent,
    ButtonModule,
    PanelModule,
    InputTextModule,
    InputGroupModule,
    PrimengModule,
    RouterModule,
  ],
  templateUrl: './gestion-fichas-apoderado.component.html',
  styleUrls: ['./../ficha/ficha.component.scss'],
})
export class GestionFichasApoderadoComponent implements OnInit {
  estudiantes: Array<any> = [];
  iCredEntPerfId: number = 0;
  iYAcadId: number = 0;

  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

  private _messageService = inject(MessageService);

  constructor(
    private router: Router,
    private datosFichaBienestar: DatosFichaBienestarService,
    private store: LocalStoreService
  ) {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.iCredEntPerfId = this.store.getItem('dremoPerfil').iCredEntPerfId;
    this.breadCrumbItems = [
      {
        label: 'Bienestar social',
      },
      {
        label: 'Gestionar fichas socioeconómicas',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  ngOnInit(): void {
    this.datosFichaBienestar
      .listarFichas({
        iCredEntPerfId: this.iCredEntPerfId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (response: any) => {
          this.estudiantes = response.data.map(function (item, index) {
            item.index = index + 1;
            item.dtFichaDGFormateada = formatDate(item.dtFichaDG, 'dd/MM/yyyy', 'en-US');
            return item;
          });
        },
        error: error => {
          console.error('Error al cargar estudiantes:', error);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar los estudiantes: ' + error.message,
          });
        },
      });
  }

  descargarFicha(item: any): void {
    this.datosFichaBienestar
      .descargarFicha({
        iFichaDGId: item.iFichaDGId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: response => {
          const blob = new Blob([response], {
            type: 'application/pdf',
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.click();
        },
        error: err => {
          console.error('Error al descargar el PDF:', err);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo descargar el PDF:' + err,
          });
        },
      });
  }

  accionBnt({ accion, item }) {
    switch (accion) {
      case 'imprimir':
        this.descargarFicha(item);
        break;
      case 'editar':
        this.router.navigate([`/bienestar/ficha-declaracion/${item.iPersId}`]);
        break;
      case 'eliminar':
        console.log('Eliminar seleccionado');
        break;
      default:
        console.warn('Acción no reconocida:', accion);
    }
  }

  public columnasTabla: IColumn[] = [
    {
      field: 'item',
      header: 'N°',
      type: 'item',
      width: '5%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cPersNombre',
      header: 'Nombres',
      type: 'text',
      width: '25%',
      text_header: 'left',
      text: 'left',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cPersApellidos',
      header: 'Apellidos',
      type: 'text',
      width: '30%',
      text_header: 'left',
      text: 'left',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cPersNombreApellidos',
      header: 'Nombres y Apelidos',
      type: 'text',
      width: '60%',
      text_header: 'left',
      text: 'left',
      class: 'table-cell md:hidden',
    },
    {
      field: 'cGradoNombre',
      header: 'Grado',
      type: 'text',
      width: '10%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cSeccionNombre',
      header: 'Sección',
      type: 'text',
      width: '10%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      field: 'cGradoSeccion',
      header: 'Sección',
      type: 'text',
      width: '20%',
      text_header: 'center',
      text: 'center',
      class: 'table-cell md:hidden',
    },
    {
      field: 'cEstadoNombre',
      header: 'Estado',
      type: 'text',
      width: '10%',
      text_header: 'center',
      text: 'center',
      class: 'hidden md:table-cell',
    },
    {
      type: 'actions',
      width: '10%',
      field: '',
      header: 'Acciones',
      text_header: 'right',
      text: 'right',
    },
  ];

  public accionesTabla: IActionTable[] = [
    {
      labelTooltip: 'Imprimir',
      icon: 'pi pi-print',
      accion: 'imprimir',
      type: 'item',
      class: 'p-button-rounded p-button-secondary p-button-text',
      isVisible: function (row) {
        return row.iFichaDGId !== null && row.iFichaDGId !== undefined;
      },
    },
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-file-edit',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
  ];
}
