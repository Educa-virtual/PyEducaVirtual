import { Component, inject, OnInit, signal } from '@angular/core';
import { GeneralService } from '@/app/servicios/general.service';
import { PrimengModule } from '@/app/primeng.module';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { Message, MessageService } from 'primeng/api';
import { NoDataComponent } from '@/app/shared/no-data/no-data.component';
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component';

import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { BanIcon } from 'primeng/icons/ban';

@Component({
  selector: 'app-meritos',
  standalone: true,
  imports: [TablePrimengComponent, NoDataComponent, ContainerPageComponent, PrimengModule, BanIcon],
  templateUrl: './meritos.component.html',
  styleUrl: './meritos.component.scss',
})
export class MeritosComponent implements OnInit {
  private _GeneralService = inject(GeneralService);
  private _confirmService = inject(ConfirmationModalService);
  private store = inject(LocalStoreService);

  perfil: any = [];
  dremoiYAcadId: any;
  anio_actual: any;
  meritos = signal<any[]>([]);
  selectedItems = [];

  meritosAgrupados: any[] = [];

  breadCrumbItems = [{ label: 'Módulo Estudiante' }, { label: 'Méritos', active: true }];
  breadCrumbHome = { icon: 'pi pi-home', routerLink: '/' };

  messages: Message[] | undefined;

  //variables de cambio

  text: string = 'Ver como lista';

  layout: string = 'grid'; // vista por defecto
  options = ['list', 'grid'];

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

  getMeritos() {
    this.query
      .searchCalendario({
        json: JSON.stringify({
          // iPersId: this.perfil.iPersId,
          iSedeId: this.perfil.iSedeId,
          iYAcadId: this.dremoiYAcadId,
        }),
        _opcion: 'getMeritos', // getMeritoxiPersId
      })
      .subscribe({
        next: (data: any) => {
          this.meritos.set(data.data);
        },
        error: error => {
          this.messageService.add({
            severity: 'danger',
            summary: 'Mensaje del Sistema',
            detail: 'Error. al cargar los los neritos: ' + error.error.message,
          });
        },
        complete: () => {
          this.agruparMeritos();
        },
      });
  }

  agruparMeritos() {
    let m: any;
    //    const data = this.meritos();
    /*
    const grupos = data.reduce((acc: any, m: any) => {
      const tipo = m.cTipoMerito || 'Sin tipo';
  
      if (!acc[tipo]) {
        acc[tipo] = [];
      }
      acc[tipo].push(m);
      return acc;
    }, {});
  
    this.meritosAgrupados = Object.keys(grupos).map(tipo => ({
      tipo,
      items: grupos[tipo]
    }));*/
    const lista = this.meritos() || [];

    const grupos: any = {};

    for (m of lista) {
      if (!grupos[m.cTipoMerito]) {
        grupos[m.cTipoMerito] = [];
      }
      grupos[m.cTipoMerito].push(m);
    }

    this.meritosAgrupados = Object.keys(grupos).map(key => ({
      tipo: key,
      items: grupos[key],
    }));
  }

  onLayoutChange() {
    if (this.layout === 'grid') {
      //this.layout = 'list';
      this.text = 'Ver como cuadrícula';
    } else {
      //this.layout = 'grid';
      this.text = 'Ver como lista';
    }
  }

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
      header: 'Documento',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '20%',
      field: 'nombre_completo',
      header: 'Persona',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'text',
      width: '25%',
      field: 'cMeritoDescripcion',
      header: 'Descripción',
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
    // {
    //   type: 'estado-activo',
    //   width: '5%',
    //   field: 'iEstado',
    //   header: '',
    //   text_header: 'center',
    //   text: 'center',
    // },
    // {
    //   type: 'date',
    //   width: '10%',
    //   field: 'cMeritoRef',
    //   header: 'referencia',
    //   text_header: 'center',
    //   text: 'center',
    // },

    // {
    //   type: 'actions',
    //   width: '5%',
    //   field: 'actions',
    //   header: 'Acciones',
    //   text_header: 'center',
    //   text: 'center',
    // },
  ];
}
