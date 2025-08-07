import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import {
  IActionTable,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';
import { PrimengModule } from '@/app/primeng.module';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-asignar-calendario',
  standalone: true,
  imports: [PrimengModule, InputNumberModule, TablePrimengComponent],
  templateUrl: './asignar-calendario.component.html',
  styleUrl: './asignar-calendario.component.scss',
})
export class AsignarCalendarioComponent implements OnChanges {
  @Output() asignar = new EventEmitter();

  @Input() iNumBloque: number = 0;
  @Input() registros: any = [];

  selectedItems = [];
  private inicializacionPendiente = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['iNumBloque'] && changes['iNumBloque'].currentValue) ||
      (changes['registros'] && changes['registros'].currentValue)
    ) {
      if (!this.inicializacionPendiente) {
        this.inicializacionPendiente = true;
        setTimeout(() => {
          this.inicializarFormulario();
          this.inicializacionPendiente = false;
        });
      }
    }
  }
  inicializarFormulario() {
    console.log(this.registros, '', this.iNumBloque, '');
  }
  accionBtnItemTable(item: any) {
    this.asignar.emit(item);
  }

  columnsBloque = [
    {
      type: 'item',
      width: '1rem',
      field: 'item',
      header: 'N°',
      text_header: 'center',
      text: 'center',
    },

    {
      type: 'time',
      width: '5rem',
      field: 'tBloqueInicio',
      header: 'Inicio de Bloque',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'time',
      width: '5rem',
      field: 'tBloqueFin',
      header: 'Fin de Bloque',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'estado-activo',
      width: '5rem',
      field: 'iEstado',
      header: 'Activo',
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

  actions: IActionTable[] = [
    {
      labelTooltip: 'Eliminar',
      icon: 'pi pi-trash',
      accion: 'eliminar',
      type: 'item',
      class: 'p-button-rounded p-button-danger p-button-text',
      /* isVisible: (rowData) => {
            if (Number(this.iEstado) === 0 || rowData.iEstado === 1) {
                return true // Mostrar el botón si el estado es 1
            }
            return false // Ocultar el botón en otros casos
        },*/
      //isVisible: () => !this.iEstado or
    },
  ];
}
