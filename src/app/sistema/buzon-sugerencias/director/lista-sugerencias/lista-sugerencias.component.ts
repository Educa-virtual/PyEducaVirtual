import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { ResponderSugerenciaComponent } from '../responder-sugerencia/responder-sugerencia.component';
import { BuzonSugerenciasDirectorService } from '../services/buzon-sugerencias-director.service';
@Component({
  selector: 'app-lista-sugerencias',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent, ResponderSugerenciaComponent],
  templateUrl: './lista-sugerencias.component.html',
  styleUrl: './lista-sugerencias.component.scss',
})
export class ListaSugerenciasComponent implements OnInit {
  title: string = 'Buzón de sugerencias - Director';
  prioridades: any[];
  mostrarFormularioVer: boolean = false;
  mostrarFormularioResponder: boolean = false;
  selectedItem: any;
  cerrarResponderSugerencia: boolean = false;
  //breadcrumb
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  dataSugerencias: any[];

  columns = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '3rem',
      field: 'dtFechaCreacion',
      header: 'Fecha de sugerencia',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'text',
      width: '5rem',
      field: 'cNombreEstudiante',
      header: 'Estudiante',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '12rem',
      field: 'cAsunto',
      header: 'Asunto',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'tag',
      width: '2rem',
      field: 'cPrioridadNombre',
      header: 'Prioridad',
      styles: {
        Alta: 'danger',
        Baja: 'success',
        Media: 'warning',
      },
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '3rem',
      field: 'cDiasTranscurridos',
      header: 'Días transcurridos',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '6rem',
      field: 'dtFechaRespuesta',
      header: 'Fecha respuesta',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'item-innerHtml',
      width: '8rem',
      field: 'cRespuestaCorta',
      header: 'Respuesta',
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
    private buzonSugerenciasDirectorService: BuzonSugerenciasDirectorService,
    private messageService: MessageService,
    private confirmationModalService: ConfirmationModalService
  ) {}

  ngOnInit() {
    this.obtenerListaSugerencias();
  }

  recortarRespuesta(respuesta: string) {
    return respuesta?.length > 200 ? respuesta.substring(0, 200) + '...' : respuesta;
  }

  obtenerListaSugerencias() {
    this.buzonSugerenciasDirectorService.obtenerListaSugerencias().subscribe({
      next: (data: any) => {
        this.dataSugerencias = data.data.map((item: any) => ({
          ...item,
          cRespuestaCorta: this.recortarRespuesta(item.cRespuesta),
        }));
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener sugerencias',
          detail: error.error.message,
        });
      },
    });
  }

  actions: IActionTable[] = [
    {
      labelTooltip: 'Responder sugerencia',
      icon: 'pi pi-pen-to-square',
      accion: 'responder',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
  ];

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'responder':
        this.selectedItem = item;
        this.responderSugerencia();
        break;
    }
  }

  responderSugerencia() {
    this.mostrarFormularioResponder = true;
  }

  listenSugerenciaRespondida(event: any) {
    this.mostrarFormularioResponder = false;
    this.selectedItem.cRespuesta = event.respuesta;
    this.selectedItem.dtFechaRespuesta = new Date(event.fecha);
    this.dataSugerencias = this.dataSugerencias.map(sug => {
      if (sug.iSugerenciaId === this.selectedItem.iSugerenciaId) {
        return {
          ...sug,
          cRespuesta: event.respuesta,
          cRespuestaCorta: this.recortarRespuesta(event.respuesta),
          dtFechaRespuesta: new Date(event.fecha),
        };
      }
      return sug;
    });
  }

  listenCerrarResponderSugerencia(event: boolean) {
    if (event == false) {
      this.mostrarFormularioResponder = false;
    }
  }
}
