import { DataViewModule, DataView } from 'primeng/dataview'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { DropdownModule } from 'primeng/dropdown'
import { TableModule } from 'primeng/table'
import { InputTextModule } from 'primeng/inputtext'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '../../../../../shared/table-primeng/table-primeng.component'
import { Component, OnInit } from '@angular/core'
//import { CursoCardComponent } from '../components/curso-card/curso-card.component'
import { ICurso } from '../../../../aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { ButtonModule } from 'primeng/button'
import { ActivatedRoute } from '@angular/router'
import { CursoCardComponent } from '@/app/sistema/aula-virtual/sub-modulos/cursos/components/curso-card/curso-card.component'
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
        ButtonModule,
        CursoCardComponent,
    ],
})
export class AreasComponent implements OnInit {
    public cursos: ICurso[] = []
    public data: ICurso[] = []
    public layout: Layout = 'list'
    public text: string = ''
    public searchText: Event
    public area: ICurso[] = [
        {
            iCursoId: 0,
            cCursoNombre: 'Matemática',
            descripcion: 'dedscripcion?',
            seccion: 'A',
            cGradoAbreviacion: '1°',
            iEstudiantes: 20,
            cNivelNombreCursos: 'Primaria',
        },
        {
            iCursoId: 1,
            cCursoNombre: 'Matemática',
            descripcion: 'Descripcion?',
            seccion: 'A',
            cGradoAbreviacion: '2°',
            iEstudiantes: 2,
            cNivelNombreCursos: 'Primaria',
        },
        {
            iCursoId: 2,
            cCursoNombre: 'Matemática',
            descripcion: 'Descripcion?',
            seccion: 'B',
            cGradoAbreviacion: '2°',
            iEstudiantes: 2,
            cNivelNombreCursos: 'Primaria',
        },
    ]
    public sortField: string = ''
    public sortOrder: number = 0
    public iEvaluacionId: string | null = null // Para almacenar el ID de la evaluación.
    public nombreEvaluacion: string | null = null // Para almacenar el nombre de la evaluación.
    //@Input() _iEvaluacionId: string | null = null // Usamos _iEvaluacionId como input

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
    constructor(private route: ActivatedRoute) {}
    ngOnInit(): void {
        // Capturar el parámetro iEvaluacionId de la URL
        this.route.queryParams.subscribe((params) => {
            this.iEvaluacionId = params['iEvaluacionId']
            this.nombreEvaluacion = params['nombreEvaluacion']
            console.log(
                'iEvaluacionId recibido en AreasComponent:',
                this.iEvaluacionId
            )
            console.log('nombreEvaluacion:', this.nombreEvaluacion)
        })

        // El resto de tu lógica de inicialización
        //this.obtenerCursos() // O cualquier otra lógica para cargar los datos.
    }
}
