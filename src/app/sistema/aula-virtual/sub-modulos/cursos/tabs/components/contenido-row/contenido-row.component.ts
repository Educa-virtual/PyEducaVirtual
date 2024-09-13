import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { AccordionModule } from 'primeng/accordion'

@Component({
    selector: 'app-contenido-row',
    standalone: true,
    imports: [CommonModule, AccordionModule],
    templateUrl: './contenido-row.component.html',
    styleUrl: './contenido-row.component.scss',
})
export class ContenidoRowComponent {
    @Input({ required: true }) title: string
    @Input({ required: true }) category: string
    @Input({ required: true }) icon: string
}
