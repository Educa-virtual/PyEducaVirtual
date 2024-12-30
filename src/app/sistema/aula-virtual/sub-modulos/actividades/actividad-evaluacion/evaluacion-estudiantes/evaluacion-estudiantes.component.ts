import { Component, inject, Input, OnChanges } from '@angular/core'
import { ToolbarPrimengComponent } from '../../../../../../shared/toolbar-primeng/toolbar-primeng.component'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { CommonModule } from '@angular/common'
import { TimeComponent } from '@/app/shared/time/time.component'
import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { NgxDocViewerModule } from 'ngx-doc-viewer'
import { environment } from '@/environments/environment'
import { EmptySectionComponent } from '../../../../../../shared/components/empty-section/empty-section.component'
import { RecursosListaComponent } from '../../../../../../shared/components/recursos-lista/recursos-lista.component'
//import { interval, Subscription } from 'rxjs';
import { AccordionModule } from 'primeng/accordion'
import { RubricasModule } from '../../../../features/rubricas/rubricas.module'
import { RubricaEvaluacionComponent } from '../../../../features/rubricas/components/rubrica-evaluacion/rubrica-evaluacion.component'
import { RubricaCalificarComponent } from '@/app/sistema/aula-virtual/features/rubricas/components/rubrica-calificar/rubrica-calificar.component'

@Component({
    selector: 'app-evaluacion-estudiantes',
    standalone: true,
    imports: [
        ToolbarPrimengComponent,
        IconComponent,
        CommonModule,
        TimeComponent,
        PrimengModule,
        NgxDocViewerModule,
        EmptySectionComponent,
        RecursosListaComponent,
        AccordionModule,
        RubricasModule,
        RubricaEvaluacionComponent,
        RubricaCalificarComponent,
    ],
    templateUrl: './evaluacion-estudiantes.component.html',
    styleUrl: './evaluacion-estudiantes.component.scss',
})
export class EvaluacionEstudiantesComponent implements OnChanges {
    private _ConstantesService = inject(ConstantesService)
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private _ConfirmationModalService = inject(ConfirmationModalService)
    private _ConfirmationService = inject(ConfirmationService)

    environment = environment.backend
    @Input() evaluacion
    evaluacion1: { iTiempo: number | null } = { iTiempo: 120 }

    iPreguntaId: number = 0
    preguntas = []
    itemPreguntas = []
    esUltimaPregunta: boolean = false
    display: boolean
    timeRemaining: number
    cTareaEstudianteComentarioDocente: any
    selectedEstudiante: any
    toggleSection: any
    sections: any
    tabs: any

    ngOnChanges(changes) {
        if (changes.evaluacion?.currentValue) {
            this.evaluacion = changes.evaluacion.currentValue
            const totalPreguntas = this.evaluacion
                ? this.evaluacion.preguntas.length
                : 0
            if (this.evaluacion && totalPreguntas > 0) {
                this.evaluacion.preguntas.forEach((item, index) => {
                    this.preguntas.push({
                        id: index + 1,
                        preguntas: item,
                    })
                })
            }
        }
    }

    iniciarEvaluacion() {
        this.iPreguntaId++
        this.itemPreguntas = this.preguntas.find(
            (item) => item.id === this.iPreguntaId
        )
        this.itemPreguntas = this.itemPreguntas?.['preguntas'] || []
        this.esUltimaPregunta = this.iPreguntaId === this.preguntas.length
        this.filtrarPreguntasxiTipoPregId()

        this.iniciarTemporizador()
    }

    regresarPregunta(): void {
        if (this.iPreguntaId > 1) {
            this.iPreguntaId--
            const preguntaActual = this.preguntas.find(
                (item) => item.id === this.iPreguntaId
            )
            this.itemPreguntas = preguntaActual?.['preguntas'] || []
            this.esUltimaPregunta = false // Desactiva el estado de "última pregunta".
            this.filtrarPreguntasxiTipoPregId()
        } else {
            alert('Ya estás en la primera pregunta.')
        }
    }

