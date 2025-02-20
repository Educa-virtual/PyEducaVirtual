import { Component, ViewChild } from '@angular/core'
import { FullCalendarModule } from '@fullcalendar/angular'
import { CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
@Component({
    selector: 'app-full-calendar',
    standalone: true,
    imports: [FullCalendarModule],
    templateUrl: './full-calendar.component.html',
    styleUrl: './full-calendar.component.scss',
})
export class FullCalendarComponent {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locales: [esLocale],
        weekends: true,
        height: '100%',
        customButtons: {
            next: {
                // click: this.onEventClick.bind(this),
            },
            prev: {
                click: this.onEventClick.bind(this),
            },
            // today: {
            //     // text: "Aujourd'hui",
            //     // click: this.onEventClick.bind(this),
            // },
        },
    }
    someMethod() {
        // const calendarApi = this.calendarComponent.getApi();
        // calendarApi.next();
    }
    onEventClick(elemento) {
        console.log(elemento)
    }
}
