import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
    selector: 'app-cursos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './recursos.component.html',
    styleUrl: './recursos.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursosComponent {}
