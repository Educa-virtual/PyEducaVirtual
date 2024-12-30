import { Component } from '@angular/core'
import { ContainerPageComponent } from '../../../../../shared/container-page/container-page.component'
import { DataViewModule } from 'primeng/dataview'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { AreasEstudiosComponent } from '../../../../docente/areas-estudios/areas-estudios.component'
import { CursoCardComponent } from '../../../../aula-virtual/sub-modulos/cursos/components/curso-card/curso-card.component'
import { ButtonModule } from 'primeng/button'

@Component({
    selector: 'app-examen-ere',
    standalone: true,
    imports: [
        ContainerPageComponent,
        DataViewModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        AreasEstudiosComponent,
        CursoCardComponent,
        ButtonModule,
    ],
    templateUrl: './examen-ere.component.html',
    styleUrl: './examen-ere.component.scss',
})
export class ExamenEreComponent {
    // Lista de cursos que será iterada
    cursos = []
    curso = [
        {
            id: 2,
            nombre: 'Curso Angular',
            nivel: 'Intermedio',
            estudiantes: 25,
        },
        { id: 6, nombre: 'Curso React', nivel: 'Avanzado', estudiantes: 30 },
    ]
}
