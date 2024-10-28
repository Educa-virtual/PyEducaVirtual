import { Component } from '@angular/core'
import { FullCalendarModule } from '@fullcalendar/angular'
import { CalendarOptions } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'

@Component({
    selector: 'app-full-calendar',
    standalone: true,
    imports: [FullCalendarModule],
    templateUrl: './full-calendar.component.html',
    styleUrl: './full-calendar.component.scss',
})
export class FullCalendarComponent {
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin],
    }
}
