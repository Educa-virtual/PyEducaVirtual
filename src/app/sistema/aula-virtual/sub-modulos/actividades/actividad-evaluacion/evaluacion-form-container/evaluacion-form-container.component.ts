import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, ViewChild } from '@angular/core'
import { Dialog } from 'primeng/dialog'
import { DialogService } from 'primeng/dynamicdialog'
import { EvaluacionFormInfoComponent } from '../evaluacion-form/evaluacion-form-info/evaluacion-form-info.component'
import { EvaluacionFormPreguntasComponent } from '../evaluacion-form/evaluacion-form-preguntas/evaluacion-form-preguntas.component'
import { EvaluacionFormCalificacionComponent } from '../evaluacion-form/evaluacion-form-calificacion/evaluacion-form-calificacion.component'
import { StepperModule } from 'primeng/stepper'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MenuItem } from 'primeng/api'

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
export class EvaluacionFormContainerComponent implements OnInit {
    @ViewChild('dialogRef') dialogRef!: Dialog

    public evaluacionInfoForm: FormGroup
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

    private _formBuilder = inject(FormBuilder)

    ngOnInit(): void {
        this.initFormGroup()
        console.log(this.dialogRef, 'test')
    }
    constructor() {}

    onDialogShow() {
        console.log(this.dialogRef, 'test')

        if (this.dialogRef) {
            this.dialogRef.maximize()
        }
    }

    initFormGroup() {
        this.evaluacionInfoForm = this._formBuilder.group({
            iEvaluacionId: [0],
            iTipoEvalId: [null, Validators.required],
            dtEvaluacionPublicacion: [null, Validators.required],
            cEvaluacionTitulo: [null, Validators.required],
            dFechaEvaluacionPublicacion: [null, Validators.required],
            tHoraEvaluacionPublicacion: [null, Validators.required],
            dFechaEvaluacionInico: [null, Validators.required],
            tHoraEvaluacionInico: [null, Validators.required],
            dFechaEvaluacionFin: [null, Validators.required],
            tHoraEvaluacionFin: [null, Validators.required],
            cEvaluacionDescripcion: ['', Validators.required],
        })
    }

    goStep(opcion: string) {
        switch (opcion) {
            case 'next':
                if (
                    this.activeStepper === 0 &&
                    this.evaluacionInfoForm.invalid
                ) {
                    this.evaluacionInfoForm.markAllAsTouched()
                    return
                }

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
}
