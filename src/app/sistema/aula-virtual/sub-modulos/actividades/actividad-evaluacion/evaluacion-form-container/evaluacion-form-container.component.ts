import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { Dialog } from 'primeng/dialog'
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog'
import { EvaluacionFormInfoComponent } from '../evaluacion-form/evaluacion-form-info/evaluacion-form-info.component'
import { EvaluacionFormPreguntasComponent } from '../evaluacion-form/evaluacion-form-preguntas/evaluacion-form-preguntas.component'
import { EvaluacionFormCalificacionComponent } from '../evaluacion-form/evaluacion-form-calificacion/evaluacion-form-calificacion.component'
import { StepperModule } from 'primeng/stepper'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MenuItem } from 'primeng/api'
import { ApiEvaluacionesService } from '@/app/sistema/evaluaciones/services/api-evaluaciones.service'
import { Subject, takeUntil } from 'rxjs'
import dayjs from 'dayjs'
import { EVALUACION } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { convertStringToDate } from '@/app/sistema/aula-virtual/utils/date'

@Component({
    selector: 'app-evaluacion-form-container-',
    standalone: true,
    imports: [
        CommonModule,
        PrimengModule,
        EvaluacionFormInfoComponent,
        EvaluacionFormPreguntasComponent,
        EvaluacionFormCalificacionComponent,
        StepperModule,
    ],
    templateUrl: './evaluacion-form-container.component.html',
    styleUrl: './evaluacion-form-container.component.scss',
    providers: [DialogService],
})
export class EvaluacionFormContainerComponent implements OnInit, OnDestroy {
    @ViewChild('dialogRef') dialogRef!: Dialog

    public evaluacionInfoForm: FormGroup
    public calificacionForm: FormGroup
    public activeStepper = 0
    public evaluacionFormPasos: MenuItem[] = [
        {
            id: '0',
            label: 'Información',
            icon: 'pi-info',
        },
        {
            id: '1',
            label: 'Preguntas',
            icon: 'pi-list-check',
        },
        {
            id: '2',
            label: 'Calificación',
            icon: 'pi-list-check',
        },
    ]
    public tipoEvaluaciones = []
    public mode: 'CREAR' | 'EDITAR' = 'CREAR'

    private unsubscribe$: Subject<boolean> = new Subject()
    private _formBuilder = inject(FormBuilder)
    private _evaluacionService = inject(ApiEvaluacionesService)
    private _aulaVirtualService = inject(ApiAulaService)
    private _config = inject(DynamicDialogConfig)
    private _ref = inject(DynamicDialogRef)
    public preguntasSeleccionadas = [
        // {
        //     iPreguntaId: 49,
        //     cPregunta: '<p>3</p>',
        //     iCursoId: 1,
        //     iDocenteId: 1,
        //     iTipoPregId: 1,
        //     iEncabPregId: -1,
        //     iPreguntaPeso: 3,
        //     cEncabPregTitulo: 'Sin Encabezado',
        //     cEncabPregContenido: 'Opcion Unica',
        //     alternativas: [
        //         {
        //             iAlternativaId: 58,
        //             cAlternativaDescripcion: '<p>333</p>',
        //             cAlternativaLetra: 'a',
        //             bAlternativaCorrecta: false,
        //             cAlternativaExplicacion: '',
        //         },
        //         {
        //             iAlternativaId: 59,
        //             cAlternativaDescripcion: '<p>33</p>',
        //             cAlternativaLetra: 'b',
        //             bAlternativaCorrecta: true,
        //             cAlternativaExplicacion: '',
        //         },
        //     ],
        //     iHoras: 0,
        //     iMinutos: 0,
        //     iSegundos: 0,
        //     cTipoPregDescripcion: 'Opcion Unica',
        //     time: '0h 0m 0s',
        //     alternativaCorrecta: 'b',
        // },
    ]
    private _paramsData = {
        iContenidoSemId: 0,
        iEvaluacionId: 0,
    }

