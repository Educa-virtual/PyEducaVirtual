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
import { ICurso } from '../../../../aula-virtual/sub-modulos/cursos/interfaces/curso.interface'
import { ButtonModule } from 'primeng/button'
import { ActivatedRoute } from '@angular/router'
import { ConstantesService } from '@/app/servicios/constantes.service'
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
    public params = {}
    cantidad: number = 0 // Valor inicial de la cantidad de preguntas
    private unsubscribe$: Subject<boolean> = new Subject()
    trackById: TrackByFunction<IArea>
    cantidadPreguntas: number
    iCursosNivelGradId: any = [] // ID del curso/nivel de grado de prueba
    nombreEvaluacionn: string = 'Evaluación de Prueba' // Nombre de la evaluación
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
        this.obtenerEspDremCurso() //Ejecutate primero
        this.nombreEvaluacion =
            this.compartirFormularioEvaluacionService.getcEvaluacionNombre()
        this.iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId
        this.obtenerPreguntaSeleccionada(this.iEvaluacionId)
    }

    obtenerEspDremCurso(): void {
        const iPersId = this.ConstantesService.iPersId // Obtén el iPersId
        const iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId // Obtén el iEvaluacionId
        this._apiEre.obtenerEspDremCurso(iPersId, iEvaluacionId).subscribe({
            next: (resp: any) => {
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
                        cantidad: null,
                    }))
                    this.area.filter((item) => {
                        this.iCursosNivelGradId.push(item.id)
                    })
                    // Guardar las áreas procesadas en el servicio
                    this.compartirFormularioEvaluacionService.setAreas(
                        this.area
                    )
                }
                this.obtenerConteoPorCurso()
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
                //console.log('Preguntas seleccionadas:', data)
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
    datos: any
    areaData = []
    obtenerConteoPorCurso(): void {
        this.datos = {
            iEvaluacionId: this.iEvaluacionId,
            iCursosNivelGradId: this.iCursosNivelGradId,
        }
        this._apiEre.obtenerConteoPorCurso(this.datos).subscribe({
            next: (resp: any) => {
                if (Array.isArray(resp)) {
                    // Asignar la cantidad de preguntas a cada área
                    this.area.filter((item) => {
                        item['cantidad'] = 0
                    })
                    this.area.filter((item) => {
                        resp.filter((list) => {
                            item['cantidad'] =
                                item.id == list.iCursosNivelGradId
                                    ? item['cantidad'] + 1
                                    : item['cantidad']
                        })
                    })
                    this.areaData = this.area
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
}
