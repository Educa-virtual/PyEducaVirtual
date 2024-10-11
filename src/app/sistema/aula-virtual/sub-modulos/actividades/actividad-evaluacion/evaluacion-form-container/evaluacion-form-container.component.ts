import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { Dialog } from 'primeng/dialog'
import { DialogService } from 'primeng/dynamicdialog'
import { EvaluacionFormInfoComponent } from '../evaluacion-form/evaluacion-form-info/evaluacion-form-info.component'
import { EvaluacionFormPreguntasComponent } from '../evaluacion-form/evaluacion-form-preguntas/evaluacion-form-preguntas.component'
import { EvaluacionFormCalificacionComponent } from '../evaluacion-form/evaluacion-form-calificacion/evaluacion-form-calificacion.component'
import { StepperModule } from 'primeng/stepper'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MenuItem } from 'primeng/api'
import { ApiEvaluacionesService } from '@/app/sistema/evaluaciones/services/api-evaluaciones.service'
import { Subject, takeUntil } from 'rxjs'
import dayjs from 'dayjs'

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

    private unsubscribe$: Subject<boolean> = new Subject()
    private _formBuilder = inject(FormBuilder)
    private _evaluacionService = inject(ApiEvaluacionesService)

    constructor() {}

    ngOnInit(): void {
        this.getData()
        this.initFormGroup()
        console.log(this.dialogRef, 'test')
    }

    getData() {
        this.obtenerTipoEvaluaciones()
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
            iEvaluacionId: [0],
            iTipoEvalId: [null, Validators.required],
            cEvaluacionDescripcion: ['', Validators.required],
            cEvaluacionTitulo: [null, Validators.required],
            dFechaEvaluacionPublicacion: [null],
            tHoraEvaluacionPublicacion: [null],
            dFechaEvaluacionInico: [null],
            tHoraEvaluacionInico: [null],
            dFechaEvaluacionFin: [null],
            tHoraEvaluacionFin: [null],
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
            this.handleFormInfo()
            return
        }

        // if (this.activeStepper === 1) {
        // }
    }

    private addTimeToDate(date, time) {
        const dateActual = dayjs(date)
        const timeActual = dayjs(time, 'HH:mm:ss')
        const dateTime = dateActual
            .set('hour', timeActual.hour())
            .set('minute', timeActual.minute())
        return dateTime.format('YYYY-MM-DD HH:mm:ss')
    }

    getInvalidControls(form: FormGroup): string[] {
        const invalidControls: string[] = []
        Object.keys(form.controls).forEach((controlName) => {
            if (form.get(controlName)?.invalid) {
                invalidControls.push(controlName)
            }
        })
        return invalidControls
    }

    private handleFormInfo() {
        const data = this.evaluacionInfoForm.value

        console.log(this.evaluacionInfoForm.valid, this.evaluacionInfoForm)
        console.log(this.getInvalidControls(this.evaluacionInfoForm))

        if (this.evaluacionInfoForm.invalid) {
            this.evaluacionInfoForm.markAllAsTouched()
            return
        }

        if (data.dFechaEvaluacionPublicacion) {
            data.dtEvaluacionPublicacion = this.addTimeToDate(
                data.dFechaEvaluacionPublicacion,
                data.tHoraEvaluacionPublicacion
            )
        }
        if (data.dtEvaluacionInicio) {
            data.dtEvaluacionInicio = this.addTimeToDate(
                data.dFechaEvaluacionInico,
                data.dFechaEvaluacionFin
            )
        }

        if (data.dtEvaluacionFin) {
            data.dtEvaluacionFin = this.addTimeToDate(
                data.dFechaEvaluacionFin,
                data.tHoraEvaluacionFin
            )
        }

        this._evaluacionService
            .guardarActualizarEvaluacion(data)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: () => {
                    this.goStep('next')
                },
            })
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
