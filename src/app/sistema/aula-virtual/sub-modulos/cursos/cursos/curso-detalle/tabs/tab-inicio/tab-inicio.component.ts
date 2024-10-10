import { Component, Input } from '@angular/core'
import { ProfesorAvatarComponent } from '../../../../components/profesor-avatar/profesor-avatar.component'
import { ICurso } from '../../../../interfaces/curso.interface'
import { ButtonModule } from 'primeng/button'

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
