import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core'
import { CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'

@Component({
    selector: 'app-full-calendario',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './full-calendario.component.html',
    styleUrl: './full-calendario.component.scss',
})
export class FullCalendarioComponent implements OnChanges {
    @Output() filtrarFestividad = new EventEmitter()
    @Output() filtrarCalendario = new EventEmitter()
    @Output() filtrarActividad = new EventEmitter()
    @Input() academicas
    @Input() curricula
    @Input() festividades
    @Input() actividades
    @Input() events

    activarIndice: number | number[] = [] //activa las pestañas de p-according
    ngOnInit() {
        window.addEventListener('resize', this.verificarDimension.bind(this))
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['events']) {
            this.calendarOptions.events = changes['events'].currentValue
        }
    }

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: false },
        initialView: 'dayGridMonth',
        locales: [esLocale],
        weekends: true,
        selectable: true,
        dayMaxEvents: true,
        height: 600,
        dayCellDidMount: (data) => {
            // Si el día es sábado o domingo
            if (data.dow === 6 || data.dow === 0) {
                data.el.style.backgroundColor = '#ffd7d7'
            }
        },
        headerToolbar: {
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
            center: 'title',
            start: 'prev,next today',
        },
    }
    movil: boolean = false
    verificarDimension() {
        this.movil = window.innerWidth < 768
        this.activarIndice = this.movil ? [] : [0]
    }

    eventoFestividades(id) {
        const data = {
            checkbox: id,
        }
        this.filtrarFestividad.emit(data)
    }
    eventoCurricular(id) {
        const data = {
            checkbox: id,
        }
        this.filtrarCalendario.emit(data)
    }
    eventoActividad(id) {
        const data = {
            checkbox: id,
        }
        this.filtrarActividad.emit(data)
    }
}
