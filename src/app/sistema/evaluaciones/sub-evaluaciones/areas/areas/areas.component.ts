import { DataViewModule, DataView } from 'primeng/dataview'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { DropdownModule } from 'primeng/dropdown'
import { TableModule } from 'primeng/table'
import { InputTextModule } from 'primeng/inputtext'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '../../../../../shared/table-primeng/table-primeng.component'
import { Component } from '@angular/core'
import { IArea } from '../interfaces/area.interface'
import { AreaCardComponent } from '../components/area-card/area-card.component'
//import { CursoCardComponent } from '../components/curso-card/curso-card.component'
import { ICurso } from '../../../../aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { ButtonModule } from 'primeng/button'

export type Layout = 'list' | 'grid'
@Component({
    selector: 'app-areas',
    standalone: true,
    templateUrl: './areas.component.html',
    styleUrl: './areas.component.scss',
    imports: [
        ContainerPageComponent,
        DataViewModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        DropdownModule,
        TableModule,
        TablePrimengComponent,
        AreaCardComponent,
        ButtonModule,
    ],
})
export class AreasComponent {
    public cursos: ICurso[] = []
    public data: ICurso[] = []
    public layout: Layout = 'list'
    public text: string = ''
    public searchText: Event
    public area: IArea[] = [
        {
            id: 0,
            nombre: 'Matemática',
            descripcion: 'dedscripcion?',
            seccion: 'A',
            grado: '1°',
            totalEstudiantes: 20,
            nivel: 'Primaria',
        },
        {
            id: 1,
            nombre: 'Matemática',
            descripcion: 'Descripcion?',
            seccion: 'A',
            grado: '2°',
            totalEstudiantes: 2,
            nivel: 'Primaria',
        },
        {
            id: 2,
            nombre: 'Matemática',
            descripcion: 'Descripcion?',
            seccion: 'B',
            grado: '2°',
            totalEstudiantes: 2,
            nivel: 'Primaria',
        },
    ]
    public sortField: string = ''
    public sortOrder: number = 0

    //!original
    // public onFilter(dv: DataView, event: Event) {
    //     dv.filter((event.target as HTMLInputElement).value)
    // }
    //!Agregado
    public onFilter(dv: DataView, event: Event) {
        const text = (event.target as HTMLInputElement).value
        this.cursos = this.data
        dv.value = this.data
        if (text.length > 1) {
            dv.filter(text)
            this.cursos = dv.filteredValue
        }
        if (this.layout === 'list') {
            this.searchText = event
        }
    }
}
