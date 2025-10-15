import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { AsistenciaService } from './services/asistencia.service';
import { MessageService } from 'primeng/api';

type DayCell = {
  fecha: Date | null;
  numeroDia: number | null;
  fechaFormat: string | null;
  cTipoAsiLetra: string | null;
  cTipoAsiNombre: string | null;
  cursos: [] | null;
};

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  standalone: true,
  imports: [PrimengModule],
  styleUrls: ['./asistencia.component.scss'],
})
export class AsistenciaComponent implements OnChanges, OnInit {
  @Input() iMatrId: string = null;
  showDialog = false;
  selectedCell: DayCell | null = null;
  // semana empezando LUNES
  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  selectedMonth: number; // 1..12
  selectedYear: number;

  weeks: DayCell[][] = []; // grid semanas x 7
  loading = false;
  //error: string | null = null;

  months = [
    { label: 'Enero', value: 1 },
    { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 },
    { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Setiembre', value: 9 },
    { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 },
    { label: 'Diciembre', value: 12 },
  ];

  leyendaModal = [
    {
      significado: 'Asistió',
      iTipoAsiId: '1',
      simbolo: 'X',
      contar: 0,
      divColor: 'green-50-boton',
      bgColor: 'green-boton',
    },
    {
      significado: 'Inasistencia',
      iTipoAsiId: '3',
      simbolo: 'I',
      contar: 0,
      divColor: 'red-50-boton',
      bgColor: 'red-boton',
    },
    {
      significado: 'Inasistencia justificada',
      iTipoAsiId: '4',
      simbolo: 'J',
      contar: 0,
      divColor: 'primary-50-boton',
      bgColor: 'primary-boton',
    },
    {
      significado: 'Tardanza',
      iTipoAsiId: '2',
      simbolo: 'T',
      contar: 0,
      divColor: 'orange-50-boton',
      bgColor: 'orange-boton',
    },
    {
      significado: 'Tardanza justificada',
      iTipoAsiId: '9',
      simbolo: 'P',
      contar: 0,
      divColor: 'yellow-50-boton',
      bgColor: 'yellow-boton',
    },
    {
      significado: 'Sin Registro',
      iTipoAsiId: '7',
      simbolo: '-',
      contar: 0,
      divColor: 'cyan-50-boton',
      bgColor: 'cyan-boton',
    },
  ];

  constructor(
    private asistenciaService: AsistenciaService,
    private store: LocalStoreService,
    private messageService: MessageService
  ) {
    const today = new Date();
    this.selectedMonth = today.getMonth() + 1;
    this.selectedYear = this.selectedYear = this.store.getItem('dremoYear');
  }

  ngOnChanges(changes) {
    if (changes.iMatrId?.currentValue) {
      this.iMatrId = changes.iMatrId.currentValue;
      this.load();
    }
  }

  ngOnInit(): void {
    this.load();
  }

  prevMonth() {
    if (this.selectedMonth === 1) {
      this.selectedMonth = 12;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.load();
  }

  mostrarDetalles(cell: DayCell) {
    if (!cell || !cell.numeroDia) return; // Ignora celdas vacías
    this.selectedCell = cell;
    this.showDialog = true;
  }

  nextMonth() {
    if (this.selectedMonth === 12) {
      this.selectedMonth = 1;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.load();
  }

  onMonthChange(val: any) {
    this.selectedMonth = val;
    this.load();
  }

  private formatISO(d: Date) {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  load() {
    this.loading = true;
    if (this.iMatrId !== null) {
      this.asistenciaService
        .obtenerAsistenciaGeneralEstudianteApoderado(
          this.selectedYear,
          this.selectedMonth,
          this.iMatrId
        )
        .subscribe({
          next: (response: any) => {
            this.buildCalendar(response.data);
            this.loading = false;
          },
          error: err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
            });
            this.loading = false;
          },
        });
    } else {
      this.asistenciaService
        .obtenerAsistenciaGeneralEstudiante(this.selectedYear, this.selectedMonth)
        .subscribe({
          next: (response: any) => {
            this.buildCalendar(response.data);
            this.loading = false;
          },
          error: err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
            });
            this.loading = false;
          },
        });
    }
  }

  private buildCalendar(records: any[]) {
    // Map records por fecha ISO a un objeto con más propiedades
    const map = new Map<string, { cTipoAsiLetra: string; cTipoAsiNombre: string; cursos: [] }>();
    for (const r of records) {
      // Normalizar fecha por si viene con timezones (suponemos exacto YYYY-MM-DD)
      map.set(r.dtAsistencia, {
        cTipoAsiLetra: (r.cTipoAsiLetra || '').toString().toUpperCase(),
        cTipoAsiNombre: (r.cTipoAsiNombre || '').toString(),
        cursos: r.cursos,
      });
    }

    const year = this.selectedYear;
    const monthIndex = this.selectedMonth - 1; // Date usa 0..11
    const firstOfMonth = new Date(year, monthIndex, 1);
    const lastOfMonth = new Date(year, monthIndex + 1, 0); // último día

    const daysInMonth = lastOfMonth.getDate();

    const startDay = firstOfMonth.getDay(); // 0..6
    const offset = (startDay + 6) % 7; // 0 => Monday, ..., 6 => Sunday

    const totalCells = offset + daysInMonth;
    const totalWeeks = Math.ceil(totalCells / 7);
    const weeks: DayCell[][] = [];

    let dayCounter = 1;
    for (let w = 0; w < totalWeeks; w++) {
      const week: DayCell[] = [];
      for (let dow = 0; dow < 7; dow++) {
        const cellIndex = w * 7 + dow;
        if (cellIndex < offset || dayCounter > daysInMonth) {
          week.push({
            fecha: null,
            numeroDia: null,
            fechaFormat: null,
            cTipoAsiLetra: '',
            cTipoAsiNombre: '',
            cursos: [],
          });
        } else {
          const d = new Date(year, monthIndex, dayCounter);
          const iso = this.formatISO(d);
          const statusFromBackend = map.get(iso);
          week.push({
            fecha: d,
            numeroDia: dayCounter,
            fechaFormat: iso,
            cTipoAsiLetra: statusFromBackend?.cTipoAsiLetra || '',
            cTipoAsiNombre: statusFromBackend?.cTipoAsiNombre || '',
            cursos: statusFromBackend?.cursos,
          });
          dayCounter++;
        }
      }
      weeks.push(week);
    }

    this.weeks = weeks;
  }
  // util: color CSS class por estado usando leyendaModal
  statusClass(s: string) {
    const leyenda = this.leyendaModal.find(l => l.simbolo === s);
    return leyenda ? leyenda.divColor : 'status-empty';
  }
}
