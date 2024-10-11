import { Component, Input } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { ProfesorAvatarComponent } from '../../../components/profesor-avatar/profesor-avatar.component'
import { ICurso } from '../../../interfaces/curso.interface'

@Component({
    selector: 'app-tab-inicio',
    standalone: true,
    imports: [ProfesorAvatarComponent, ButtonModule],
    templateUrl: './tab-inicio.component.html',
    styleUrl: './tab-inicio.component.scss',
})
export class TabInicioComponent {
    @Input() curso: ICurso
    @Input() anuncios = []
}
