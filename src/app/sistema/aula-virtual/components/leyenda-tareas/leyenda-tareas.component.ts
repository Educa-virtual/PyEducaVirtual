import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import {
    ILeyendaItem,
    LeyendaItemComponent,
} from './leyenda-item/leyenda-item.component'

@Component({
    selector: 'app-leyenda-tareas',
    standalone: true,
    imports: [CommonModule, LeyendaItemComponent],
    templateUrl: './leyenda-tareas.component.html',
    styleUrl: './leyenda-tareas.component.scss',
})
export class LeyendaTareasComponent {
    @Input() items: ILeyendaItem[] = []
}
