import { generarIdAleatorio } from '@/app/shared/utils/random-id'
import { inject, Injectable } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'

@Injectable()
export class RubricaFormService {
    rubricaForm: FormGroup
    private _formBuilder = inject(FormBuilder)
    constructor() {}

    addNivelToForm(index: number) {
        const criterios = this.rubricaForm.get('criterios') as FormArray
        const niveles = criterios.at(index).get('niveles') as FormArray
        niveles.push(this.nivelForm())
    }

    nivelForm(): FormGroup {
        return this._formBuilder.group({
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

    initRubricaForm() {
        this.rubricaForm = this._formBuilder.group({
            cInstrumentoNombre: ['', [Validators.required]],
            cInstrumentoDescripcion: ['', [Validators.required]],
            criterios: this._formBuilder.array([]),
        })
    }

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
            iInstrumentoId: [generarIdAleatorio(), [Validators.required]],
            cCriterioNombre: [null, [Validators.required]],
            nCriterioDescripcion: ['', [Validators.required]],
            niveles: this._formBuilder.array([this.nivelForm()]),
        })
    }
}
