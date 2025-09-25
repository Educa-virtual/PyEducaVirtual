import { GeneralService } from '@/app/servicios/general.service';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

import {
  ContainerPageComponent,
  IActionContainer,
} from '@/app/shared/container-page/container-page.component';
import { ActividadesNoLectivasComponent } from '../../docente/actividades-no-lectivas/actividades-no-lectivas.component';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';

@Component({
  selector: 'app-actividad-no-lectiva',
  standalone: true,
  imports: [ContainerPageComponent, ActividadesNoLectivasComponent, TablePrimengComponent],
  templateUrl: './actividad-no-lectiva.component.html',
  styleUrl: './actividad-no-lectiva.component.scss',
})
export class ActividadNoLectivaComponent implements OnInit {
  perfil: any;
  iSedeId: number;
  iYAcadId: number;
  personal_ies: any[] = [];
  docentes: any[] = [];

  iDocenteId: number;

  seleccionado: boolean = false;

  breadCrumbItems: MenuItem[] = [
    {
      label: 'Validación de horas',
      routerLink: ['/gestion-institucional/validacion-no-lectiva'],
    },
  ];
  breadCrumbHome: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/',
  };

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
      width: '8rem',
      field: 'nombres',
      header: 'Docente',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '2rem',
      field: 'iHorasLabora',
      header: 'Horas',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '4rem',
      field: 'cPersCargoNombre',
      header: 'Cargo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '4rem',
      field: 'pendiente',
      header: 'Pendientes por revisar',
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

  actions = [
    {
      labelTooltip: 'Editar',
      icon: 'pi pi-pencil',
      accion: 'actualizar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];

  actionsContainer: IActionContainer[] = [
    {
      labelTooltip: 'Ver planes',
      text: 'Ver planes',
      icon: 'pi pi-view',
      accion: 'ver',
      class: 'p-button-primary',
    },
  ];

  constructor(
    private query: GeneralService,
    private store: LocalStoreService,
    private messageService: MessageService
  ) {
    this.query = query;
    this.store = store;
    this.messageService = messageService;
  }

  ngOnInit(): void {
    this.perfil = this.store.getItem('dremoPerfil');
    this.iSedeId = this.perfil.iSedeId;
    this.iYAcadId = this.store.getItem('dremoiYAcadId');

    this.searchPersonal();
  }

  searchPersonal() {
    this.query
      .searchPersonalIes({
        iSedeId: this.iSedeId,
        iYAcadId: this.iYAcadId,
      })
      .subscribe({
        next: (data: any) => {
          const item = data.data;

          this.personal_ies = item;

          console.log(this.personal_ies, 'personal ies');
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje del Sistema',
            detail: 'Error de conexion con el servidor' + (error.message ?? ''),
          });
        },
        complete: () => {
          const item = this.personal_ies;
          console.log(item, 'personal ies completo');
          this.docentes = item.filter(persona => persona.cPersCargoNombre === 'DOCENTE'); // o la condición real para "docente"

          // this.getYearCalendarios(this.formCalendario.value)
        },
      });
  }
  accionBtnItem(event: any) {
    console.log(event, 'evento acciones');
    const { accion, item } = event;
    switch (accion) {
      case 'actualizar':
        this.iDocenteId = item.iDocenteId;
        this.seleccionado = true;
        // this.edit(data);
        break;
      case 'delete':
        // this.delete(data);
        break;
      case 'ver':
        this.seleccionado = false;
        break;
      default:
        break;
    }
  }
}
