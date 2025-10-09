import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import {
  IActionTable,
  IColumn,
  TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component';

@Component({
  selector: 'app-historial-desercion',
  standalone: true,
  imports: [TablePrimengComponent],
  templateUrl: './historial-desercion.component.html',
  styleUrl: './historial-desercion.component.scss',
})
export class HistorialDesercionComponent implements OnChanges {
  @Input() deserciones: any = [];

  @Output() accionBtnItem = new EventEmitter<{ accion: string; item: any }>();

  selectedItems: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    // this.desercion ={}
    this.deserciones = [];

    if (changes['deserciones']?.currentValue) {
      this.deserciones = changes['deserciones'].currentValue;
    }
  }

  procesar(event: any) {
    this.accionBtnItem.emit({ accion: event.accion, item: event.item });
  }

  actions: IActionTable[] = [
    {
      labelTooltip: 'editar deserción',
      icon: 'pi pi-pencil',
      accion: 'editar_desercion',
      type: 'item',
      class: 'p-button-rounded p-button-warning p-button-text',
    },
  ];

  columns: IColumn[] = [
    {
      type: 'item',
      width: '5%',
      field: 'item',
      header: 'Item',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '15%',
      field: 'cDescripcion',
      header: 'Tipo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '15%',
      field: 'dInicioDesercion',
      header: 'Inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'date',
      width: '15%',
      field: 'dFinDesercion',
      header: 'Fin',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '30%',
      field: 'cMotivoDesercion',
      header: 'Motivo',
      text_header: 'center',
      text: 'left',
    },
    {
      type: 'estado-activo',
      width: '15%',
      field: 'iEstado',
      header: 'Estado',
      text_header: 'center',
      text: 'center',
    },
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
