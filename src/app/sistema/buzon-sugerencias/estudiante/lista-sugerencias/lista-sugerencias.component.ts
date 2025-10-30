import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Component, OnInit } from '@angular/core';
import { RegistrarSugerenciaComponent } from '../registrar-sugerencia/registrar-sugerencia.component';
import { BuzonSugerenciasEstudianteService } from '../services/buzon-sugerencias-estudiante.service';
import { MenuItem, MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { VerSugerenciaComponent } from '../ver-sugerencia/ver-sugerencia.component';

@Component({
  selector: 'app-lista-sugerencias',
  standalone: true,
  imports: [
    PrimengModule,
    TablePrimengComponent,
    RegistrarSugerenciaComponent,
    VerSugerenciaComponent,
  ],
  templateUrl: './lista-sugerencias.component.html',
  styleUrl: './lista-sugerencias.component.scss',
})
export class ListaSugerenciasComponent implements OnInit {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  prioridades: any[];
  formularioNuevoHeader: string;
  mostrarFormularioNuevo: boolean = false;
  formularioVerHeader: string;
  mostrarFormularioVer: boolean = false;
  perfil: any = JSON.parse(localStorage.getItem('dremoPerfil'));
  usuarioEstudiante: boolean = this.perfil.iPerfilId == 80;
  visible: false;
  //form: FormGroup
  dataSugerencias: any[];
  selectedItem: any;
  actionsLista: IActionTable[];
  year: any = JSON.parse(localStorage.getItem('dremoYear'));

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
      header: 'Fecha sugerencia',
      text_header: 'center',
      text: 'center',
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
      width: '3rem',
      field: 'dtFechaRespuesta',
      header: 'Fecha respuesta',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '5rem',
      field: 'cNombreDirector',
      header: 'Nombre del Director',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'item-innerHtml',
      width: '8rem',
      field: 'cRespuestaCorta',
      header: 'Respuesta del director',
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
    private buzonSugerenciasEstudianteService: BuzonSugerenciasEstudianteService,
    private messageService: MessageService,
    private confirmationModalService: ConfirmationModalService
  ) {}

  ngOnInit() {
    this.obtenerListaSugerencias();
    this.breadCrumbItems = [
      {
        label: 'Buzón de sugerencias',
      },
    ];
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
  }

  listenSugerenciaRegistrada(event: boolean) {
    if (event == true) {
      this.mostrarFormularioNuevo = false;
      this.obtenerListaSugerencias();
    }
  }

  listenCerrarNuevaSugerencia(event: boolean) {
    if (event == false) {
      this.mostrarFormularioNuevo = false;
    }
  }

  listenDialogVerSugerencia(event: boolean) {
    if (event == false) {
      this.mostrarFormularioVer = false;
    }
  }

  nuevaSugerencia() {
    this.formularioNuevoHeader = 'Nueva sugerencia';
    this.mostrarFormularioNuevo = true;
  }

  verSugerencia() {
    this.formularioVerHeader = 'Ver sugerencia';
    this.mostrarFormularioVer = true;
  }

  /*resetearInputs() {
            this.form.reset()
        }*/

  obtenerListaSugerencias() {
    this.buzonSugerenciasEstudianteService.obtenerListaSugerencias(this.year).subscribe({
      next: (data: any) => {
        this.dataSugerencias = data.data.map((item: any) => ({
          ...item,
          cRespuestaCorta:
            item.cRespuesta?.length > 200
              ? item.cRespuesta.substring(0, 200) + '...'
              : item.cRespuesta,
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

  /**
   * Eliminar sugerencia segun id
   * @param item sugerencia a eliminar
   */
  eliminarSugerencia(item: any) {
    this.buzonSugerenciasEstudianteService.eliminarSugerencia(item.iSugerenciaId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se ha eliminado la sugerencia',
        });
        this.dataSugerencias = this.dataSugerencias.filter(
          (sug: any) => sug.iSugerenciaId !== item.iSugerenciaId
        );
      },
      error: error => {
        console.error('Error eliminando sugerencia:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'eliminar':
        this.confirmationModalService.openConfirm({
          header: '¿Está seguro de eliminar la sugerencia?',
          accept: () => {
            this.eliminarSugerencia(item);
          },
        });
        break;
      case 'ver':
        this.selectedItem = item;
        this.verSugerencia();
        break;
    }
  }

  actions: IActionTable[] = [
    {
      labelTooltip: 'Ver sugerencia',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
    {
      labelTooltip: 'Eliminar sugerencia',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
      /*isVisible: (row) => {
                            return row.iEstado === 1 && 2 == this.perfil.iCredId
                        },*/
    },
  ];
}
