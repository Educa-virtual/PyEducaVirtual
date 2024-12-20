import { DataViewModule, DataView } from 'primeng/dataview'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { DropdownModule } from 'primeng/dropdown'
import { TableModule } from 'primeng/table'
import { InputTextModule } from 'primeng/inputtext'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '../../../../../shared/table-primeng/table-primeng.component'
import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit,
    TrackByFunction,
} from '@angular/core'
import { IArea } from '../interfaces/area.interface'
import { AreaCardComponent } from '../components/area-card/area-card.component'
//import { CursoCardComponent } from '../components/curso-card/curso-card.component'
import { ICurso } from '../../../../aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { ButtonModule } from 'primeng/button'
import { ActivatedRoute } from '@angular/router'
import { ConstantesService } from '@/app/servicios/constantes.service' //!AQUI ESTA EL USUARIO
//import { ApiEvaluacionesRService } from '../../../../services/api-evaluaciones-r.service'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { Subject } from 'rxjs'
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
        ButtonModule,
        CommonModule,
        AreaCardComponent,
    ],
})
export class AreasComponent implements OnInit {
    private ConstantesService = inject(ConstantesService)
    private _apiEre = inject(ApiEvaluacionesRService)
    //areas: any[] = [] // Áreas locales en el componente
    public cursos: ICurso[] = []
    public data: ICurso[] = []
    public layout: Layout = 'list'
    public text: string = ''
    public searchText: Event
    public area: IArea[] = [] // Inicialmente vacío, se llenará con los datos de la API.
    public sortField: string = ''
    public sortOrder: number = 0
    public iEvaluacionId: number | null = null // Para almacenar el ID de la evaluación.
    public nombreEvaluacion: string | null = null // Para almacenar el nombre de la evaluación.
    selectedCursoId: number | null = null // Variable para almacenar el curso seleccionado
    preguntasSeleccionadas: any
    //@Input() _iEvaluacionId: string | null = null // Usamos _iEvaluacionId como input
    public params = {}
    cantidadPreguntas: number = 0 // Valor inicial de la cantidad de preguntas
    private unsubscribe$: Subject<boolean> = new Subject()
    trackById: TrackByFunction<IArea>

    //cantidadPreguntas: number
    iEvaluacionIdd = 679 // ID de evaluación de prueba
    iCursosNivelGradIdd = 6 // ID del curso/nivel de grado de prueba
    nombreEvaluacionn: string = 'Evaluación de Prueba' // Nombre de la evaluación
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
        private cdr: ChangeDetectorRef,
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

        console.log(
            'EVALUACION SOTRAGE:',
            this.compartirIdEvaluacionService.iEvaluacionIdStorage
        )
        this.obtenerEspDremCurso()
        this.obtenerPreguntaSeleccionada(this.iEvaluacionId)
    }

    obtenerEspDremCurso(): void {
        const iPersId = this.ConstantesService.iPersId // Obtén el iPersId
        const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId // Obtén el iEvaluacionId
        // const iEvaluacionId =
        //     this.compartirIdEvaluacionService.iEvaluacionIdStorage

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
                        id: Number(item.iCursosNivelGradId), // Usamos iCursoId como ID.
                        nombre: item.cCursoNombre || 'Sin nombre', // Nombre del curso.
                        descripcion:
                            item.cCursoDescripcion || 'Sin descripción', // Descripción del curso.
                        seccion: item.cGradoRomanos || 'Sin sección', // Ejemplo: I.
                        grado: item.cGradoAbreviacion || 'Sin grado', // Ejemplo: 1ro.
                        totalEstudiantes: 0, //!Cambiar esto y que se vea las preguntas.
                        nivel: 'Primaria', // Puedes ajustarlo según tu lógica o datos de la API.
                    }))
                    // Guardar las áreas procesadas en el servicio
                    this.compartirFormularioEvaluacionService.setAreas(
                        this.area
                    )
                }
                console.log('Datos procesados para áreas:', this.area)
            },

            error: (err) => {
                console.error('Error al cargar datos:', err)
            },
        })
    }

    obtenerPreguntaSeleccionada(iEvaluacionId: number) {
        if (!iEvaluacionId || iEvaluacionId < 0) {
            console.error(
                'El parámetro iEvaluacionIdS no está definido o es inválido'
            )
            return
        }
        this._apiEre.obtenerPreguntaSeleccionada(iEvaluacionId).subscribe({
            next: (data) => {
                console.log('Preguntas seleccionadas:', data)
                this.preguntasSeleccionadas = data // Guardamos las preguntas en una variable
                console.log(
                    'Datos completos de banco de preguntas:',
                    this.preguntasSeleccionadas
                )
            },
            error: (error) => {
                console.error(
                    'Error al obtener las preguntas seleccionadas:',
                    error
                )
            },
        })
    }

    // obtenerConteoPorCurso(): void {
    //     const iEvaluacionId = 679 // ID de evaluación de prueba
    //     const iCursosNivelGradId = 6 // ID del curso/nivel de grado de prueba
    //     this._apiEre
    //         .obtenerConteoPorCurso(iEvaluacionId, iCursosNivelGradId)
    //         .subscribe({
    //             next: (resp: any) => {
    //                 console.log('Respuesta completa de la API:', resp)
    //                 if (Array.isArray(resp)) {
    //                     const conteoCurso = resp.length
    //                     console.log('Conteo de curso:', conteoCurso)
    //                     this.cantidadPreguntas = conteoCurso
    //                     this.cdr.detectChanges() // Forzar detección de cambios
    //                 } else {
    //                     console.error('Respuesta inesperada:', resp)
    //                 }
    //             },
    //             error: (err) => {
    //                 console.error('Error al cargar datos:', err)
    //             },
    //         })
    // }
    obtenerConteoPorCurso(
        iEvaluacionIdd: number,
        iCursosNivelGradIdd: number
    ): void {
        this._apiEre
            .obtenerConteoPorCurso(iEvaluacionIdd, iCursosNivelGradIdd)
            .subscribe({
                next: (resp: any) => {
                    console.log('Respuesta completa de la API:', resp)
                    if (Array.isArray(resp)) {
                        // Asignar la cantidad de preguntas a cada área
                        this.areas = resp.map((area) => ({
                            ...area, // Mantener la estructura del área
                            cantidadPreguntas: area.conteo || 0, // Asignar la cantidad de preguntas
                        }))
                        console.log(
                            'Áreas con cantidad de preguntas:',
                            this.areas
                        )
                        this.cdr.detectChanges() // Forzar detección de cambios
                    } else {
                        console.error('Respuesta inesperada:', resp)
                    }
                },
                error: (err) => {
                    console.error('Error al cargar datos:', err)
                },
            })
    }

    // Método para invocar la obtención de datos de las áreas
    cargarConteoPorCurso(): void {
        this.obtenerConteoPorCurso(
            this.iEvaluacionIdd,
            this.iCursosNivelGradIdd
        )
    }
}