    finalizarEvaluacion() {
        // Aquí va la lógica para finalizar la evaluación
        const fechaActual = new Date() // Obtiene la fecha y hora actual.
        console.log(`Fecha y hora de envío: ${fechaActual.toLocaleString()}`) // Imprime fecha y hora en formato legible.
        console.log(
            'Evaluación finalizada con ID de pregunta: ',
            this.iPreguntaId
        )
        alert('Evaluación finalizada. ¡Gracias por participar!')

        // Cerrar el modal
        // this._ConfirmationService.confirm({
        //     header: 'Evaluación finalizada!',
        //     message: '¡Felicitaciones, en hora buena! ahora a esperar tus resultados',
        //     icon:'pi pi-check',
        //     acceptIcon: 'pi pi-check mr-2',
        //     rejectIcon: 'pi pi-times mr-2',
        //     rejectButtonStyleClass: 'p-button-sm',
        //     acceptButtonStyleClass: 'p-button-outlined p-button-sm',

        // });
    }
    siguienteEvaluacion(): void {
        // Verificar si no estamos en la última pregunta
        if (
            this.evaluacion?.preguntas &&
            this.iPreguntaId < this.evaluacion.preguntas.length
        ) {
            this.iPreguntaId++ // Avanzar a la siguiente pregunta
            this.itemPreguntas = this.evaluacion.preguntas[this.iPreguntaId - 1] // Actualizar la pregunta actual
            this.filtrarPreguntasxiTipoPregId()
        } else {
            console.warn('No hay más preguntas disponibles.')
        }
    }
    // esta seccion Filtrapreguntas por Pregunta ID
    filtrarPreguntasxiTipoPregId() {
        switch (Number(this.itemPreguntas['iTipoPregId'])) {
            case 1:
                this.itemPreguntas['cRptaRadio'] = null
                break
            case 2:
                this.itemPreguntas['alternativas'].forEach((i) => {
                    i.cRptaCheck = null
                })
                console.log(this.itemPreguntas['alternativas'])
                break
            case 3:
                this.itemPreguntas['cRptaTexto'] = null
                break
        }
        console.log(this.itemPreguntas)
    }
    //Enviando Respuesta unica,multiple,libre
    enviarRpta(tipoRpta, pregunta) {
        let params
        switch (tipoRpta) {
            case 'unica':
                params = {
                    petition: 'post',
                    group: 'evaluaciones',
                    prefix: 'evaluacion/estudiantes',
                    ruta: 'guardarRespuestaxiEstudianteId',
                    data: {
                        iEstudianteId: this._ConstantesService.iEstudianteId,
                        iEvalPregId: pregunta.iEvalPregId,
                        iEvaluacionId: pregunta.iEvaluacionId,
                        jEvalRptaEstudiante:
                            '{"rptaUnica":"' + pregunta.cRptaRadio + '"}',
                    },
                    params: { skipSuccessMessage: true },
                }
                this.getInformation(params, '')
                break
            case 'multiple':
                let respuestas = ''
                pregunta.alternativas.forEach((item) => {
                    const cMarcado = item.cRptaCheck
                        ? item.cRptaCheck.length
                            ? item.cRptaCheck[0]
                            : null
                        : null
                    if (cMarcado) {
                        respuestas = respuestas + '"' + item.cRptaCheck + '",'
                    }
                })
                const letra_ultimo = respuestas.charAt(respuestas.length - 1)
                if (letra_ultimo === ',') {
                    respuestas = respuestas.substring(0, respuestas.length - 1)
                }

                params = {
                    petition: 'post',
                    group: 'evaluaciones',
                    prefix: 'evaluacion/estudiantes',
                    ruta: 'guardarRespuestaxiEstudianteId',
                    data: {
                        iEstudianteId: this._ConstantesService.iEstudianteId,
                        iEvalPregId: pregunta.iEvalPregId,
                        iEvaluacionId: pregunta.iEvaluacionId,
                        jEvalRptaEstudiante:
                            '{"rptaMultiple": [' + respuestas + ']}',
                    },
                    params: { skipSuccessMessage: true },
                }
                this.getInformation(params, '')
                //fin
                break
            case 'libre':
                if (pregunta.cRptaTexto != '') {
                    params = {
                        petition: 'post',
                        group: 'evaluaciones',
                        prefix: 'evaluacion/estudiantes',
                        ruta: 'guardarRespuestaxiEstudianteId',
                        data: {
                            iEstudianteId:
                                this._ConstantesService.iEstudianteId,
                            iEvalPregId: pregunta.iEvalPregId,
                            iEvaluacionId: pregunta.iEvaluacionId,
                            jEvalRptaEstudiante:
                                '{"rptaAbierta":"' + pregunta.cRptaTexto + '"}',
                        },
                        params: { skipSuccessMessage: true },
                    }
                    this.getInformation(params, '')
                }
                break
            case 'encabezado':
                if (pregunta.cRptaTexto != '') {
                    params = {
                        petition: 'post',
                        group: 'evaluaciones',
                        prefix: 'evaluacion/estudiantes',
                        ruta: 'guardarRespuestaxiEstudianteId',
                        data: {
                            iEstudianteId:
                                this._ConstantesService.iEstudianteId,
                            iEvalPregId: pregunta.iEvalPregId,
                            iEvaluacionId: pregunta.iEvaluacionId,
                            jEvalRptaEstudiante:
                                '{"rptacabecera":"' +
                                pregunta.cRptaTexto +
                                '"}',
                        },
                        params: { skipSuccessMessage: true },
                    }
                    this.getInformation(params, '')
                }
                break
        }
    }
    /**
     * Método para obtener información y manejar respuestas en función de una acción específica.
     * @param {any} params - Parámetros necesarios para realizar la solicitud al servicio.
     * @param {string} accion - Nombre de la acción asociada a esta solicitud, utilizado para identificarla en el flujo.
     */
    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                console.log(accion)
                if (response.validated) {
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Guardado!',
                        detail: 'Se guardó correctamente la respuesta',
                        life: 3000, // Duración en milisegundos
                    })
                }
            },
            error: (error) => {
                console.log(error)
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                    sticky: true, // Aplicar también si es necesario para errores
                })
            },
            complete: () => {},
        })
    }

    subscription
    tiempoRestante
    tiempoEnMilisegundos

    iniciarTemporizador(): void {
        if (
            !this.evaluacion?.dtEvaluacionInicio ||
            !this.evaluacion?.dtEvaluacionFin
        ) {
            //console.error("Fechas no válidas en `evaluacion`.");
            //return;
        }

        // Configuración inicial
        const inicio = new Date(this.evaluacion.dtEvaluacionInicio).getTime() // Tiempo de inicio en ms
        const fin = new Date(this.evaluacion.dtEvaluacionFin).getTime() // Tiempo de fin en ms
        this.tiempoEnMilisegundos = fin - inicio // Diferencia en ms

        if (this.tiempoEnMilisegundos <= 0) {
            //console.log("El tiempo ya terminó.");
            //return;
        }

        // Actualizar el temporizador cada segundo
        setInterval(() => {
            const ahora = new Date().getTime() // Tiempo actual en ms
            const tiempoRestante = fin - ahora // Tiempo restante en ms

            if (tiempoRestante <= 0) {
                console.log('¡Tiempo finalizado!')
                this.tiempoEnMilisegundos = 0
                return
            }

            this.tiempoEnMilisegundos = new Date(tiempoRestante)
                .toISOString()
                .substr(11, 8)
        }, 1000)
    }
    // { // Calcula el número de minutos restantes dividiendo el tiempo restante por 60 y redondeando hacia abajo
    getFormattedTime(): string {
        const minutes = Math.floor(this.timeRemaining / 60)
        const seconds = this.timeRemaining % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    //  mostrado la rubrica en vista estudiante
    dialogRubricaInfo = {
        visible: false,
        header: undefined,
    }

    showRubrica(data) {
        this.dialogRubricaInfo.visible = true
        this.dialogRubricaInfo.header = data
    }
    // Ejemplo de datos

    convertirATiempo(tiempoEnMinutos: number): string {
        const horas = Math.floor(tiempoEnMinutos / 60)
        const minutos = tiempoEnMinutos % 60
        return `${horas} horas ${minutos} minutos`
    }
}
