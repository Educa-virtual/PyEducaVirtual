import { CommonModule } from '@angular/common'
import {
    Component,
    ChangeDetectionStrategy,
    Input,
    inject,
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
export class AreaCardComponent {
    @Input() area: IArea
    @Input() _iEvaluacionId: number | null = null // Usamos _iEvaluacionId como input
    @Input() _nombreEvaluacion: string | null = null // Usamos _nombreEvaluacion como input
    //@Input() cantidadPreguntas: number // Recibimos la cantidad de preguntas
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
        //iCursoId: 1,
        iCursosNivelGradId: 0,
        iNivelTipoId: 1,
        iTipoPregId: 0,
        // iEvaluacionId: 0,
    }
    //cantidadPreguntas: number = 0 // Valor inicial de la cantidad de preguntas
    @Input() cantidadPreguntas: number
    constructor(
        private router: Router,
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
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
        console.log(
            'Ingreso el Usuario Especialista: ',
            this._constantesService.iEspecialistaId
        )
        console.log(
            'Nombre completo del usuario: ',
            this._constantesService.nombres
        )
        this.obtenerPreguntaSeleccionada(this._iEvaluacionId)
        //this.obtenerConteoPorCurso()
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
        console.log('Aqui tendremos el id NivelGradoId:', area.id)
        // Convierte las áreas en una cadena JSON
        console.log('Ver si area se enviara en json o array:', area)
        const encodedAreas = JSON.stringify([area]) // Solo convertir a JSON string, no codificar
        console.log('Cadena JSON de las áreas:', encodedAreas)

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

        //en iEvaluacionId estaba el encodeAreas iEvaluacionId, encodedAreas
        this._apiEre.generarPdfMatrizbyEvaluacionId(params).subscribe(
            (response) => {
                //!
                console.log('Respuesta de Evaluacion:', iEvaluacionId) // Para depuración
                console.log('Acceder para params:', params)
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
    obtenerPreguntaSeleccionada(iEvaluacionId: number) {
        if (!iEvaluacionId || iEvaluacionId < 0) {
            console.error(
                'El parámetro iEvaluacionId no está definido o es inválido'
            )
            return
        }

        // Obtener el areaId dinámicamente desde la ruta
        this.areaId = this.route.snapshot.paramMap.get('areaId')
        console.log('Area Id:', this.areaId)

        // Si el areaId es válido, asignarlo a iCursosNivelGradId
        if (this.areaId) {
            this.params.iCursosNivelGradId = parseInt(this.areaId) // Convertir el areaId a número
            console.log(
                'iCursosNivelGradId asignado:',
                this.params.iCursosNivelGradId
            )
        }

        this._apiEre.obtenerPreguntaSeleccionada(iEvaluacionId).subscribe({
            next: (data: any[]) => {
                console.log('Datos sin filtrar:', data) // Verifica los datos originales

                // Convertir ambos valores a string para asegurar la comparación
                this.preguntasSeleccionadas = data.filter(
                    (item) =>
                        item.iCursosNivelGradId.toString() ===
                        this.params.iCursosNivelGradId.toString()
                )

                console.log('Datos filtrados:', this.preguntasSeleccionadas)
            },
            error: (error) => {
                console.error(
                    'Error al obtener las preguntas seleccionadas:',
                    error
                )
            },
        })
    }

    // obtenerConteoPorCurso() // iEvaluacionId: number,
    // // iCursosNivelGradId: number
    // : void {
    //     const iEvaluacionId = 679 // ID de evaluación de prueba
    //     const iCursosNivelGradId = 2 // ID del curso/nivel de grado de prueba
    //     this._apiEre
    //         .obtenerConteoPorCurso(iEvaluacionId, iCursosNivelGradId)
    //         .subscribe({
    //             next: (response) => {
    //                 this.cantidadPreguntas = response.cantidadPreguntas // Almacena el conteo de preguntas en la variable
    //                 console.log('Conteo de preguntas:', this.cantidadPreguntas)
    //             },
    //             error: (error) => {
    //                 console.error(
    //                     'Error al obtener las preguntas seleccionadas:',
    //                     error
    //                 )
    //             },
    //         })
    // }
    //!
    obtenerConteoPorCurso(): void {
        const iEvaluacionId = 679 // ID de evaluación de prueba
        const iCursosNivelGradId = 6 // ID del curso/nivel de grado de prueba
        this._apiEre
            .obtenerConteoPorCurso(iEvaluacionId, iCursosNivelGradId)
            .subscribe({
                next: (resp: any) => {
                    console.log('Respuesta completa de la API:', resp)
                    if (Array.isArray(resp)) {
                        const conteoCurso = resp.length
                        console.log('Conteo de curso:', conteoCurso)
                        this.cantidadPreguntas = conteoCurso
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
    //!

    procesarAreas(): void {
        console.log('Procesando áreas en el hijo:', this.areas)

        // Ejemplo: Contar áreas
        const totalAreas = this.areas.length
        console.log('Total de áreas:', totalAreas)

        // Ejemplo: Filtrar áreas
        const areasConEstudiantes = this.areas.filter(
            (area) => area.totalEstudiantes > 0
        )
        console.log('Áreas con estudiantes:', areasConEstudiantes)
    }
}
