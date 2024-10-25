import { Component, Input } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { ProfesorAvatarComponent } from '../../../components/profesor-avatar/profesor-avatar.component'
import { ICurso } from '../../../interfaces/curso.interface'
import { EditorModule } from 'primeng/editor'
import { TableModule } from 'primeng/table'
import { PrimengModule } from '@/app/primeng.module'
@Component({
    selector: 'app-tab-inicio',
    standalone: true,
    imports: [
        ProfesorAvatarComponent,
        ButtonModule,
        EditorModule,
        TableModule,
        PrimengModule,
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
