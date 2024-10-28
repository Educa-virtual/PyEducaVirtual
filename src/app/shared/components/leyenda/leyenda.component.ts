import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-leyenda',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './leyenda.component.html',
    styleUrl: './leyenda.component.scss',
})
export class LeyendaComponent {
    @Input() total: number = 0
    @Input() colorClass: string = 'bg-green-500'
    @Input() text: string = 'Total'
    @Input() size: 'sm' | 'md' = 'md'

    get sizeClass() {
        return `circle__size--${this.size}`
    }
}
