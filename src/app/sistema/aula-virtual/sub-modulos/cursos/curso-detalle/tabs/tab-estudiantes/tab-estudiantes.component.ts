import { IEstudiante } from '@/app/sistema/aula-virtual/interfaces/estudiantes.interface'
import { Component, Input } from '@angular/core'
import { AvatarModule } from 'primeng/avatar'
import { ListboxModule } from 'primeng/listbox'

@Component({
    selector: 'app-tab-estudiantes',
    standalone: true,
    imports: [ListboxModule, AvatarModule],
    templateUrl: './tab-estudiantes.component.html',
    styleUrl: './tab-estudiantes.component.scss',
})
export class TabEstudiantesComponent {
    @Input({ required: true }) estudiantes: IEstudiante[] = []
}
