import { Component, inject, Input, OnInit } from '@angular/core'
import { ControlContainer, FormArray, FormGroup } from '@angular/forms'
import { RubricaFormService } from '../rubrica-form.service'

@Component({
    selector: 'app-rubrica-form-niveles',
    templateUrl: './rubrica-form-niveles.component.html',
    styleUrl: './rubrica-form-niveles.component.scss',
})
export class RubricaFormNivelesComponent implements OnInit {
    @Input() index: number

    @Input() escalasCalificativas = []
    @Input() criterioForm: FormGroup

    private _parentContainer = inject(ControlContainer)
    public rubricaFormGroup: FormGroup

    constructor(private _rubricaFormService: RubricaFormService) {}

    ngOnInit() {
        console.log(this._parentContainer.control, this.index)
    }

    get nivelesFormArray() {
        return this.criterioForm.get('niveles') as FormArray
    }

    agregarNivel() {
        this._rubricaFormService.addNivelToForm(this.index)
    }

    eliminarNivel(index: number) {
        this._rubricaFormService.eliminarNivelFromForm(this.index, index)
    }
}
