import { GeneralService } from '@/app/servicios/general.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { Message, MessageService } from 'primeng/api';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';

import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { FormMeritoComponent } from './form-merito/form-merito.component';

@Component({
  selector: 'app-gestion-meritos',
  standalone: true,
  imports: [
    TablePrimengComponent,
    NoDataComponent,
    ContainerPageComponent,
    PrimengModule,
    FormMeritoComponent,
  ],
  templateUrl: './gestion-meritos.component.html',
  styleUrl: './gestion-meritos.component.scss',
})
export class GestionMeritosComponent implements OnInit {
  perfil: any = [];
  dremoiYAcadId: any;
  anio_actual: any;

  messages: Message[] | undefined;

  meritos = signal<any[]>([]);
  tipo_merito = signal<any[]>([]);
  selectedItems = [];
  bUpdate: boolean = false;
  selecionado: any = {};

  private _GeneralService = inject(GeneralService);
  private _confirmService = inject(ConfirmationModalService);
  private store = inject(LocalStoreService);

  constructor(
    private messageService: MessageService,
    private query: GeneralService
  ) {}

  ngOnInit() {
    this.perfil = this.store.getItem('dremoPerfil');
    this.dremoiYAcadId = this.store.getItem('dremoiYAcadId');
    this.anio_actual = this.store.getItem('dremoYear');
    this.getMeritos();

    this.messages = [
      { severity: 'info', detail: 'La información es correspondiente al año seleccionado' },
    ];
  }

  //Consultas

  getMeritos() {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          iSedeId: this.perfil.iSedeId,
          iYAcadId: this.dremoiYAcadId,
        }),
        _opcion: 'getMeritos',
      })
      .subscribe({
        next: (data: any) => {
          this.meritos.set(data.data);
          console.log(this.meritos(), 'this.meritos');
        },
        error: error => {
          this.messageService.add({
            severity: 'danger',
            summary: 'Mensaje del Sistema',
            detail: 'Error. al cargar los los neritos: ' + error.error.message,
          });
        },
      });
  }
  accionBtnItem(event: any) {
    if (event.accion === 'nuevo_merito') {
      this.selecionado = {};
      this.bUpdate = false;
    }
    if (event.accion === 'merito') {
      this.getMeritos();
    }
    if (event.accion === 'editar_merito') {
      this.selecionado = {};
      this.selecionado = event.item;
      this.bUpdate = false;
      this.bUpdate = true;
    }
  }

  actions: IActionTable[] = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'editar_merito',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
      // isVisible: rowData => {
      //   return rowData.iEstado !== '1'; // Mostrar solo si el estado es 1 (activo)
      // },
    },
  ];

  acciones: IActionContainer[] = [
    {
      labelTooltip: 'Agregar merito',
      text: 'Nuevo merito',
      icon: 'pi pi-plus',
      accion: 'nuevo_merito',
      class: 'p-button-success',
    },
  ];

  columns: IColumn[] = [
    {
      type: 'item',
      width: '5%m',
      field: 'item',
      header: 'Item',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '10%',
      field: 'cTipoMerito',
      header: 'Tipo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cPersDocumento',
      header: 'Dni / CE',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '15%',
      field: 'nombre_completo',
      header: 'Persona',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '20%',
      field: 'cMeritoDescripcion',
      header: 'descripción',
      text_header: 'center',
      text: 'left',
    },

    // {
    //   type: 'text',
    //   width: '10%',
    //   field: 'iMeritoPuntaje',
    //   header: 'Puntaje',
    //   text_header: 'center',
    //   text: 'center',
    // },
    {
      type: 'text',
      width: '15%',
      field: 'iMeritoPuesto',
      header: 'Puesto',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '10%',
      field: 'dMeritoFecha',
      header: 'Fecha',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '5%',
      field: 'iEstado',
      header: '',
      text_header: 'center',
      text: 'center',
    },
    // {
    //   type: 'date',
    //   width: '10%',
    //   field: 'cMeritoRef',
    //   header: 'referencia',
    //   text_header: 'center',
    //   text: 'center',
    // },

    {
      type: 'actions',
      width: '5%',
      field: 'actions',
      header: 'Acciones',
      text_header: 'center',
      text: 'center',
    },
  ];
}
