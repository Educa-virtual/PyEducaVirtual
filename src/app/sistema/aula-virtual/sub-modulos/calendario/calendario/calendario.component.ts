import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
    selector: 'app-cursos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendario.component.html',
    styleUrl: './calendario.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarioComponent {}
