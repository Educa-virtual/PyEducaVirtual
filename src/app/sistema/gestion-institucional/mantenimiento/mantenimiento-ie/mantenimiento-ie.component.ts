import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { EditarMantenimientoIeComponent } from './editar-mantenimiento-ie/editar-mantenimiento-ie.component';
@Component({
  selector: 'app-mantenimiento-ie',
  standalone: true,
  imports: [TablePrimengComponent, PrimengModule, EditarMantenimientoIeComponent],
  templateUrl: './mantenimiento-ie.component.html',
  styleUrl: './mantenimiento-ie.component.scss',
})
export class MantenimientoIeComponent implements OnInit {
  selectedItem: any;
  formularioNuevoHeader: string = '';

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
    // {
    //   id: 6,
    //   apellidosNombres: 'Mendoza Ríos, Patricia Isabel',
    //   fecha: '2025-02-10',
    //   documento: 'DNI: 44332211',
    //   seraLaborable: 'Sí',
    //   observacion: 'Mantenimiento de equipos de cómputo'
    // },
    // {
    //   id: 7,
    //   apellidosNombres: 'Vargas Huamán, José Antonio',
    //   fecha: '2025-02-15',
    //   documento: 'DNI: 66778899',
    //   seraLaborable: 'Sí',
    //   observacion: 'Limpieza y desinfección de tanques de agua'
    // },
    // {
    //   id: 8,
    //   apellidosNombres: 'Chávez Paredes, Rosa María',
    //   fecha: '2025-02-20',
    //   documento: 'DNI: 33445566',
    //   seraLaborable: 'No',
    //   observacion: 'Reparación de puertas y ventanas'
    // }
  ];

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

  actions: IActionTable[] = [
    {
      labelTooltip: 'Ver mantenimiento',
      icon: 'pi pi-eye',
      accion: 'ver',
      type: 'item',
      class: 'p-button-rounded p-button-primary p-button-text',
    },
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

  ngOnInit() {
    console.log('mantenimiento-ie component loaded');
    console.log('Data:', this.dataMantenimiento);
  }

  accionBtnItemTable(event: any) {
    const { accion, item } = event;
    console.log('Acción:', accion, 'Item:', item);

    // switch (accion) {
    //   // case 'ver':
    //   //   this.verMantenimiento(item);
    //   //   break;
    //   // case 'editar':
    //   //   this.editarMantenimiento(item);
    //   //   break;
    //   // case 'eliminar':
    //   //   this.eliminarMantenimiento(item);
    //   //   break;
    // }
  }

  // verMantenimiento(item: any) {
  //   console.log('Ver mantenimiento:', item);
  //   this.selectedItem = item
  // }

  // editarMantenimiento(item: any) {
  //   console.log('Editar mantenimiento:', item);
  //   this.selectedItem = item;
  // }

  // eliminarMantenimiento(item: any) {
  //   console.log('Eliminar mantenimiento:', item);
  // }
}
