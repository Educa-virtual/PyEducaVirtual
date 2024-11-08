import { PrimengModule } from '@/app/primeng.module'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { CommonModule } from '@angular/common'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
    OnDestroy,
} from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Subject, takeUntil } from 'rxjs'
import { almenosUnNivelActivo } from './validators'

@Component({
    selector: 'app-evaluacion-pregunta-rubrica',
    standalone: true,
    imports: [CommonModule, PrimengModule],
    templateUrl: './evaluacion-pregunta-rubrica.component.html',
    styleUrl: './evaluacion-pregunta-rubrica.component.scss',
})
export class EvaluacionPreguntaRubricaComponent implements OnInit, OnDestroy {
    @Output() closeModalChange = new EventEmitter()
    private _rubrica
    @Input() escalasCalificativas = []
    @Input() set rubrica(value: any) {
        this._rubrica = value
        if (this._rubrica) {
            this.setCriterios(this.rubrica?.criterios || [])
        }
    }

    private _unsubscribe$ = new Subject<boolean>()

    private _formBuilder = inject(FormBuilder)
    private _apiEvalService = inject(ApiEvaluacionesService)

    rubricaFormGroup: FormGroup

    ngOnInit() {
        this.rubricaFormGroup = this._formBuilder.group({
            criterios: this._formBuilder.array([]),
        })
    }

    get rubrica() {
        return this._rubrica
    }

    setCriterios(criterios = []) {
        const criteriosArray = this.rubricaFormGroup.get(
            'criterios'
        ) as FormArray
        criterios.forEach((criterio) => {
            criteriosArray.push(this.createCriterioGroup(criterio))
        })
    }

    createCriterioGroup(criterio: any): FormGroup {
        return this._formBuilder.group({
            cCriterioNombre: [criterio.cCriterioNombre],
            cCriterioDescripcion: [criterio.cCriterioDescripcion],
            iNivelLogroAlcId: [criterio.iNivelLogroAlcId],
            niveles: this._formBuilder.array(
                criterio.niveles.map((nivel) => this.createNivelGroup(nivel)),
                almenosUnNivelActivo()
            ),
        })
    }

    createNivelGroup(nivel: any): FormGroup {
        const nivelGroup = this._formBuilder.group({
            cNivelEvaNombre: [nivel.cNivelEvaNombre],
            iNivelEvaValor: [nivel.iNivelEvaValor],
            cNivelEvaDescripcion: [nivel.cNivelEvaDescripcion],
            iNivelEvaId: [nivel.iNivelEvaId],
            iCriterioId: [nivel.iCriterioId],
            iEvalRptaId: [nivel.iEvalRptaId],
            iEscalaCalifId: [
                {
                    value: nivel.iEscalaCalifId,
                    disabled: !nivel.iNivelLogroAlcId, // desactivado si es null
                },
            ],
            cNivelLogroAlcConclusionDescriptiva: [
                {
                    value: nivel.cNivelLogroAlcConclusionDescriptiva ?? null,
                    disabled: !nivel.iNivelLogroAlcId, // desactivado si es null
                },
            ],
            nNnivelLogroAlcNota: [
                {
                    value: nivel.nNnivelLogroAlcNota,
                    disabled: !nivel.iNivelLogroAlcId, // desactivado si es null
                },
            ],
            bActivo: [!!nivel.iNivelLogroAlcId], // activo si no es null
        })
        return nivelGroup
    }

    get criterios(): FormArray {
        return this.rubricaFormGroup.get('criterios') as FormArray
    }

    niveles(criterioIndex: number): FormArray {
        return this.criterios.at(criterioIndex).get('niveles') as FormArray
    }

    marcarNivelActivo(event, criterioIndex: number, nivelIndex: number) {
        const nivelesArray = this.niveles(criterioIndex)

        if (event.checked) {
            nivelesArray.controls.forEach((control, index) => {
                if (index !== nivelIndex) {
                    control.patchValue({ bActivo: false }, { emitEvent: false })
                    this.activarDesactivarNivelControles(
                        'disable',
                        criterioIndex,
                        index
                    )
                } else {
                    this.activarDesactivarNivelControles(
                        'enable',
                        criterioIndex,
                        index
                    )
                }
            })
        } else {
            this.activarDesactivarNivelControles(
                'disable',
                criterioIndex,
                nivelIndex
            )
        }
        nivelesArray.at(nivelIndex).patchValue({ bActivo: event.checked })
    }

    activarDesactivarNivelControles(
        accion: 'enable' | 'disable',
        criterioIndex: number,
        nivelIndex: number
    ) {
        const controles: string[] = [
            'cNivelLogroAlcConclusionDescriptiva',
            'nNnivelLogroAlcNota',
            'iEscalaCalifId',
        ]
        const nivelesArray = this.niveles(criterioIndex)
        controles.forEach((control) => {
            const formControl = nivelesArray.at(nivelIndex).get(control)
            if (formControl) {
                if (accion === 'disable') {
                    formControl.disable()
                    formControl.clearValidators
                    formControl.updateValueAndValidity()
                } else {
                    formControl.enable()
                    formControl.setValidators([Validators.required])
                    formControl.updateValueAndValidity()
                }
            }
        })
    }

    guardarActualizarLogrosRubrica() {
        const criterios = this.rubricaFormGroup.get('criterios') as FormArray
        let logrosCalificacion = criterios.controls.flatMap((criterio) => {
            let niveles = criterio.get('niveles').getRawValue()
            niveles = niveles.map((nivel) => {
                nivel.iNivelLogroAlcId = criterio.get('iNivelLogroAlcId').value
                return nivel
            })

            return niveles
        })
        logrosCalificacion = logrosCalificacion.filter((item) => item.bActivo)

        if (this.rubricaFormGroup.invalid) {
            this.rubricaFormGroup.markAllAsTouched()
            return
        }

        const data = {
            logrosCalificacion: logrosCalificacion,
        }
        this._apiEvalService
            .calificarLogrosRubrica(data)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (response) => {
                    this.closeModalChange.emit(response)
                },
            })
    }

    ngOnDestroy() {
        this._unsubscribe$.next(true)
        this._unsubscribe$.complete()
    }
}
