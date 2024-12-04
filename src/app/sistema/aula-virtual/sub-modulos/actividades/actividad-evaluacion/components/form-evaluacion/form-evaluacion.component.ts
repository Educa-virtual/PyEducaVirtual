import { PrimengModule } from '@/app/primeng.module'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
import { RubricaFormComponent } from '@/app/sistema/aula-virtual/features/rubricas/components/rubrica-form/rubrica-form.component'
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
import { DialogService } from 'primeng/dynamicdialog'
import { RubricasComponent } from '../../../../../features/rubricas/rubricas.component'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { GeneralService } from '@/app/servicios/general.service'
import { ListPreguntasComponent } from '../list-preguntas/list-preguntas.component'

@Component({
    selector: 'app-form-evaluacion',
    standalone: true,
    imports: [
        PrimengModule,
        ModalPrimengComponent,
        NgIf,
        TypesFilesUploadPrimengComponent,
        RubricasComponent,
        ListPreguntasComponent,
    ],
    templateUrl: './form-evaluacion.component.html',
    styleUrl: './form-evaluacion.component.scss',
})
export class FormEvaluacionComponent implements OnChanges, OnInit {
    private _FormBuilder = inject(FormBuilder)
    private _evaluacionService = inject(ApiEvaluacionesService)
    private _ConstantesService = inject(ConstantesService)
    private _ConfirmationModalService = inject(ConfirmationModalService)
    private _DialogService = inject(DialogService)
    private _store = inject(LocalStoreService)
    private _GeneralService = inject(GeneralService)

    @Output() accionBtnItem = new EventEmitter()
    @Input() showModalEvaluacion: boolean = false
    @Input() tituloEvaluacion: string
    @Input() opcionEvaluacion: string
    @Input() semana
    @Input() idDocCursoId

    date = new Date()
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
    params = {
        iCursoId: 0,
        iDocenteId: 0,
        idDocCursoId: 0,
    }
    showMostrarVista: 'FORM-EVALUACION' | 'LIST-PREGUNTAS' | 'FORM-PREGUNTAS' =
        'FORM-EVALUACION'
    showModalListPreguntas: boolean = false
    opcionModalPreguntas: string
    tituloModalPreguntas: string
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
        this.obtenerRubricas()
        this.obtenerCursos()
    }
    ngOnChanges(changes) {
        if (changes.showModalEvaluacion?.currentValue) {
            this.showModalEvaluacion = changes.showModalEvaluacion.currentValue
        }
        if (changes.semana?.currentValue) {
            this.semana = changes.semana.currentValue
            this.params.iCursoId = this.semana.iCursoId
            this.params.iDocenteId = this._ConstantesService.iDocenteId
            const curso = this.cursos.find(
                (i) => i.iCursoId === this.semana.iCursoId
            )
            this.params.idDocCursoId = curso.idDocCursoId
        }
    }
    obtenerTipoEvaluaciones() {
        this._evaluacionService.obtenerTipoEvaluaciones().subscribe((data) => {
            this.tipoEvaluaciones = data
        })
    }
    rubricas = [
        {
            iInstrumentoId: 0,
            cInstrumentoNombre: 'Sin instrumento de evaluación',
        },
    ]

    obtenerRubricas() {
        const params = {
            iDocenteId: this._ConstantesService.iDocenteId,
        }
        this._evaluacionService.obtenerRubricas(params).subscribe({
            next: (data) => {
                data.forEach((element) => {
                    this.rubricas.push(element)
                })
            },
        })
    }

    agregarRubrica() {
        const header = 'Crear rúbrica'
        const ref = this._DialogService.open(RubricaFormComponent, {
            ...MODAL_CONFIG,
            header,
            data: {},
        })
        ref.onClose.pipe().subscribe(() => {
            this.obtenerRubricas()
        })
    }

    obtenerCursos() {
        const year = this._store.getItem('dremoYear')
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'docente-cursos',
            ruta: 'list', //'getDocentesCursos',
            data: {
                opcion: 'CONSULTARxiPersIdxiYearId',
                iCredId: this._ConstantesService.iCredId,
                valorBusqueda: year, //iYearId
                iSemAcadId: null,
                iIieeId: null,
            },
            params: { skipSuccessMessage: true },
        }
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.cursos = response.data
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }

    accionRubrica(elemento): void {
        if (!elemento) return
        this.obtenerRubricas()
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
                this.showMostrarVista = 'LIST-PREGUNTAS'
                this.showModalListPreguntas = true
                this.opcionModalPreguntas = 'GUARDAR'
                this.tituloModalPreguntas = 'AGREGAR PREGUNTAS'
                // this.accionBtn({ accion: 'agregar-preguntas', item: [] })
            },
        })
    }
}
