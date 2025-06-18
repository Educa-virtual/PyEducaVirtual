import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { NgIf } from '@angular/common'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { ListPreguntasComponent } from '../list-preguntas/list-preguntas.component'
import { EVALUACION } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { MessageService } from 'primeng/api'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'

/**
 * @Component Decorator que define la metadata del componente `FormEvaluacionComponent`.
 * Este componente representa un formulario de evaluación que permite la carga de archivos,
 * la selección de preguntas, y otras funcionalidades relacionadas.
 */
@Component({
    // Selector del componente para usarlo en plantillas HTML.
    selector: 'app-form-evaluacion',
    standalone: true,
    // Módulos e importaciones que utiliza este componente.
    imports: [
        PrimengModule,
        NgIf,
        TypesFilesUploadPrimengComponent,
        ListPreguntasComponent,
    ],
    templateUrl: './form-evaluacion.component.html',
    styleUrl: './form-evaluacion.component.scss',
})

/**
 * @class FormEvaluacionComponent
 * Componente para gestionar el formulario de evaluaciones.
 * Incluye funcionalidad para manejar evaluaciones, cursos y archivos relacionados.
 */
export class FormEvaluacionComponent implements OnChanges {
    private _FormBuilder = inject(FormBuilder)
    private _evaluacionService = inject(ApiEvaluacionesService)
    private _ConstantesService = inject(ConstantesService)
    private _ConfirmationModalService = inject(ConfirmationModalService)
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private _ApiAulaService = inject(ApiAulaService)

    @Output() accionBtnItem = new EventEmitter()
    @Input() showModalEvaluacion: boolean = false
    @Input() tituloEvaluacion: string
    @Input() opcionEvaluacion: string
    @Input() semana
    @Input() idDocCursoId
    @Input() semanaEvaluacion
    @Input() curso
    @Input() dataActividad

