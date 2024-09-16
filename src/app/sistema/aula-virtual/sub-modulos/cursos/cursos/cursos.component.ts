import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CardModule } from 'primeng/card'
import { DataViewModule, DataView } from 'primeng/dataview'
import { TableModule } from 'primeng/table'
import { TablePrimengComponent } from '../../../../../shared/table-primeng/table-primeng.component'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { CursoCardComponent } from '../components/curso-card/curso-card.component'
import { ICurso } from '../interfaces/curso.interface'
import { DropdownModule } from 'primeng/dropdown'

@Component({
    selector: 'app-cursos',
    standalone: true,
    imports: [
        CommonModule,
        ContainerPageComponent,
        CardModule,
        DataViewModule,
        TableModule,
        TablePrimengComponent,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        CursoCardComponent,
        DropdownModule,
    ],
    templateUrl: './cursos.component.html',
    styleUrl: './cursos.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursosComponent {
    public cursos: ICurso[] = [
        {
            id: 0,
            nombre: 'Matemática',
            descripcion: 'dedscripcion?',
            seccion: 'A',
            grado: '1°',
            totalEstudiantes: 20,
        },
        {
            id: 1,
            nombre: 'Inglés',
            descripcion: 'Descripcion?',
            seccion: 'A',
            grado: '2°',
            totalEstudiantes: 2,
        },
    ]
    public sortField: string = ''
    public sortOrder: number = 0

    public onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value)
    }
}
