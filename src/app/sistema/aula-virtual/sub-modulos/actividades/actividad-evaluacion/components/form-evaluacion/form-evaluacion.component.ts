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
import { DialogService } from 'primeng/dynamicdialog'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ListPreguntasComponent } from '../list-preguntas/list-preguntas.component'
import { EVALUACION } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { MessageService } from 'primeng/api'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'

@Component({
    selector: 'app-form-evaluacion',
    standalone: true,
    imports: [
        PrimengModule,
        NgIf,
        TypesFilesUploadPrimengComponent,
        ListPreguntasComponent,
    ],
    templateUrl: './form-evaluacion.component.html',
    styleUrl: './form-evaluacion.component.scss',
})
export class FormEvaluacionComponent implements OnChanges {
    private _FormBuilder = inject(FormBuilder)
    private _evaluacionService = inject(ApiEvaluacionesService)
    private _ConstantesService = inject(ConstantesService)
    private _ConfirmationModalService = inject(ConfirmationModalService)
    private _DialogService = inject(DialogService)
    private _store = inject(LocalStoreService)
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

    iEvaluacionId: string

    showMostrarVista: 'FORM-EVALUACION' | 'LIST-PREGUNTAS' | 'FORM-PREGUNTAS' =
        'FORM-EVALUACION'
    titulo: string

    formEvaluacion = this._FormBuilder.group({
        opcion: [''],
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
        dtEvaluacionInicio: ['', Validators.required],
        dtEvaluacionFin: ['', Validators.required],
        iEvaluacionDuracionHoras: [],
        iEvaluacionDuracionMinutos: [],
        cEvaluacionArchivoAdjunto: [],

        dtInicio: [this.date],
        dtFin: [
            new Date(
                this.ajustarAHorarioDeMediaHora(new Date()).setHours(
                    this.date.getHours() + 1
                )
            ),
            Validators.required,
        ],

        dFechaEvaluacionPublicacion: [],
        dFechaEvaluacionInico: [this.date],
        dFechaEvaluacionFin: [this.date],
        tHoraEvaluacionPublicacion: [],
        tHoraEvaluacionInico: [],
        tHoraEvaluacionFin: [],

        // fechaInicio: [],
        // fechaFin: [],

        //TABLA: PROGRACION_ACTIVIDADES
        iProgActId: [],
        iContenidoSemId: [],
        iActTipoId: [EVALUACION],
        dtProgActInicio: [],
        dtProgActFin: [],
        cProgActTituloLeccion: [''],
        cProgActDescripcion: [''],
        dtProgActPublicacion: [],
    })

