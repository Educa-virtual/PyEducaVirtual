import { Component, Input, OnInit } from '@angular/core';
import { AttendanceService, AttendanceRecord } from '../asistencia/services/asistencia.service';
//import { finalize } from 'rxjs/operators';
import { PrimengModule } from '@/app/primeng.module';
import { AulaBancoPreguntasModule } from '../../aula-virtual/sub-modulos/aula-banco-preguntas/aula-banco-preguntas.module';
import { MenuItem } from 'primeng/api';

type DayCell = {
  date: Date | null;
  dayNumber: number | null;
  iso: string | null; // YYYY-MM-DD or null
  status: string | null; //'A' | 'N' | 'T' | '';
};

@Component({
  selector: 'app-attendance-calendar',
  templateUrl: './asistencia.component.html',
  standalone: true,
  imports: [PrimengModule, AulaBancoPreguntasModule],
  styleUrls: ['./asistencia.component.scss'],
})
export class AsistenciaComponent implements OnInit {
  @Input() studentId!: number;
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;

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
      significado: 'Asistio',
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
      significado: 'Inasistencia Justificada',
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
      significado: 'Tardanza Justificada',
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

  // semana empezando LUNES
  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  selectedMonth!: number; // 1..12
  selectedYear: number = 2025;

  weeks: DayCell[][] = []; // grid semanas x 7
  loading = false;
  error: string | null = null;

  // Si true -> si falta registro para un día, lo tratamos como 'N'
  //treatMissingAsAbsent = false;

  constructor(private svc: AttendanceService) {}

  ngOnInit(): void {
    const today = new Date();
    this.selectedMonth = today.getMonth() + 1;
    this.selectedYear = today.getFullYear();
    this.breadCrumbItems = [{ label: 'Asistencia' }];
    this.breadCrumbHome = { icon: 'pi pi-home', routerLink: '/' };
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

  /*onYearChange(val: any) {
    this.selectedYear = +val;
    this.load();
  }*/

  private formatISO(d: Date) {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  load() {
    /*if (!this.studentId) {
      this.error = 'Falta studentId en el componente';
      return;
    }*/
    this.studentId = 5;
    this.loading = false;
    this.error = null;
    const records = [
      { fecha: '2025-10-01', asistio: 'X' },
      { fecha: '2025-10-02', asistio: 'X' },
      { fecha: '2025-10-03', asistio: 'I' },
      { fecha: '2025-10-04', asistio: '-' },
    ];
    this.buildCalendar(records);
    // map meses según servicio: enviamos month 1..12
    /*this.svc.getAttendanceForMonth(this.studentId, this.selectedMonth, this.selectedYear)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (records) => this.buildCalendar(records),
        error: (err) => this.error = (err?.message || 'Error cargando asistencia')
      });*/
  }

  private buildCalendar(records: AttendanceRecord[]) {
    // Map records por fecha ISO
    const map = new Map<string, string>();
    for (const r of records) {
      // Normalizar fecha por si viene con timezones (suponemos exacto YYYY-MM-DD)
      map.set(r.fecha, (r.asistio || '').toString().toUpperCase());
    }

    const year = this.selectedYear;
    const monthIndex = this.selectedMonth - 1; // Date usa 0..11
    const firstOfMonth = new Date(year, monthIndex, 1);
    const lastOfMonth = new Date(year, monthIndex + 1, 0); // último día

    const daysInMonth = lastOfMonth.getDate();

    // Determinar desplazamiento para que la semana empiece LUNES.
    // getDay(): 0=Dom,1=Lu,...6=Sa
    const startDay = firstOfMonth.getDay(); // 0..6
    const offset = (startDay + 6) % 7; // 0 => Monday, ..., 6 => Sunday

    // Construir celdas
    const totalCells = offset + daysInMonth;
    const totalWeeks = Math.ceil(totalCells / 7);
    const weeks: DayCell[][] = [];

    let dayCounter = 1;
    for (let w = 0; w < totalWeeks; w++) {
      const week: DayCell[] = [];
      for (let dow = 0; dow < 7; dow++) {
        const cellIndex = w * 7 + dow;
        if (cellIndex < offset || dayCounter > daysInMonth) {
          week.push({ date: null, dayNumber: null, iso: null, status: '' });
        } else {
          const d = new Date(year, monthIndex, dayCounter);
          const iso = this.formatISO(d);
          const statusFromBackend = map.get(iso);
          week.push({ date: d, dayNumber: dayCounter, iso: iso, status: statusFromBackend });
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
