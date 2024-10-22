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
            cInstrumentoNombre: ['', [Validators.required]],
            cInstrumentoDescripcion: ['', [Validators.required]],
            criterios: this._formBuilder.array([]),
        })
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
            cNivelEvaDescripcion: this._formBuilder.array([]),
        })
    }

    eliminarNivelFromForm(criterioIndex, nivelIndex) {
        const criterios = this.rubricaForm.get('criterios') as FormArray
        const niveles = criterios.at(criterioIndex).get('niveles') as FormArray
        if (niveles.length === 1) {
            return
        }
        niveles.removeAt(nivelIndex)
    }

    // criterios
    addCriterioToForm() {
        const criterios = this.rubricaForm.get('criterios') as FormArray
        const criterioFormGroup = this.criterioForm()
        criterios.push(criterioFormGroup)
    }

    eliminarCriteriofromForm(index: number) {
        const criterios = this.rubricaForm.get('criterios') as FormArray
        criterios.removeAt(index)
    }

    criterioForm(): FormGroup {
        return this._formBuilder.group({
            iCriterioId: [0, Validators.required],
            iInstrumentoId: [0, [Validators.required]],
            cCriterioNombre: [null, [Validators.required]],
            cCriterioDescripcion: ['', [Validators.required]],
            niveles: this._formBuilder.array([this.nivelForm()]),
        })
    }
}
