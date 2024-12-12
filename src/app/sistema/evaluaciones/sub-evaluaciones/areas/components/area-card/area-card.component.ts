import { CommonModule } from '@angular/common'
import {
    Component,
    ChangeDetectionStrategy,
    Input,
    inject,
} from '@angular/core'
import { IArea } from '../../interfaces/area.interface'
import { ButtonModule } from 'primeng/button'
import { Router, RouterModule } from '@angular/router'
import { TooltipModule } from 'primeng/tooltip'
import { CompartirFormularioEvaluacionService } from '../../../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'
import { ApiEvaluacionesRService } from '../../../../services/api-evaluaciones-r.service'
import { MessageService } from 'primeng/api'
@Component({
    selector: 'app-area-card',
    standalone: true,
    templateUrl: './area-card.component.html',
    styleUrl: './area-card.component.scss',
    imports: [CommonModule, TooltipModule, ButtonModule, RouterModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaCardComponent {
    @Input() area: IArea
    @Input() _iEvaluacionId: number | null = null // Usamos _iEvaluacionId como input
    @Input() _nombreEvaluacion: string | null = null // Usamos _nombreEvaluacion como input
    areas: any[] = []
    private _apiEre = inject(ApiEvaluacionesRService)
    private _MessageService = inject(MessageService)
    iEvaluacionMatriz: number
    constructor(
        private router: Router,
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService
    ) {}
    ngOnInit(): void {
        // Verifica si el parámetro llega correctamente
        console.log(
            'A ver si llega a AreaCard el iEvaluacionId: ----->',
            this._iEvaluacionId
        )

        // Obtener las áreas almacenadas en el servicio
        this.areas = this.compartirFormularioEvaluacionService.getAreas()
        console.log('Áreas obtenidas desde el servicio:', this.areas)
    }
    irABancoPreguntas(area: any): void {
        // Almacenar los datos en el servicio
        this.compartirFormularioEvaluacionService.setcEvaluacionNombre(
            area.nombre
        )
        this.compartirFormularioEvaluacionService.setGrado(area.grado)
        this.compartirFormularioEvaluacionService.setNivel(area.nivel)
        this.compartirFormularioEvaluacionService.setSeccion(area.seccion)
        this.compartirFormularioEvaluacionService.setSeccion(area.nombreCurso)
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
        iEvaluacionId = this._iEvaluacionId
        // Obtén las áreas desde el servicio
        // const areas = this.compartirFormularioEvaluacionService.getAreas()
        // console.log('Áreas obtenidas desde el servicio:', areas)

        // Convierte las áreas en una cadena JSON
        const encodedAreas = JSON.stringify([area]) // Solo convertir a JSON string, no codificar
        console.log('Cadena JSON de las áreas:', encodedAreas)
        //!
        this._apiEre
            .generarPdfMatrizbyEvaluacionId(iEvaluacionId, encodedAreas)
            .subscribe(
                (response) => {
                    console.log('Respuesta de Evaluacion:', iEvaluacionId) // Para depuración

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

                    // Se muestra un mensaje de error en el sistema
                    this._MessageService.add({
                        severity: 'success', // Se cambió a "error" ya que es un fallo
                        detail: errorMessage,
                    })
                }
            )
    }
}
