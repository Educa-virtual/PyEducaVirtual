import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

export interface ILeyendaItem {
    total: number
    nombre: string
    color: string
}

@Component({
    selector: 'app-leyenda-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './leyenda-item.component.html',
    styleUrl: './leyenda-item.component.scss',
})
export class LeyendaItemComponent {
    @Input() item: ILeyendaItem = {
        total: 0,
        nombre: 'enviados',
        color: 'bg-green-100',
    }
}
