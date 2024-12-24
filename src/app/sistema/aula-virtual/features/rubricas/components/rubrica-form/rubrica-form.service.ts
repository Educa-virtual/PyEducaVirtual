import { inject, Injectable } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Input } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class RubricaFormService {
    rubricaForm: FormGroup

    firstRender = true
    @Input() mode
    private _formBuilder = inject(FormBuilder)

    constructor() {}

    initRubricaForm() {
        this.rubricaForm = this._formBuilder.group({
            iInstrumentoId: [0],
            cInstrumentoNombre: [null, [Validators.required]],
            cInstrumentoDescripcion: [''],
            criterios: this._formBuilder.array([]),
        })
    }

    patchRubricaFormSelection(rubrica) {
        this.rubricaForm.patchValue({
            iInstrumentoId: rubrica.iInstrumentoId,
            cInstrumentoNombre: rubrica.cInstrumentoNombre,
            cInstrumentoDescripcion: rubrica.cInstrumentoDescripcion,
        })

        // patch criterios
        this.patchCriterioFormSelection(rubrica.criterios)
    }

    patchCriterioFormSelection(criterios) {
        const criteriosFormArray = this.rubricaForm.get(
            'criterios'
        ) as FormArray

        criteriosFormArray.clear()

        criterios.forEach((criterio) => {
            // patch niveles
            const niveles = criterio.niveles ?? []
            const criterioFormGroup = this.criterioForm()
            const nivelesFormArray = criterioFormGroup.get(
                'niveles'
            ) as FormArray

            if (this.firstRender) {
                nivelesFormArray.clear()
                this.firstRender = false
            }

            niveles.forEach((nivel) => {
                const nivelFormGroup = this.nivelForm()
                nivelFormGroup.patchValue(nivel)
                nivelesFormArray.push(nivelFormGroup)
            })

            criterioFormGroup.patchValue(criterio)
            criteriosFormArray.push(criterioFormGroup)
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
            iNivelEvaValor: [0],
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
            cCriterioDescripcion: [criterio?.cCriterioDescripcion ?? ''],
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
        const original = criterios.at(index).value

        const duplicado = JSON.parse(JSON.stringify(original))

        duplicado.iCriterioId = 0
        duplicado.niveles.forEach((nivel) => {
            nivel.iNivelEvaId = 0
        })

        this.patchCriterioForm([duplicado])
    }
}