    ngOnChanges(changes) {
        if (changes.showModalEvaluacion?.currentValue) {
            this.showModalEvaluacion = changes.showModalEvaluacion.currentValue
            this.obtenerTipoEvaluaciones()
        }

        if (changes.semanaEvaluacion?.currentValue) {
            this.semanaEvaluacion = changes.semanaEvaluacion.currentValue
        }
        if (changes.curso?.currentValue) {
            this.curso = changes.curso.currentValue
        }

        if (changes.dataActividad?.currentValue) {
            this.dataActividad = changes.dataActividad.currentValue
            this.dataActividad?.ixActivadadId ? this.obtenerEvaluacion() : null
        }

        switch (this.showMostrarVista) {
            case 'FORM-EVALUACION':
                this.titulo =
                    this.tituloEvaluacion +
                    ' EVALUACIÓN: ' +
                    this.curso?.cCursoNombre
                break
        }
    }
    obtenerTipoEvaluaciones() {
        this._evaluacionService.obtenerTipoEvaluaciones().subscribe((data) => {
            this.tipoEvaluaciones = data
        })
    }
    obtenerEvaluacion() {
        this._ApiAulaService
            .obtenerActividad({
                iActTipoId: EVALUACION,
                ixActivadadId: this.dataActividad?.ixActivadadId,
            })
            .subscribe({
                next: (data) => {
                    this.formEvaluacion.patchValue(data)
                    //console.log(typeof this.formEvaluacion.value.cEvaluacionArchivoAdjunto)
                    this.filesUrl =
                        this.formEvaluacion.value.cEvaluacionArchivoAdjunto
                    // this.filesUrl = this.formEvaluacion.value.cEvaluacionArchivoAdjunto.length>0
                    //     ? JSON.parse(this.formEvaluacion.value.cEvaluacionArchivoAdjunto)
                    //     : []
                    this.formEvaluacion.controls.dtFin.setValue(
                        new Date(this.formEvaluacion.value.dtEvaluacionFin)
                    )
                    this.formEvaluacion.controls.dtInicio.setValue(
                        new Date(this.formEvaluacion.value.dtEvaluacionInicio)
                    )
                },
            })
    }

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'close-modal':
                this.showMostrarVista = 'FORM-EVALUACION'
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
            case 'GUARDAR':
            case 'ACTUALIZAR':
                this.guardarActualizarFormInfo()
                break
            case 'GUARDARxProgActxiEvaluacionId':
            case 'ACTUALIZARxProgActxiEvaluacionId':
                this.iEvaluacionId = item.length
                    ? item[0]['iEvaluacionId']
                    : null
                this.openModalListPreguntas()
                break
        }
    }

    private guardarActualizarFormInfo() {
        this.formEvaluacion.controls.dFechaEvaluacionInico.setValue(
            this.formEvaluacion.value.dtInicio
        )
        this.formEvaluacion.controls.dFechaEvaluacionFin.setValue(
            this.formEvaluacion.value.dtFin
        )

        const data = this.formEvaluacion.getRawValue()
        data.iDocenteId = this._ConstantesService.iDocenteId
        data.iActTipoId = EVALUACION
        data.iContenidoSemId = this.semanaEvaluacion.iContenidoSemId

        let horaInicio: any = data.dFechaEvaluacionInico.toLocaleString(
            'en-GB',
            {
                timeZone: 'America/Lima',
            }
        )
        let horaFin: any = data.dFechaEvaluacionFin.toLocaleString('en-GB', {
            timeZone: 'America/Lima',
        })
        horaInicio = horaInicio.split(',')
        horaFin = horaFin.split(',')

        this.formEvaluacion.controls['dFechaEvaluacionPublicacion'].setValue(
            horaInicio[0]
        )
        this.formEvaluacion.controls['tHoraEvaluacionPublicacion'].setValue(
            horaInicio[1].replace(' ', '')
        )
        this.formEvaluacion.controls['dFechaEvaluacionInico'].setValue(
            horaInicio[0]
        )
        this.formEvaluacion.controls['tHoraEvaluacionInico'].setValue(
            horaInicio[1].replace(' ', '')
        )
        this.formEvaluacion.controls['dFechaEvaluacionFin'].setValue(horaFin[0])
        this.formEvaluacion.controls['tHoraEvaluacionFin'].setValue(
            horaFin[1].replace(' ', '')
        )

        data.dFechaEvaluacionPublicacion = horaInicio[0]
        data.tHoraEvaluacionPublicacion = horaInicio[1].replace(' ', '')

        data.dFechaEvaluacionInico = horaInicio[0]
        data.tHoraEvaluacionInico = horaInicio[1].replace(' ', '')

        data.dFechaEvaluacionFin = horaFin[0]
        data.tHoraEvaluacionFin = horaFin[1].replace(' ', '')

        if (
            data.dFechaEvaluacionPublicacion &&
            data.tHoraEvaluacionPublicacion
        ) {
            data.dtEvaluacionPublicacion =
                data.dFechaEvaluacionPublicacion +
                ' ' +
                data.tHoraEvaluacionPublicacion
        }
        if (data.dFechaEvaluacionInico && data.tHoraEvaluacionInico) {
            data.dtEvaluacionInicio =
                data.dFechaEvaluacionInico + ' ' + data.tHoraEvaluacionInico
            this.formEvaluacion.controls.dtEvaluacionInicio.setValue(
                data.dtEvaluacionInicio
            )
        }

        if (data.dFechaEvaluacionFin && data.tHoraEvaluacionFin) {
            data.dtEvaluacionFin =
                data.dFechaEvaluacionFin + ' ' + data.tHoraEvaluacionFin
            this.formEvaluacion.controls.dtEvaluacionFin.setValue(
                data.dtEvaluacionFin
            )
        }

        //PROGRAMACIÓN ACTIVIDADES
        data.dtProgActInicio = data.dtEvaluacionInicio
        data.dtProgActFin = data.dtEvaluacionFin
        data.cProgActTituloLeccion = data.cEvaluacionTitulo
        data.dtProgActPublicacion = data.dtEvaluacionPublicacion

        if (this.formEvaluacion.invalid) {
            this.formEvaluacion.markAllAsTouched()
            return
        }

        data.cEvaluacionArchivoAdjunto = JSON.stringify(this.filesUrl)

        if (this.opcionEvaluacion === 'GUARDAR') {
            data.opcion = 'GUARDARxProgActxiEvaluacionId'
        } else {
            data.opcion = 'ACTUALIZARxProgActxiEvaluacionId'
        }

        const params = {
            petition: 'post',
            group: 'aula-virtual',
            prefix: 'programacion-actividades',
            ruta: 'store',
            data: data,
            params: { skipSuccessMessage: true },
        }

        this.getInformation(params, data.opcion)
    }
    openModalListPreguntas() {
        const accion =
            this.opcionEvaluacion === 'GUARDAR' ? 'agregar' : 'actualizar'
        this._ConfirmationModalService.openConfirm({
            header: '¿Deseas ' + accion + ' preguntas?',
            accept: () => {
                this.showMostrarVista = 'LIST-PREGUNTAS'
                this.titulo =
                    this.opcionEvaluacion +
                    ' PREGUNTAS PARA: ' +
                    this.curso?.cCursoNombre
            },
            reject: () => {
                this.accionBtn({ accion: 'close-modal', item: [] })
            },
        })
    }

    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtn({ accion, item: response?.data })
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }

    ajustarAHorarioDeMediaHora(fecha) {
        const minutos = fecha.getMinutes() // Obtener los minutos actuales
        const minutosAjustados = minutos <= 30 ? 30 : 0 // Decidir si ajustar a 30 o 0 (hora siguiente)
        if (minutos > 30) {
            fecha.setHours(fecha.getHours() + 1) // Incrementar la hora si los minutos pasan de 30
        }
        fecha.setMinutes(minutosAjustados) // Ajustar los minutos
        fecha.setSeconds(0) // Opcional: Resetear los segundos a 0
        fecha.setMilliseconds(0) // Opcional: Resetear los milisegundos a 0
        return fecha
    }
}
