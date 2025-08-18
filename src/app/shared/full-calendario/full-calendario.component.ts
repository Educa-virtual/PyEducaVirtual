import { PrimengModule } from '@/app/primeng.module';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CalendarOptions, EventApi, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { formatDate } from '@fullcalendar/core';

@Component({
  selector: 'app-full-calendario',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './full-calendario.component.html',
  styleUrl: './full-calendario.component.scss',
})
export class FullCalendarioComponent implements OnChanges {
  @Output() filtrarFestividad = new EventEmitter();
  @Output() filtrarCalendario = new EventEmitter();
  @Output() filtrarActividad = new EventEmitter();
  @Input() academicas;
  @Input() curricula;
  @Input() festividades;
  @Input() actividades;
  @Input() events;

  activarIndice: number | number[] = []; //activa las pestañas de p-according
  OnInit() {
    window.addEventListener('resize', this.verificarDimension.bind(this));
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events']) {
      this.calendarOptions.events = changes['events'].currentValue;
    }
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    initialView: 'dayGridMonth',
    locales: [esLocale],
    weekends: true,
    selectable: true,
    dayMaxEvents: true,
    displayEventTime: true,
    displayEventEnd: true,
    //navLinks: true,
    height: 600,
    dayCellDidMount: data => {
      // Si el día es sábado o domingo
      if (data.dow === 6 || data.dow === 0) {
        data.el.style.backgroundColor = '#ffd7d7';
      }
    },
    moreLinkClick: this.handleMoreLinkClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDidMount: info => {
      info.el.style.cursor = 'pointer';
      info.el.setAttribute('title', info.event.title || '');
    },
    headerToolbar: {
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
      center: 'title',
      start: 'prev,next today',
    },
  };
  movil: boolean = false;
  verificarDimension() {
    this.movil = window.innerWidth < 768;
    this.activarIndice = this.movil ? [] : [0];
  }

  eventoFestividades(id) {
    const data = {
      checkbox: id,
    };
    this.filtrarFestividad.emit(data);
  }
  eventoCurricular(id) {
    const data = {
      checkbox: id,
    };
    this.filtrarCalendario.emit(data);
  }
  eventoActividad(id) {
    const data = {
      checkbox: id,
    };
    this.filtrarActividad.emit(data);
  }

  formatTime(event: any): string {
    if (event.allDay) return '';
    const fmt: any = { hour: '2-digit', minute: '2-digit', hour12: false };
    const start = event.start ? formatDate(event.start, fmt) : '';
    const end = event.end ? formatDate(event.end, fmt) : '';
    return start && end ? `${start} - ${end}` : start || '';
  }

  showEventsDialog = false;
  dialogDateLabel = '';
  dialogEvents: EventApi[] = [];

  // Maneja clic directo en un evento
  handleEventClick(info: EventClickArg) {
    const clickedDate = info.event.start;
    if (!clickedDate) return;

    // tomar todos los eventos del calendario y filtrar por el mismo día
    const allEvents = info.view.calendar.getEvents();
    const eventsOnDay = allEvents.filter(e => this.isSameDay(e.start, clickedDate));
    eventsOnDay.sort((a, b) => (a.start?.getTime() || 0) - (b.start?.getTime() || 0));

    this.dialogEvents = eventsOnDay;
    this.dialogDateLabel = this.formatDateLabel(clickedDate);
    this.showEventsDialog = true;

    info.jsEvent?.preventDefault();
  }

  handleMoreLinkClick(arg: any) {
    // Debug opcional (descomenta si quieres inspeccionar la estructura)
    // console.log('moreLink arg:', arg);

    // 1) intentar obtener todos los segmentos de eventos (nombres posibles según versión)
    const segs = arg.allSegs || arg.segs || [];
    this.dialogEvents = segs.map((s: any) => s.event);

    // 2) intentar obtener la fecha "verdadera" del día de la celda
    let fecha: Date | undefined;

    // a) si el arg.date existe y es Date/ISO, normalizamos usando las partes UTC
    if (arg && arg.date) {
      const d = typeof arg.date === 'string' ? new Date(arg.date) : arg.date;
      if (d instanceof Date && !isNaN(d.getTime())) {
        // Construir una fecha local con las partes UTC para evitar el desfase de zona horaria
        fecha = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      }
    }
    // c) finalmente, tomar la fecha desde el primer evento (start) si sigue sin fecha
    if (!fecha && this.dialogEvents.length > 0) {
      const firstStart = this.dialogEvents[0].start;
      if (firstStart instanceof Date && !isNaN(firstStart.getTime())) {
        fecha = new Date(firstStart.getFullYear(), firstStart.getMonth(), firstStart.getDate());
      } else if (typeof firstStart === 'string') {
        const parsed = new Date(firstStart);
        if (!isNaN(parsed.getTime())) {
          fecha = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
        }
      }
    }

    // Formatear label
    this.dialogDateLabel = fecha ? this.formatDateLabel(fecha) : '';

    // Abrir dialog
    this.showEventsDialog = true;

    // evitar popup por defecto
    return 'none';
  }

  formatDateLabel(d: Date): string {
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return d.toLocaleDateString('es-PE', opts);
  }

  isSameDay(a?: Date | null, b?: Date | null): boolean {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }
}
