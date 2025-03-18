import { CommonModule } from '@angular/common'
import {
    Component,
    ChangeDetectionStrategy,
    Input,
    inject,
    OnChanges,
    ChangeDetectorRef,
} from '@angular/core'
import { IArea } from '../../interfaces/area.interface'
import { ButtonModule } from 'primeng/button'
import { Router, RouterModule } from '@angular/router'
import { TooltipModule } from 'primeng/tooltip'
import { CompartirFormularioEvaluacionService } from '../../../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'
import { ApiEvaluacionesRService } from '../../../../services/api-evaluaciones-r.service'
import { MessageService } from 'primeng/api'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ActivatedRoute } from '@angular/router'
@Component({
    selector: 'app-area-card',
    standalone: true,
    templateUrl: './area-card.component.html',
    styleUrl: './area-card.component.scss',
    imports: [CommonModule, TooltipModule, ButtonModule, RouterModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaCardComponent implements OnChanges {
    @Input() area: IArea
    @Input() _iEvaluacionId: number | null = null // Usamos _iEvaluacionId como input
    @Input() _nombreEvaluacion: string | null = null // Usamos _nombreEvaluacion como input
    areas: any[] = []
    private _apiEre = inject(ApiEvaluacionesRService)
    private _MessageService = inject(MessageService)
    iEvaluacionMatriz: number
    private _constantesService = inject(ConstantesService)
    private _route = inject(ActivatedRoute)
    preguntasSeleccionadas: any[]
    queryParams: any = {}
    areaId: string | null = null
    public params = {
        bPreguntaEstado: -1,
        iCursosNivelGradId: 0,
        iNivelTipoId: 1,
        iTipoPregId: 0,
    }
    @Input() cantidadPreguntas: number

    private _apiEvaluacionesR = inject(ApiEvaluacionesRService)
    constructor(
        private router: Router,
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) {}
    ngOnInit(): void {
        console.log(0)
    }
    ngOnChanges(changes) {
        // console.log(changes)
        if (changes.area.currentValue) {
            this.area = changes.area.currentValue
        }
    }
    irABancoPreguntas(area: any): void {
        // Almacenar los datos en el servicio
        this.compartirFormularioEvaluacionService.setcEvaluacionNombre(
            area.nombre
        )
        this.compartirFormularioEvaluacionService.setGrado(area.grado)
        this.compartirFormularioEvaluacionService.setNivel(area.nivel)
        this.compartirFormularioEvaluacionService.setSeccion(area.seccion)
        this.compartirFormularioEvaluacionService.setAreasId(area.id)
        // Navegar a la nueva ruta sin parámetros en la URL
        this.router.navigate(['./', area.id, 'banco-preguntas'])
    }

    /**
     * Función que genera y descarga un PDF de la matriz de evaluación correspondiente a un ID de evaluación.
     *
     * Esta función se comunica con el backend (API) para generar un PDF basado en el ID de evaluación proporcionado.
     * Si la generación del PDF es exitosa, inicia la descarga del archivo PDF. Si ocurre un error, muestra un mensaje
     * de error indicando la razón.
     *
     * @param {number} iEvaluacionId - El ID de la evaluación para la cual se generará la matriz PDF.
     */

    generarPdfMatriz(iEvaluacionId: number, area: IArea) {
        const params = {
            iEvaluacionId: this._iEvaluacionId,
            areaId: area.id,
            nombreCurso: area.nombre,
            nivel: area.nivel,
            grado: area.grado,
            seccion: area.seccion,
            nombreEvaluacion: this._nombreEvaluacion,
            especialista: this._constantesService.nombres,
        }

        this._apiEre.generarPdfMatrizbyEvaluacionId(params).subscribe(
            (response) => {
                // Se muestra un mensaje indicando que la descarga de la matriz ha comenzado
                this._MessageService.add({
                    severity: 'success',
                    detail: 'Comienza la descarga de la Matriz',
                })

                // Se crea un enlace de descarga para el archivo PDF generado
                const blob = response as Blob // Asegúrate de que la respuesta sea un Blob
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download =
                    'matriz_evaluacion_' +
                    area.nombre.toLocaleLowerCase() +
                    '.pdf' // Nombre del archivo descargado
                link.click()
            },
            (error) => {
                // En caso de error, se determina el mensaje de error a mostrar
                const errorMessage =
                    error?.message ||
                    'No hay datos suficientes para descargar la Matriz'
                this._MessageService.add({
                    severity: 'success', // Se cambió a "error" ya que es un fallo
                    detail: errorMessage,
                })
            }
        )
    }

    obtenerPreguntaSeleccionada(iEvaluacionId: number) {
        if (!iEvaluacionId || iEvaluacionId < 0) {
            console.error(
                'El parámetro iEvaluacionId no está definido o es inválido'
            )
            return
        }
        this.areaId = this.route.snapshot.paramMap.get('areaId')
        if (this.areaId) {
            this.params.iCursosNivelGradId = parseInt(this.areaId)
        }

        this._apiEre.obtenerPreguntaSeleccionada(iEvaluacionId).subscribe({
            next: (data: any[]) => {
                this.preguntasSeleccionadas = data.filter(
                    (item) =>
                        item.iCursosNivelGradId.toString() ===
                        this.params.iCursosNivelGradId.toString()
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

    generarWord() {
        const params = {
            iEvaluacionId: this._iEvaluacionId,
            areaId: this.area.id,
        }
        this._apiEvaluacionesR.generarWordByEvaluacionId(params)
    }
}
