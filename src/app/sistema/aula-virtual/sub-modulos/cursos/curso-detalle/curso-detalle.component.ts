import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
    selector: 'app-curso-detalle',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cursos-detalle.component.html',
    styleUrl: './curso-detalle.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursoDetalleComponent {}
