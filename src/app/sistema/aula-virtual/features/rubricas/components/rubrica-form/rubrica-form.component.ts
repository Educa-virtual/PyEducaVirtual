import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { RubricaFormService } from './rubrica-form.service'
import { DynamicDialogRef } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-rubrica-form',
    templateUrl: './rubrica-form.component.html',
    styleUrl: './rubrica-form.component.scss',
})
export class RubricaFormComponent implements OnInit {
    public rubricaForm: FormGroup
    public mode: 'EDITAR' | 'CREAR' = 'CREAR'

    private _formBuilder = inject(FormBuilder)

    private ref = inject(DynamicDialogRef)

    constructor(private _rubricaFormService: RubricaFormService) {}

    ngOnInit() {
        this.initForm()
    }

    initForm() {
        this._rubricaFormService.initRubricaForm()
        this.rubricaForm = this._rubricaFormService.rubricaForm

        console.log(this.rubricaForm)
    }

    guardarActualizarRubrica() {}

    closeModal() {
        this.ref.close(null)
    }
}
