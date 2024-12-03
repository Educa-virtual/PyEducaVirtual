import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { NgIf } from '@angular/common'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'

@Component({
    selector: 'app-form-evaluacion',
    standalone: true,
    imports: [
        PrimengModule,
        ModalPrimengComponent,
        NgIf,
        TypesFilesUploadPrimengComponent,
    ],
    templateUrl: './form-evaluacion.component.html',
    styleUrl: './form-evaluacion.component.scss',
})
export class FormEvaluacionComponent implements OnChanges, OnInit {
    private _FormBuilder = inject(FormBuilder)
    private _evaluacionService = inject(ApiEvaluacionesService)
    private _ConstantesService = inject(ConstantesService)
    private _ConfirmationModalService = inject(ConfirmationModalService)

    @Output() accionBtnItem = new EventEmitter()
    @Input() showModalEvaluacion: boolean = false
    @Input() tituloEvaluacion: string
    @Input() opcionEvaluacion: string
    @Input() semana

    date = new Date()

    tipoEvaluaciones = []
    filesUrl = []
    typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: false,
    }
    formEvaluacion = this._FormBuilder.group({
        iEvaluacionId: [],
        iTipoEvalId: [],
        iProgActId: [],
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

        iActTipoId: [],
        iContenidoSemId: [],

        dtInicio: [this.date, Validators.required],
        dtFin: [this.date, Validators.required],

        dFechaEvaluacionPublicacion: [],
        dFechaEvaluacionInico: [],
        dFechaEvaluacionFin: [],
        tHoraEvaluacionPublicacion: [],
        tHoraEvaluacionInico: [],
        tHoraEvaluacionFin: [],
    })

    ngOnInit() {
        this.obtenerTipoEvaluaciones()
    }
    ngOnChanges(changes) {
        if (changes.showModalEvaluacion?.currentValue) {
            this.showModalEvaluacion = changes.showModalEvaluacion.currentValue
        }
        if (changes.semana?.currentValue) {
            this.semana = changes.semana.currentValue
        }
    }
    obtenerTipoEvaluaciones() {
        this._evaluacionService.obtenerTipoEvaluaciones().subscribe((data) => {
            this.tipoEvaluaciones = data
        })
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
            case 'GUARDAR':
                this.guardarActualizarFormInfo()
                break
        }
    }

    private guardarActualizarFormInfo() {
        this.guardarPreguntas()
        //   const data = this.formEvaluacion.getRawValue()
        //   data.iDocenteId = this._ConstantesService.iDocenteId
        //   data.iActTipoId = EVALUACION
        //   data.iContenidoSemId = this.semana.iContenidoSemId
        //   data.cEvaluacionArchivoAdjunto = JSON.stringify(this.filesUrl)

        //   let horaInicio = data.dFechaEvaluacionInico.toLocaleString('en-GB', {
        //     timeZone: 'America/Lima',
        // })
        // let horaFin = data.dFechaEvaluacionFin.toLocaleString('en-GB', {
        //     timeZone: 'America/Lima',
        // })
        // horaInicio = horaInicio.split(',')
        // horaFin = horaFin.split(',')

        // this.formEvaluacion.controls[
        //     'dFechaEvaluacionPublicacion'
        // ].setValue(horaInicio[0])
        // this.formEvaluacion.controls['tHoraEvaluacionPublicacion'].setValue(
        //     horaInicio[1].replace(' ', '')
        // )
        // this.formEvaluacion.controls['dFechaEvaluacionInico'].setValue(
        //     horaInicio[0]
        // )
        // this.formEvaluacion.controls['tHoraEvaluacionInico'].setValue(
        //     horaInicio[1].replace(' ', '')
        // )
        // this.formEvaluacion.controls['dFechaEvaluacionFin'].setValue(
        //     horaFin[0]
        // )
        // this.formEvaluacion.controls['tHoraEvaluacionFin'].setValue(
        //     horaFin[1].replace(' ', '')
        // )

        // data.dFechaEvaluacionPublicacion = horaInicio[0]
        // data.tHoraEvaluacionPublicacion = horaInicio[1].replace(' ', '')

        // data.dFechaEvaluacionInico = horaInicio[0]
        // data.tHoraEvaluacionInico = horaInicio[1].replace(' ', '')

        // data.dFechaEvaluacionFin = horaFin[0]
        // data.tHoraEvaluacionFin = horaFin[1].replace(' ', '')

        //   if (this.formEvaluacion.invalid) {
        //     this.formEvaluacion.markAllAsTouched()
        //     return
        //   }

        //   this._evaluacionService
        //     .guardarActualizarEvaluacion(data)
        //     .subscribe({
        //       next: (data) => {
        //         this.formEvaluacion.patchValue({
        //           iProgActId: data.iProgActId,
        //           iEvaluacionId: data.iEvaluacionId,
        //         })

        //       },
        //     })
        //
    }
    guardarPreguntas() {
        this._ConfirmationModalService.openConfirm({
            header: '¿Deseas agregar preguntas?',
            accept: () => {
                this.accionBtn({ accion: 'agregar-preguntas', item: [] })
            },
        })
    }
}
