import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { ICurso } from '../../interfaces/curso.interface'
import { ButtonModule } from 'primeng/button'
import { RouterModule } from '@angular/router'
import { environment } from '@/environments/environment'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-curso-card',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, PrimengModule],
    templateUrl: './curso-card.component.html',
    styleUrl: './curso-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursoCardComponent {
    backend = environment.backend
    @Input() curso: ICurso

    updateUrl(item) {
        item.cCursoImagen = 'cursos/images/no-image.jpg'
    }
}