    date = this.ajustarAHorarioDeMediaHora(new Date())
    cursos = []
    tipoEvaluaciones = []
    filesUrl = []
    typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: false,
    }
    titulo: string
    iEvaluacionId: string | number
    formEvaluacion = this._FormBuilder.group({
        iEvaluacionId: [],
        iTipoEvalId: [1],
        iInstrumentoId: [],
        iEscalaCalifId: [],
        iDocenteId: [0, Validators.required],
        dtEvaluacionPublicacion: [],
        cEvaluacionTitulo: ['', Validators.required],
        cEvaluacionDescripcion: ['', Validators.required],
        cEvaluacionObjetivo: [],
        nEvaluacionPuntaje: [],
        iEvaluacionNroPreguntas: [],
        dtEvaluacionInicio: [this.date, Validators.required],
        dtEvaluacionFin: [this.date, Validators.required],
        iEvaluacionDuracionHoras: [],
        iEvaluacionDuracionMinutos: [],
        iEvaluacionIdPadre: [],
        cEvaluacionArchivoAdjunto: [],
        iContenidoSemId: [null, Validators.required],
        iActTipoId: [EVALUACION, Validators.required],
        idDocCursoId: [null, Validators.required],
    })

    ngOnChanges(changes) {
        // Si el valor de 'showModalEvaluacion' cambia, se actualiza y se obtiene el tipo de evaluaciones
        if (changes.showModalEvaluacion?.currentValue) {
            this.showModalEvaluacion = changes.showModalEvaluacion.currentValue
        }

        if (changes.semanaEvaluacion?.currentValue) {
            this.semanaEvaluacion = changes.semanaEvaluacion.currentValue
        }
        if (changes.curso?.currentValue) {
            this.curso = changes.curso.currentValue
        }

        if (changes.dataActividad?.currentValue) {
            this.dataActividad = changes.dataActividad.currentValue
            if (this.dataActividad?.ixActivadadId) {
                this.iEvaluacionId = this.dataActividad.ixActivadadId
                this.obtenerEvaluacion(this.dataActividad.ixActivadadId)
            }
        }
    }

    obtenerEvaluacion(iEvaluacionId: string | number) {
        console.log(iEvaluacionId)
        // this._ApiAulaService
        //     .obtenerActividad({
        //         iActTipoId: EVALUACION,
        //         ixActivadadId: this.dataActividad?.ixActivadadId,
        //     })
        //     .subscribe({
        //         next: (data) => {
        //             if (Array.isArray(data) && data.length > 0) {
        //                 this.formEvaluacion.patchValue(data[0])
        //             } else {
        //                 console.warn(
        //                     ' No se encontraron datos para asignar al formulario.'
        //                 )
        //             }
        //             //console.log(typeof this.formEvaluacion.value.cEvaluacionArchivoAdjunto)
        //             this.filesUrl =
        //                 this.formEvaluacion.value.cEvaluacionArchivoAdjunto
        //             // this.filesUrl = this.formEvaluacion.value.cEvaluacionArchivoAdjunto.length>0
        //             //     ? JSON.parse(this.formEvaluacion.value.cEvaluacionArchivoAdjunto)
        //             //     : []
        //             this.formEvaluacion.controls.dtFin.setValue(
        //                 new Date(this.formEvaluacion.value.dtEvaluacionFin)
        //             )
        //             this.formEvaluacion.controls.dtInicio.setValue(
        //                 new Date(this.formEvaluacion.value.dtEvaluacionInicio)
        //             )
        //         },
        //     })
    }

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
            case 'subir-file-evaluacion':
                this.filesUrl.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
            case 'url-evaluacion':
                this.filesUrl.push({
                    type: 2, //2->url
                    nameType: 'url',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
            case 'youtube-evaluacion':
                this.filesUrl.push({
                    type: 3, //3->youtube
                    nameType: 'youtube',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
        }
    }

    guardarActualizarFormInfo() {
        if (this.formEvaluacion.invalid) {
            this.formEvaluacion.markAllAsTouched()

            const camposInvalidos = []
            const controles = this.formEvaluacion.controls

            const nombresCampos: Record<string, string> = {
                iDocenteId: 'Docente',
                cEvaluacionTitulo: 'Título de la evaluación',
                cEvaluacionDescripcion: 'Descripción',
                dtEvaluacionInicio: 'Fecha de inicio',
                dtEvaluacionFin: 'Fecha de fin',
                iContenidoSemId: 'Semana de contenido',
                iActTipoId: 'Tipo de actividad',
                idDocCursoId: 'Curso',
            }

            for (const nombreCampo in controles) {
                const control = controles[nombreCampo]
                if (control.invalid && nombresCampos[nombreCampo]) {
                    camposInvalidos.push(nombresCampos[nombreCampo])
                }
            }

            if (camposInvalidos.length) {
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Formulario incompleto',
                    detail: `Faltan completar los siguientes campos: ${camposInvalidos.join(', ')}.`,
                })
            }

            return // salir si es inválido
        }
        console.log(this.formEvaluacion.value)
        console.log(this.formEvaluacion)
        console.log(this.filesUrl)
        // this.formEvaluacion.controls.dFechaEvaluacionInico.setValue(
        //     this.formEvaluacion.value.dtInicio
        // )
        // this.formEvaluacion.controls.dFechaEvaluacionFin.setValue(
        //     this.formEvaluacion.value.dtFin
        // )
        // const data = this.formEvaluacion.getRawValue()
        // data.iDocenteId = this._ConstantesService.iDocenteId
        // data.iActTipoId = EVALUACION
        // data.iContenidoSemId = this.semanaEvaluacion.iContenidoSemId
        // let horaInicio: any = data.dFechaEvaluacionInico.toLocaleString(
        //     'en-GB',
        //     {
        //         timeZone: 'America/Lima',
        //     }
        // )
        // let horaFin: any = data.dFechaEvaluacionFin.toLocaleString('en-GB', {
        //     timeZone: 'America/Lima',
        // })
        // horaInicio = horaInicio.split(',')
        // horaFin = horaFin.split(',')
        // this.formEvaluacion.controls['dFechaEvaluacionPublicacion'].setValue(
        //     horaInicio[0]
        // )
        // this.formEvaluacion.controls['tHoraEvaluacionPublicacion'].setValue(
        //     horaInicio[1].replace(' ', '')
        // )
        // this.formEvaluacion.controls['dFechaEvaluacionInico'].setValue(
        //     horaInicio[0]
        // )
        // this.formEvaluacion.controls['tHoraEvaluacionInico'].setValue(
        //     horaInicio[1].replace(' ', '')
        // )
        // this.formEvaluacion.controls['dFechaEvaluacionFin'].setValue(horaFin[0])
        // this.formEvaluacion.controls['tHoraEvaluacionFin'].setValue(
        //     horaFin[1].replace(' ', '')
        // )
        // data.dFechaEvaluacionPublicacion = horaInicio[0]
        // data.tHoraEvaluacionPublicacion = horaInicio[1].replace(' ', '')
        // data.dFechaEvaluacionInico = horaInicio[0]
        // data.tHoraEvaluacionInico = horaInicio[1].replace(' ', '')
        // data.dFechaEvaluacionFin = horaFin[0]
        // data.tHoraEvaluacionFin = horaFin[1].replace(' ', '')
        // if (
        //     data.dFechaEvaluacionPublicacion &&
        //     data.tHoraEvaluacionPublicacion
        // ) {
        //     data.dtEvaluacionPublicacion =
        //         data.dFechaEvaluacionPublicacion +
        //         ' ' +
        //         data.tHoraEvaluacionPublicacion
        // }
        // if (data.dFechaEvaluacionInico && data.tHoraEvaluacionInico) {
        //     data.dtEvaluacionInicio =
        //         data.dFechaEvaluacionInico + ' ' + data.tHoraEvaluacionInico
        //     this.formEvaluacion.controls.dtEvaluacionInicio.setValue(
        //         data.dtEvaluacionInicio
        //     )
        // }
        // if (data.dFechaEvaluacionFin && data.tHoraEvaluacionFin) {
        //     data.dtEvaluacionFin =
        //         data.dFechaEvaluacionFin + ' ' + data.tHoraEvaluacionFin
        //     this.formEvaluacion.controls.dtEvaluacionFin.setValue(
        //         data.dtEvaluacionFin
        //     )
        // }
        // //PROGRAMACIÓN ACTIVIDADES
        // data.dtProgActInicio = data.dtEvaluacionInicio
        // data.dtProgActFin = data.dtEvaluacionFin
        // data.cProgActTituloLeccion = data.cEvaluacionTitulo
        // data.dtProgActPublicacion = data.dtEvaluacionPublicacion
        // if (this.formEvaluacion.invalid) {
        //     this.formEvaluacion.markAllAsTouched()
        //     return
        // }
        // data.cEvaluacionArchivoAdjunto = JSON.stringify(this.filesUrl)
        // if (this.opcionEvaluacion === 'GUARDAR') {
        //     data.opcion = 'GUARDARxProgActxiEvaluacionId'
        // } else {
        //     data.opcion = 'ACTUALIZARxProgActxiEvaluacionId'
        // }
        // const params = {
        //     petition: 'post',
        //     group: 'aula-virtual',
        //     prefix: 'programacion-actividades',
        //     ruta: 'store',
        //     data: data,
        //     params: { skipSuccessMessage: true },
        // }
        // this.getInformation(params, data.opcion)
    }

    ajustarAHorarioDeMediaHora(fecha) {
        const minutos = fecha.getMinutes() // Obtener los minutos actuales
        const minutosAjustados = minutos <= 30 ? 30 : 0 // Decidir si ajustar a 30 o 0 (hora siguiente)
        if (minutos > 30) {
            fecha.setHours(fecha.getHours() + 1) // Incrementar la hora si los minutos pasan de 30
        }
        fecha.setMinutes(minutosAjustados)
        fecha.setSeconds(0)
        fecha.setMilliseconds(0)
        return fecha
    }
}
