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
} from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-evaluacion-pregunta-rubrica',
    standalone: true,
    imports: [CommonModule, PrimengModule],
    templateUrl: './evaluacion-pregunta-rubrica.component.html',
    styleUrl: './evaluacion-pregunta-rubrica.component.scss',
})
export class EvaluacionPreguntaRubricaComponent implements OnInit {
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
            niveles: this._formBuilder.array(
                criterio.niveles.map((nivel) => this.createNivelGroup(nivel))
            ),
        })
    }

    createNivelGroup(nivel: any): FormGroup {
        const nivelGroup = this._formBuilder.group({
            cNivelEvaNombre: [nivel.cNivelEvaNombre],
            iNivelEvaValor: [nivel.iNivelEvaValor],
            cNivelEvaDescripcion: [nivel.cNivelEvaDescripcion],
            iEscalaCalifId: [{ value: nivel.iEscalaCalifId, disabled: true }],
            cNivelLogroAlcConclusiondescriptiva: [
                {
                    value: nivel.cNivelLogroAlcConclusiondescriptiva ?? null,
                    disabled: true,
                },
            ],
            bActivo: [false],
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
                    control.get('cNivelLogroAlcConclusiondescriptiva').disable()
                    control
                        .get('cNivelLogroAlcConclusiondescriptiva')
                        .clearValidators()
                    control.get('iEscalaCalifId').disable()
                    control
                        .get('cNivelLogroAlcConclusiondescriptiva')
                        .updateValueAndValidity()
                } else {
                    control.get('iEscalaCalifId').enable()
                    control.get('cNivelLogroAlcConclusiondescriptiva').enable()
                    control
                        .get('cNivelLogroAlcConclusiondescriptiva')
                        .updateValueAndValidity()
                    control
                        .get('cNivelLogroAlcConclusiondescriptiva')
                        .setValidators([Validators.required])
                }
            })
        } else {
            nivelesArray
                .at(nivelIndex)
                .get('cNivelLogroAlcConclusiondescriptiva')
                .disable()
            nivelesArray
                .at(nivelIndex)
                .get('cNivelLogroAlcConclusiondescriptiva')
                .clearValidators()
            nivelesArray
                .at(nivelIndex)
                .get('cNivelLogroAlcConclusiondescriptiva')
                .updateValueAndValidity()
            nivelesArray.at(nivelIndex).get('iEscalaCalifId').disable()
        }
        nivelesArray.at(nivelIndex).patchValue({ bActivo: event.checked })
    }

    guardarActualizarLogrosRubrica() {
        console.log(this.rubricaFormGroup)

        if (this.rubricaFormGroup.valid) {
            this.rubricaFormGroup.markAllAsTouched()
            return
        }

        const criterios = this.rubricaFormGroup.get('criterios') as FormArray
        const logrosCalificacion = criterios.controls.flatMap((criterio) => {
            const niveles = criterio.get('niveles').value
            return niveles
        })
        console.log(criterios)

        return
        const data = {
            ixColumn: 'iNivelEvaId',
            logrosCalificacion: logrosCalificacion,
        }
        this._apiEvalService
            .calificarLogros(data)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (response) => {
                    console.log(response)
                },
            })
    }
}
