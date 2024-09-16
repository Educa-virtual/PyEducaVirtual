import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { CalendarModule } from 'primeng/calendar'

@Component({
    selector: 'app-disponibilidad-form',
    standalone: true,
    imports: [CommonModule, CalendarModule],
    templateUrl: './disponibilidad-form.component.html',
    styleUrl: './disponibilidad-form.component.scss',
})
export class DisponibilidadFormComponent {}
