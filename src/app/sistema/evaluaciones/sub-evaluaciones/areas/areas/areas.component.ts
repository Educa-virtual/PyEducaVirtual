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
    ],
})
export class AreasComponent {
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

    public onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value)
    }
}
