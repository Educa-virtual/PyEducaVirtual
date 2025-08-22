import { PrimengModule } from '@/app/primeng.module';
import { IColumn, TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-periodos-academicos',
  standalone: true,
  imports: [PrimengModule, TablePrimengComponent],
  templateUrl: './periodos-academicos.component.html',
  styleUrl: './periodos-academicos.component.scss',
})
export class PeriodosAcademicosComponent {
  public columnasTabla: IColumn[] = [
    {
      type: 'item',
      width: '0.5rem',
      field: 'index',
      header: '#',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '8rem',
      field: 'cPeriodo',
      header: 'Periodo',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '8rem',
      field: 'cInicio',
      header: 'Inicio',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'text',
      width: '8rem',
      field: 'cFin',
      header: 'Fin',
      text_header: 'center',
      text: 'center',
    },
    {
      type: 'item-innerHtml',
      width: '8rem',
      field: 'cFase',
      header: 'Fase',
      text_header: 'center',
      text: 'center',
    },
  ];

  data: any = [
    {
      cPeriodo: '1º Bimestre',
      cInicio: '18/03/2025',
      cFin: '17/05/2025',
      cFase: '<span class="px-3 py-2 text-white bg-green-500 border-round-lg">REGULAR</span>',
    },
    {
      cPeriodo: '2º Bimestre',
      cInicio: '18/03/2025',
      cFin: '17/05/2025',
      cFase: '<span class="px-3 py-2 text-white bg-green-500 border-round-lg">REGULAR</span>',
    },
    {
      cPeriodo: '3º Bimestre',
      cInicio: '18/03/2025',
      cFin: '17/05/2025',
      cFase: '<span class="px-3 py-2 text-white bg-green-500 border-round-lg">REGULAR</span>',
    },
    {
      cPeriodo: '4º Bimestre',
      cInicio: '18/03/2025',
      cFin: '17/05/2025',
      cFase: '<span class="px-3 py-2 text-white bg-green-500 border-round-lg">REGULAR</span>',
    },
    {
      cPeriodo: 'Vacacional',
      cInicio: '18/03/2025',
      cFin: '17/05/2025',
      cFase: '<span class="px-3 py-2 text-white bg-red-500 border-round-lg">RECUPERACIÓN</span>',
    },
  ];
}
