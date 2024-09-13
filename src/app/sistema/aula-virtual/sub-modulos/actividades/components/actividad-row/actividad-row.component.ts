import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { AccordionModule } from 'primeng/accordion'

@Component({
    selector: 'app-actividad-row',
    standalone: true,
    imports: [CommonModule, AccordionModule],
    templateUrl: './actividad-row.component.html',
    styleUrl: './actividad-row.component.scss',
})
export class ActividadRowComponent {
    @Input({ required: true }) title: string
    @Input({ required: true }) category: string
    @Input({ required: true }) icon: string
}
