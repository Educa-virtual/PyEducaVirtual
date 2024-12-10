import { DataViewModule, DataView } from 'primeng/dataview'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { DropdownModule } from 'primeng/dropdown'
import { TableModule } from 'primeng/table'
import { InputTextModule } from 'primeng/inputtext'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '../../../../../shared/table-primeng/table-primeng.component'
import { Component, inject, OnInit, TrackByFunction } from '@angular/core'
import { IArea } from '../interfaces/area.interface'
import { AreaCardComponent } from '../components/area-card/area-card.component'
//import { CursoCardComponent } from '../components/curso-card/curso-card.component'
import { ICurso } from '../../../../aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { ButtonModule } from 'primeng/button'
import { ActivatedRoute } from '@angular/router'
import { ConstantesService } from '@/app/servicios/constantes.service' //!AQUI ESTA EL USUARIO
//import { ApiEvaluacionesRService } from '../../../../services/api-evaluaciones-r.service'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { Subject, takeUntil } from 'rxjs'
import { CompartirFormularioEvaluacionService } from '../../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'
import { CompartirIdEvaluacionService } from '../../../services/ereEvaluaciones/compartir-id-evaluacion.service'
import { CommonModule } from '@angular/common'
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
        CommonModule,
    ],
})
export class AreasComponent implements OnInit {
    private ConstantesService = inject(ConstantesService)
    private _apiEre = inject(ApiEvaluacionesRService)
    public cursos: ICurso[] = []
    public data: ICurso[] = []
    public layout: Layout = 'list'
    public text: string = ''
    public searchText: Event
    public area: IArea[] = [] // Inicialmente vacío, se llenará con los datos de la API.
    // public area: IArea[] = [
    //     {
    //         id: 0,
    //         nombre: 'Matemática',
    //         descripcion: 'dedscripcion?',
    //         seccion: 'A',
    //         grado: '1°',
    //         totalEstudiantes: 20,
    //         nivel: 'Primaria',
    //     },
    //     {
    //         id: 1,
    //         nombre: 'Matemática',
    //         descripcion: 'Descripcion?',
    //         seccion: 'A',
    //         grado: '2°',
    //         totalEstudiantes: 2,
    //         nivel: 'Primaria',
    //     },
    //     {
    //         id: 2,
    //         nombre: 'Matemática',
    //         descripcion: 'Descripcion?',
    //         seccion: 'B',
    //         grado: '2°',
    //         totalEstudiantes: 2,
    //         nivel: 'Primaria',
    //     },
    // ]
    public sortField: string = ''
    public sortOrder: number = 0
    public iEvaluacionId: number | null = null // Para almacenar el ID de la evaluación.
    public nombreEvaluacion: string | null = null // Para almacenar el nombre de la evaluación.
    //@Input() _iEvaluacionId: string | null = null // Usamos _iEvaluacionId como input
    public params = {}

    private unsubscribe$: Subject<boolean> = new Subject()
    trackById: TrackByFunction<IArea>
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
    constructor(
        private route: ActivatedRoute,
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService,
        private compartirIdEvaluacionService: CompartirIdEvaluacionService
    ) {}
    ngOnInit(): void {
        // // Capturar el parámetro iEvaluacionId de la URL
        // this.route.queryParams.subscribe((params) => {
        //     this.iEvaluacionId = params['iEvaluacionId']
        //     this.nombreEvaluacion = params['nombreEvaluacion']
        // })
        this.nombreEvaluacion =
            this.compartirFormularioEvaluacionService.getcEvaluacionNombre()

        this.iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId
        console.log(
            'Evaluacion Servicio ---->',
            this.compartirIdEvaluacionService.iEvaluacionId
        )
        // console.log('iEvaluacionId: ---->', this.iEvaluacionId)
        // console.log(
        //     'Nombre de la evaluación ----->:',
        //     this.compartirFormularioEvaluacionService.getcEvaluacionNombre()
        // )

        this.obtenerEspDremCurso()
    }
    obtenerEspDrem(): void {
        this._apiEre

            .obtenerEspDrem(this.params)

            .pipe(takeUntil(this.unsubscribe$))

            .subscribe({
                next: (resp: any) => {
                    console.log('Respuesta completa de la API:', resp)
                },

                error: (err) => {
                    console.error('Error al cargar datos:', err)
                },
            })
    }
    obtenerEspDremCurso(): void {
        const iPersId = this.ConstantesService.iPersId // Obtén el iPersId
        const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId // Obtén el iEvaluacionId
        console.log('iPersId:', iPersId, 'Evaluacion', iEvaluacionId) // Asegúrate de que el valor está disponible

        this._apiEre.obtenerEspDremCurso(iPersId, iEvaluacionId).subscribe({
            next: (resp: any) => {
                console.log(
                    'Respuesta completa de la API Datos Especialistas Cursos:',
                    resp
                )

                // Procesar y mapear los datos al formato de IArea.
                if (resp.data && Array.isArray(resp.data)) {
                    this.area = resp.data.map((item: any) => ({
                        id: Number(item.iCursoId), // Usamos iCursoId como ID.
                        nombre: item.cCursoNombre || 'Sin nombre', // Nombre del curso.
                        descripcion:
                            item.cCursoDescripcion || 'Sin descripción', // Descripción del curso.
                        seccion: item.cGradoRomanos || 'Sin sección', // Ejemplo: I.
                        grado: item.cGradoAbreviacion || 'Sin grado', // Ejemplo: 1ro.
                        totalEstudiantes: 0, // Asumimos 0 porque no viene en la API.
                        nivel: 'Primaria', // Puedes ajustarlo según tu lógica o datos de la API.
                    }))
                }
                console.log('Datos procesados para áreas:', this.area)
            },

            error: (err) => {
                console.error('Error al cargar datos:', err)
            },
        })
    }
}
