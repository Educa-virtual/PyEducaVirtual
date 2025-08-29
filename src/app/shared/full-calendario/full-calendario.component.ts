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

  handleEventClick(info: EventClickArg) {
    const clickedDate = info.event.start;
    if (!clickedDate) return;

    const allEvents = info.view.calendar.getEvents();
    const eventsOnDay = allEvents
      .filter(e => e.display !== 'none')
      .filter(e => this.isSameDay(e.start, clickedDate));
    eventsOnDay.sort((a, b) => (a.start?.getTime() || 0) - (b.start?.getTime() || 0));

    this.dialogEvents = eventsOnDay;
    this.dialogDateLabel = this.formatDateLabel(clickedDate);
    this.showEventsDialog = true;

    info.jsEvent?.preventDefault();
  }

  handleMoreLinkClick(arg: any) {
    const segs = arg.allSegs || arg.segs || [];
    this.dialogEvents = segs
      .map((s: any) => s.event)
      .filter((event: any) => event.display !== 'none');

    let fecha: Date | undefined;

    if (arg && arg.date) {
      const d = typeof arg.date === 'string' ? new Date(arg.date) : arg.date;
      if (d instanceof Date && !isNaN(d.getTime())) {
        fecha = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      }
    }
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

    this.dialogDateLabel = fecha ? this.formatDateLabel(fecha) : '';
    this.showEventsDialog = true;
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
