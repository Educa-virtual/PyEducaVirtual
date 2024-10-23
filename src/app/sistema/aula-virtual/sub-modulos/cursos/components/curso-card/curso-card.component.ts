import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { ICurso } from '../../interfaces/curso.interface'
import { ButtonModule } from 'primeng/button'
import { RouterModule } from '@angular/router'

@Component({
    selector: 'app-curso-card',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule],
    templateUrl: './curso-card.component.html',
    styleUrl: './curso-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursoCardComponent {
    @Input() curso: ICurso
}