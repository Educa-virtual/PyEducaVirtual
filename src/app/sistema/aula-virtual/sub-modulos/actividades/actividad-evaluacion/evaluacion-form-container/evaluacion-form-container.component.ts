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
import { StepperModule } from 'primeng/stepper'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MenuItem } from 'primeng/api'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { Subject, takeUntil } from 'rxjs'
import dayjs from 'dayjs'
import { EVALUACION } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { convertStringToDate } from '@/app/sistema/aula-virtual/utils/date'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-evaluacion-form-container-',
    standalone: true,
    imports: [
        CommonModule,
        PrimengModule,
        EvaluacionFormInfoComponent,
        EvaluacionFormPreguntasComponent,
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
    public rubricaSelected = null
    public files = []
    public evaluacionFormPasos: MenuItem[] = [
        {
            id: '0',
            label: 'Información',
            icon: 'pi-info',
        },
        // {
        //     id: '1',
        //     label: 'Calificación',
        //     icon: 'pi-list-check',
        // },
        {
            id: '1',
            label: 'Preguntas',
            icon: 'pi-list-check',
        },
    ]
    public tipoEvaluaciones = []
    public mode: 'CREAR' | 'EDITAR' = 'CREAR'

    private unsubscribe$: Subject<boolean> = new Subject()

    // injeccion de dependencias
    private _constantesService = inject(ConstantesService)
    private _formBuilder = inject(FormBuilder)
    private _evaluacionService = inject(ApiEvaluacionesService)
    private _aulaVirtualService = inject(ApiAulaService)
    private _config = inject(DynamicDialogConfig)
    private _confirmDialogService = inject(ConfirmationModalService)
    private _ref = inject(DynamicDialogRef)

    public preguntasSeleccionadas = []
    public paramsData = {
        iCursoId: null,
        iContenidoSemId: null,
        ixActivadadId: null,
        idDocCursoId: null,
        iDocenteId: null,
    }

    constructor() {}

    ngOnInit(): void {
        this.getData()
        this.initFormGroup()
        this.paramsData.iContenidoSemId =
            this._config.data.semana.iContenidoSemId
        this.paramsData.iCursoId = this._config.data.semana.iCursoId
        this.paramsData.idDocCursoId = this._config.data.semana.idDocCursoId
        this.paramsData.iDocenteId = this._constantesService.iDocenteId
        if (!this.paramsData.iContenidoSemId) {
            throw new Error('Error el iContenidoSemId es requerido')
        }
        if (!this.paramsData.iCursoId) {
            throw new Error('Error el iCursoId es requerido')
        }
        if (!this.paramsData.idDocCursoId) {
            throw new Error('Error el iCursoId es requerido')
        }

        const actividad = this._config.data.actividad

        // si se esta editando
        if (actividad?.ixActivadadId != undefined) {
            this.mode = 'EDITAR'
            this.paramsData.iContenidoSemId = actividad.iContenidoSemId
            this.paramsData.ixActivadadId = actividad.ixActivadadId
            this.obtenerEvaluacion()
        }
    }

    getData() {
        this.obtenerTipoEvaluaciones()
    }

    obtenerEvaluacion() {
        this._aulaVirtualService
            .obtenerActividad({
                iActTipoId: EVALUACION,
                ixActivadadId: this.paramsData.ixActivadadId,
            })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.patchData(data)
                },
            })
    }

    patchData(data) {
        this.patchEvaluacionInfo(data)
        this.patchCalificacionForm(data)
        this.preguntasSeleccionadas = data.preguntas
    }

    patchCalificacionForm(data) {
        this.calificacionForm.patchValue({
            usaInstrumentoEvaluacion: data.iInstrumentoId == null ? 1 : 2,
        })
        const nuevaRubrica = { iInstrumentoId: data.iInstrumentoId }
        this.rubricaSelected = { ...nuevaRubrica }
    }

    // coloca los valores en el form
    patchEvaluacionInfo(data: any) {
        const files = data.cEvaluacionArchivoAdjunto ?? []
        this.files = [...files]
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
            iInstrumentoId: data.iInstrumentoId,
            cEvaluacionTitulo: data.cEvaluacionTitulo,
            cEvaluacionDescripcion: data.cEvaluacionDescripcion,
            dFechaEvaluacionPublicacion,
            tHoraEvaluacionPublicacion,
            dFechaEvaluacionInico,
            tHoraEvaluacionInico,
            dFechaEvaluacionFin,
            tHoraEvaluacionFin,
            cEvaluacionArchivoAdjunto: data.cEvaluacionArchivoAdjunto,
        })
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
            iEvaluacionId: [0],
            iTipoEvalId: [null, Validators.required],
            iInstrumentoId: [null],
            cEvaluacionDescripcion: [''],
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
    }

    // avanza los pasos del formulario
    goStep(opcion: string) {
        switch (opcion) {
            case 'next':
                if (this.activeStepper !== 1) {
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

    // guarda los cambios segun el paso del stepper
    public guardarCambios() {
        if (this.activeStepper === 0) {
            this.guardarActualizarFormInfo()
            return
        }

        if (this.activeStepper === 1) {
            this.guardarActualizarPreguntas()
        }

        // if (this.activeStepper === 1) {
        //     this.guardarActualizarCalificacion()
        // }
    }

    // agrega el tiempo a la fecha
    private addTimeToDate(date, time) {
        const dateActual = dayjs(date)
        const timeActual = dayjs(time, 'HH:mm:ss')
        const dateTime = dateActual
            .set('hour', timeActual.hour())
            .set('minute', timeActual.minute())
        return dateTime.format('YYYY-DD-MM HH:mm:ss')
    }

    // guarda o actualiza los datos del form1
    private guardarActualizarFormInfo() {
        const data = this.evaluacionInfoForm.getRawValue()
        data.iDocenteId = this._constantesService.iDocenteId
        data.iActTipoId = EVALUACION
        data.iContenidoSemId = this.paramsData.iContenidoSemId
        data.cEvaluacionArchivoAdjunto = JSON.stringify(this.files)

        let horaInicio = data.dFechaEvaluacionInico.toLocaleString('en-GB', {
            timeZone: 'America/Lima',
        })
        let horaFin = data.dFechaEvaluacionFin.toLocaleString('en-GB', {
            timeZone: 'America/Lima',
        })
        horaInicio = horaInicio.split(',')
        horaFin = horaFin.split(',')

        this.evaluacionInfoForm.controls[
            'dFechaEvaluacionPublicacion'
        ].setValue(horaInicio[0])
        this.evaluacionInfoForm.controls['tHoraEvaluacionPublicacion'].setValue(
            horaInicio[1].replace(' ', '')
        )
        this.evaluacionInfoForm.controls['dFechaEvaluacionInico'].setValue(
            horaInicio[0]
        )
        this.evaluacionInfoForm.controls['tHoraEvaluacionInico'].setValue(
            horaInicio[1].replace(' ', '')
        )
        this.evaluacionInfoForm.controls['dFechaEvaluacionFin'].setValue(
            horaFin[0]
        )
        this.evaluacionInfoForm.controls['tHoraEvaluacionFin'].setValue(
            horaFin[1].replace(' ', '')
        )

        data.dFechaEvaluacionPublicacion = horaInicio[0]
        data.tHoraEvaluacionPublicacion = horaInicio[1].replace(' ', '')

        data.dFechaEvaluacionInico = horaInicio[0]
        data.tHoraEvaluacionInico = horaInicio[1].replace(' ', '')

        data.dFechaEvaluacionFin = horaFin[0]
        data.tHoraEvaluacionFin = horaFin[1].replace(' ', '')

        if (this.evaluacionInfoForm.invalid) {
            this.evaluacionInfoForm.markAllAsTouched()
            return
        }

        if (
            data.dFechaEvaluacionPublicacion &&
            data.tHoraEvaluacionPublicacion
        ) {
            data.dtEvaluacionPublicacion =
                data.dFechaEvaluacionPublicacion +
                ' ' +
                data.tHoraEvaluacionPublicacion

            // this.addTimeToDate(
            //     data.dFechaEvaluacionPublicacion,
            //     data.tHoraEvaluacionPublicacion
            // )
        }
        if (data.dFechaEvaluacionInico && data.tHoraEvaluacionInico) {
            data.dtEvaluacionInicio =
                data.dFechaEvaluacionInico + ' ' + data.tHoraEvaluacionInico

            // this.addTimeToDate(
            //     data.dFechaEvaluacionInico,
            //     data.tHoraEvaluacionInico
            // )
        }

        if (data.dFechaEvaluacionFin && data.tHoraEvaluacionFin) {
            data.dtEvaluacionFin =
                data.dFechaEvaluacionFin + ' ' + data.tHoraEvaluacionFin

            // this.addTimeToDate(
            //     data.dFechaEvaluacionFin,
            //     data.tHoraEvaluacionFin
            // )
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

    // guarda o actualiza las preguntas
    private guardarActualizarPreguntas() {
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
                    this.closeModal(resp)
                },
            })
    }

    // guarda o actualiza el instrumento de calificación
    guardarActualizarCalificacion() {
        const data = this.calificacionForm.value
        if (this.calificacionForm.invalid) {
            this.calificacionForm.markAllAsTouched()
            return
        }
        if (
            data.usaInstrumentoEvaluacion === 2 &&
            this.rubricaSelected?.iInstrumentoId == null
        ) {
            this._confirmDialogService.openAlert({
                header: 'Debe seleccionar una rúbrica',
            })
            return
        }
        if (data.usaInstrumentoEvaluacion === 2) {
            this.evaluacionInfoForm
                .get('iInstrumentoId')
                .setValue(this.rubricaSelected.iInstrumentoId)
        } else {
            this.evaluacionInfoForm.get('iInstrumentoId').setValue(null)
        }
        this.guardarActualizarFormInfo()
    }

    public preguntasSeleccionadasChange(event) {
        this.preguntasSeleccionadas = event
    }

    closeModal(data) {
        this._ref.close(data)
    }

    // desusbcribe los observables cuando se destruye el componente
    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
