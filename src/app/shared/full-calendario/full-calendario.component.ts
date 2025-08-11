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
    //navLinks: true,
    height: 600,
    dayCellDidMount: data => {
      // Si el día es sábado o domingo
      if (data.dow === 6 || data.dow === 0) {
        data.el.style.backgroundColor = '#ffd7d7';
      }
    },
    eventClick: this.handleEventClick.bind(this),
    eventDidMount: info => {
      // tooltip nativo con texto completo al hover (opcional)
      info.el.setAttribute('title', info.event.title);
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
    const clickedDate = info.event.start; // Date
    if (!clickedDate) {
      return;
    }
    const allEvents = info.view.calendar.getEvents();
    const eventsOnDay = allEvents.filter(e => this.isSameDay(e.start, clickedDate));
    eventsOnDay.sort((a, b) => {
      const ta = a.start ? a.start.getTime() : 0;
      const tb = b.start ? b.start.getTime() : 0;
      return ta - tb;
    });

    this.dialogEvents = eventsOnDay;
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    this.dialogDateLabel = clickedDate.toLocaleDateString('es-PE', opts);
    //this.dialogDateLabel = clickedDate.toLocaleDateString(); // formato local
    this.showEventsDialog = true;
    info.jsEvent?.preventDefault();
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