    constructor() {}

    ngOnInit(): void {
        this.getData()
        this.initFormGroup()

        this._paramsData.iContenidoSemId =
            this._config.data.semana?.iContenidoSemId

        const actividad = this._config.data.actividad
        if (actividad !== null) {
            this.mode = 'EDITAR'
            this._paramsData.iContenidoSemId = actividad.iContenidoSemId
            this.obtenerEvaluacion()
        }
    }

    getData() {
        this.obtenerTipoEvaluaciones()
    }

    obtenerEvaluacion() {
        const ixActivadadId = this.evaluacionInfoForm.get('iEvaluacionId').value
        this._aulaVirtualService
            .obtenerActividad({
                iActTipoId: EVALUACION,
                ixActivadadId,
            })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data) => {
                    console.log(data)

                    this.patchData(data)
                },
            })
    }

    patchData(data) {
        this.patchEvaluacionInfo(data)
        this.preguntasSeleccionadas = data.preguntas
    }

    patchEvaluacionInfo(data: any) {
        const dFechaEvaluacionPublicacion = convertStringToDate(
            data.dtEvaluacionPublicacion
        )
        const tHoraEvaluacionPublicacion = convertStringToDate(
            data.dtEvaluacionPublicacion
        )
        const dFechaEvaluacionInico = convertStringToDate(
            data.dtEvaluacionInicio
        )
        const tHoraEvaluacionInico = convertStringToDate(
            data.dtEvaluacionInicio
        )
        const dFechaEvaluacionFin = convertStringToDate(data.dtEvaluacionFin)
        const tHoraEvaluacionFin = convertStringToDate(data.dtEvaluacionFin)

        this.evaluacionInfoForm.patchValue({
            iProgActId: data.iProgActId,
            iEvaluacionId: data.iEvaluacionId,
            iTipoEvalId: data.iTipoEvalId,
            cEvaluacionTitulo: data.cEvaluacionTitulo,
            cEvaluacionDescripcion: data.cEvaluacionDescripcion,
            dFechaEvaluacionPublicacion,
            tHoraEvaluacionPublicacion,
            dFechaEvaluacionInico,
            tHoraEvaluacionInico,
            dFechaEvaluacionFin,
            tHoraEvaluacionFin,
        })
        console.log(this.evaluacionInfoForm.value)
    }

    obtenerTipoEvaluaciones() {
        this._evaluacionService
            .obtenerTipoEvaluaciones()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                this.tipoEvaluaciones = data
            })
    }

    onDialogShow() {
        if (this.dialogRef) {
            this.dialogRef.maximize()
        }
    }

    initFormGroup() {
        this.evaluacionInfoForm = this._formBuilder.group({
            iProgActId: [0],
            iEvaluacionId: [17],
            iTipoEvalId: [null, Validators.required],
            cEvaluacionDescripcion: [null, Validators.required],
            cEvaluacionTitulo: [null, Validators.required],
            dFechaEvaluacionPublicacion: [null, Validators.required],
            tHoraEvaluacionPublicacion: [null, Validators.required],
            dFechaEvaluacionInico: [null],
            tHoraEvaluacionInico: [null],
            dFechaEvaluacionFin: [null],
            tHoraEvaluacionFin: [null],
        })

        this.calificacionForm = this._formBuilder.group({
            usaInstrumentoEvaluacion: [0, Validators.required],
        })

        this.calificacionForm = this._formBuilder.group({
            usaInstrumentoEvaluacion: [0, Validators.required],
        })
    }

    goStep(opcion: string) {
        switch (opcion) {
            case 'next':
                if (this.activeStepper !== 2) {
                    this.activeStepper++
                }
                break
            case 'back':
                if (this.activeStepper !== 0) {
                    this.activeStepper--
                }
                break
        }
    }

    get tituloEvulacion() {
        return this.evaluacionInfoForm.get('cEvaluacionTitulo')?.value
    }

    public guardarCambios() {
        if (this.activeStepper === 0) {
            this.guardarActualizarFormInfo()
            return
        }

        if (this.activeStepper === 1) {
            this.guardarActualizarPreguntas()
        }

        if (this.activeStepper === 2) {
            this.guardarActualizarCalificacion()
        }
    }

    private addTimeToDate(date, time) {
        const dateActual = dayjs(date)
        const timeActual = dayjs(time, 'HH:mm:ss')
        const dateTime = dateActual
            .set('hour', timeActual.hour())
            .set('minute', timeActual.minute())
        return dateTime.format('YYYY-DD-MM HH:mm:ss')
    }

    private guardarActualizarFormInfo() {
        const data = this.evaluacionInfoForm.getRawValue()
        data.iDocenteId = 1
        data.iActTipoId = EVALUACION
        data.iContenidoSemId = this._paramsData.iContenidoSemId

        if (this.evaluacionInfoForm.invalid) {
            this.evaluacionInfoForm.markAllAsTouched()
            return
        }

        if (
            data.dFechaEvaluacionPublicacion &&
            data.tHoraEvaluacionPublicacion
        ) {
            data.dtEvaluacionPublicacion = this.addTimeToDate(
                data.dFechaEvaluacionPublicacion,
                data.tHoraEvaluacionPublicacion
            )
        }
        if (data.dFechaEvaluacionInico && data.tHoraEvaluacionInico) {
            data.dtEvaluacionInicio = this.addTimeToDate(
                data.dFechaEvaluacionInico,
                data.tHoraEvaluacionInico
            )
        }

        if (data.dFechaEvaluacionFin && data.tHoraEvaluacionFin) {
            data.dtEvaluacionFin = this.addTimeToDate(
                data.dFechaEvaluacionFin,
                data.tHoraEvaluacionFin
            )
        }

        this._evaluacionService
            .guardarActualizarEvaluacion(data)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.evaluacionInfoForm.patchValue({
                        iProgActId: data.iProgActId,
                        iEvaluacionId: data.iEvaluacionId,
                    })
                    this.goStep('next')
                },
            })
    }

    private guardarActualizarPreguntas() {
        console.log(this.preguntasSeleccionadas)
        const preguntas = this.preguntasSeleccionadas.reduce((acc, item) => {
            if (item.preguntas == null) {
                acc.push(item)
            } else {
                acc.push(...item.preguntas)
            }
            return acc
        }, [])

        const data = {
            iEvaluacionId: this.evaluacionInfoForm.value.iEvaluacionId,
            preguntas,
        }

        this._evaluacionService
            .guardarActualizarPreguntasEvaluacion(data)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp) => {
                    this.preguntasSeleccionadas =
                        this.preguntasSeleccionadas.map((pregunta) => {
                            if (pregunta.preguntas == null) {
                                const preguntaResp = resp.find(
                                    (item) =>
                                        item.iEvalPregId == pregunta.iEvalPregId
                                )

                                pregunta.iEvalPregId = preguntaResp.newId
                                pregunta.isLocal = false
                            } else {
                                pregunta.preguntas = pregunta.preguntas.map(
                                    (item) => {
                                        const preguntaResp = resp.find(
                                            (item2) =>
                                                item2.iEvalPregId ==
                                                item.iEvalPregId
                                        )
                                        item.iEvalPregId = preguntaResp.newId
                                        item.isLocal = false
                                        return item
                                    }
                                )
                            }
                            return pregunta
                        })
                    console.log(this.preguntasSeleccionadas)

                    this.goStep('next')
                },
            })
    }

    guardarActualizarCalificacion() {
        const data = this.calificacionForm.value
        this.closeModal(data)
    }

    public preguntasSeleccionadasChange(event) {
        this.preguntasSeleccionadas = event
    }

    closeModal(data) {
        this._ref.close(data)
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
