import { Component, Input } from '@angular/core'
import { ProfesorAvatarComponent } from '../../../components/profesor-avatar/profesor-avatar.component'
import { ICurso } from '../../../interfaces/curso.interface'
import { TableModule } from 'primeng/table'
import { PrimengModule } from '@/app/primeng.module'
import { EditorImageDirective } from '@/app/shared/directives/editor-image.directive'
@Component({
    selector: 'app-tab-inicio',
    standalone: true,
    imports: [
        ProfesorAvatarComponent,
        TableModule,
        PrimengModule,
        EditorImageDirective,
    ],
    templateUrl: './tab-inicio.component.html',
    styleUrl: './tab-inicio.component.scss',
})
export class TabInicioComponent {
    @Input() curso: ICurso
    @Input() anuncios = []
}
export class AppComponent {
    textValue: string = ''
}
