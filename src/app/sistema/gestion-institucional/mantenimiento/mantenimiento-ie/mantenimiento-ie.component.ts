import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { EditarMantenimientoIeComponent } from './editar-mantenimiento-ie/editar-mantenimiento-ie.component';
import { MessageService } from 'primeng/api';
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service';
@Component({
  selector: 'app-mantenimiento-ie',
  standalone: true,
  imports: [TablePrimengComponent, PrimengModule, EditarMantenimientoIeComponent],
  templateUrl: './mantenimiento-ie.component.html',
  styleUrl: './mantenimiento-ie.component.scss',
})
export class MantenimientoIeComponent implements OnInit {
  selectedItem: any;
  titleEditarMantenimiento: string = 'Editar';
  mostrarEditarMantenimiento: boolean = false;
  columns = [
    {
      type: 'item',
      width: '1rem',
      field: 'id',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '12rem',
      field: 'apellidosNombres',
      header: 'Apellidos y Nombres',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'date',
      width: '6rem',
      field: 'fecha',
      header: 'Fecha',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '8rem',
      field: 'documento',
      header: 'Documento',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'tag',
      width: '4rem',
      field: 'seraLaborable',
      header: 'Será laborable',
      styles: {
        Sí: 'success',
        No: 'danger',
      },
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '15rem',
      field: 'observacion',
      header: 'Observación',
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

  dataMantenimiento = [
    {
      id: 1,
      apellidosNombres: 'García Pérez, Juan Carlos',
      fecha: '2025-01-15',
      documento: '12345678',
      seraLaborable: 'Sí',
      observacion: 'Mantenimiento preventivo del sistema eléctrico',
    },
    {
      id: 2,
      apellidosNombres: 'Rodríguez López, María Elena',
      fecha: '2025-01-20',
      documento: '87654321',
      seraLaborable: 'No',
      observacion: 'Reparación urgente de tuberías en el baño',
    },
    {
      id: 3,
      apellidosNombres: 'Fernández Castro, Luis Miguel',
      fecha: '2025-01-25',
      documento: '11223344',
      seraLaborable: 'Sí',
      observacion: 'Pintura de aulas del segundo piso',
    },
    {
      id: 4,
      apellidosNombres: 'Silva Morales, Ana Lucía',
      fecha: '2025-02-01',
      documento: '55667788',
      seraLaborable: 'Sí',
      observacion: 'Instalación de nuevas luminarias LED',
    },
    {
      id: 5,
      apellidosNombres: 'Torres Vega, Carlos Alberto',
      fecha: '2025-02-05',
      documento: '99887766',
      seraLaborable: 'No',
      observacion: 'Reparación del techo del gimnasio',
    },
  ];
  constructor(
    private messageService: MessageService,
    private confirmationModalService: ConfirmationModalService
  ) {}

  ngOnInit() {
    console.log('mantenimiento-ie component loaded');
    console.log('Data:', this.dataMantenimiento);
  }

  EditarMantenimiento() {
    this.mostrarEditarMantenimiento = true;
  }

  eliminarMantenimiento(item: any) {
    this.confirmationModalService.openConfirm({
      header: '¿Está seguro de eliminar estos datos del mantenimiento?',
      accept: () => {
        this.dataMantenimiento = this.dataMantenimiento.filter(m => m.id !== item.id);
      },
    });
  }

  accionBtnItemTable({ accion, item }) {
    switch (accion) {
      case 'editar':
        this.selectedItem = item;
        this.EditarMantenimiento();
        break;
      case 'eliminar':
        this.confirmationModalService.openConfirm({
          header: '¿Está seguro de eliminar estos datos del mantenimiento?',
          accept: () => {
            this.dataMantenimiento = this.dataMantenimiento.filter(m => m.id !== item.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Eliminado correctamente',
            });
          },
        });
        break;
    }
  }

  actions: IActionTable[] = [
    // {
    //   labelTooltip: 'Calendar registro',
    //   icon: 'pi pi-calendar-plus',
    //   accion: 'ver',
    //   type: 'item',
    //   class: 'p-button-rounded p-button-primary p-button-text',
    // },
    {
      labelTooltip: 'Editar mantenimiento',
      icon: 'pi pi-pencil',
      accion: 'editar',
      type: 'item',
      class: 'p-button-rounded p-button-success p-button-text',
    },
    {
      labelTooltip: 'Eliminar mantenimiento',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];
  cerrarModalEdicion(estado: boolean) {
    this.mostrarEditarMantenimiento = estado;
    if (!estado) {
      this.selectedItem = null;
    }
  }
}
