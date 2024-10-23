import { inject, Injectable } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'

@Injectable()
export class RubricaFormService {
    rubricaForm: FormGroup
    private _formBuilder = inject(FormBuilder)

    constructor() {}

    initRubricaForm() {
        this.rubricaForm = this._formBuilder.group({
            iInstrumentoId: [0],
            cInstrumentoNombre: [null, [Validators.required]],
            cInstrumentoDescripcion: ['', [Validators.required]],
            criterios: this._formBuilder.array([]),
        })
    }

    patchRubricaForm(rubrica) {
        this.rubricaForm.patchValue({
            iInstrumentoId: rubrica.iInstrumentoId,
            cInstrumentoNombre: rubrica.cInstrumentoNombre,
            cInstrumentoDescripcion: rubrica.cInstrumentoDescripcion,
        })

        // patch criterios
        this.patchCriterioForm(rubrica.criterios)
    }

    // niveles
    addNivelToForm(index: number) {
        const criterios = this.rubricaForm.get('criterios') as FormArray
        const niveles = criterios.at(index).get('niveles') as FormArray
        niveles.push(this.nivelForm())
    }

    nivelForm(): FormGroup {
        return this._formBuilder.group({
            iNivelEvaId: [0, [Validators.required]],
            cNivelEvaNombre: ['', [Validators.required]],
            iEscalaCalifId: [0, [Validators.required]],
            cNivelEvaDescripcion: [''],
        })
    }

    eliminarNivelFromForm(criterioIndex, nivelIndex) {
        const criterios = this.rubricaForm.get('criterios') as FormArray
        const niveles = criterios.at(criterioIndex).get('niveles') as FormArray
        niveles.removeAt(nivelIndex)
    }

    // criterios
    addCriterioToForm() {
        const criterios = this.rubricaForm.get('criterios') as FormArray
        if (
            criterios.length > 0 &&
            criterios.at(criterios.length - 1).invalid
        ) {
            criterios.at(criterios.length - 1).markAllAsTouched()
            return
        }
        const criterioFormGroup = this.criterioForm()
        criterios.push(criterioFormGroup)
    }

    eliminarCriteriofromForm(index: number) {
        const criterios = this.rubricaForm.get('criterios') as FormArray
        criterios.removeAt(index)
    }

    criterioForm(criterio?): FormGroup {
        return this._formBuilder.group({
            iCriterioId: [criterio?.iCriterioId ?? 0, Validators.required],
            iInstrumentoId: [
                criterio?.iInstrumentoId ?? 0,
                [Validators.required],
            ],
            cCriterioNombre: [criterio?.cCriterioNombre, [Validators.required]],
            cCriterioDescripcion: [
                criterio?.cCriterioDescripcion ?? '',
                [Validators.required],
            ],
            niveles: this._formBuilder.array(criterio?.niveles ?? []),
        })
    }

    patchCriterioForm(criterios) {
        const criteriosFormArray = this.rubricaForm.get(
            'criterios'
        ) as FormArray

        criterios.forEach((criterio) => {
            // patch niveles
            const niveles = criterio.niveles ?? []
            const criterioFormGroup = this.criterioForm()
            const nivelesFormArray = criterioFormGroup.get(
                'niveles'
            ) as FormArray

            niveles.forEach((nivel) => {
                const nivelFormGroup = this.nivelForm()
                nivelFormGroup.patchValue(nivel)
                nivelesFormArray.push(nivelFormGroup)
            })

            criterioFormGroup.patchValue(criterio)
            criteriosFormArray.push(criterioFormGroup)
        })
    }

    duplicarCriterioToForm(index: number) {
        const criterios = this.rubricaForm.get('criterios') as FormArray
        const duplicado = criterios.at(index).value
        duplicado.iCriterioId = 0

        duplicado.niveles.map((nivel) => {
            nivel.iNivelEvaId = 0
        })

        this.patchCriterioForm([duplicado])
    }
}
