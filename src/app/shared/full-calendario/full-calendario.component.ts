import { PrimengModule } from '@/app/primeng.module'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'

@Component({
    selector: 'app-full-calendario',
    standalone: true,
    imports: [PrimengModule, FullCalendarioComponent],
    templateUrl: './full-calendario.component.html',
    styleUrl: './full-calendario.component.scss',
})
export class FullCalendarioComponent {
    @Output() eventCalendario = new EventEmitter<any>()
    @Input() importantes
    @Input() academicas
    @Input() curricula
    @Input() events: any

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: false },
        initialView: 'dayGridMonth',
        locales: [esLocale],
        weekends: true,
        selectable: true,
        dayMaxEvents: true,
        height: 600,
        dateClick: (item) => console.log(item),
        viewDidMount: (info) => {
            const weekendDays = ['sábado', 'viernes'] // establecemos los dias que se desea establecer un fondo se toma un dia antes
            const allDays = info.el.querySelectorAll('.fc-day')

            allDays.forEach((cell: HTMLElement) => {
                const date = new Date(cell.getAttribute('data-date')!) // captura los dias de la semana
                if (
                    weekendDays.includes(
                        date.toLocaleString('es-pe', { weekday: 'long' })
                    )
                ) {
                    cell.style.backgroundColor = '#ffd7d7'
                }
            })
        },
        headerToolbar: {
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
            center: 'title',
            start: 'prev,next today',
        },
    }

    usarEvento() {
        const data = {
            accion: '',
            item: 1,
        }
        this.eventCalendario.emit(data)
    }
}
