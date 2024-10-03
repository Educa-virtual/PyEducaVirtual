import { Component, inject } from '@angular/core'
import { FormBuilder } from '@angular/forms'

@Component({
    selector: 'app-aula-banco-pregunta-form-container',
    templateUrl: './aula-banco-pregunta-form-container.component.html',
    styleUrl: './aula-banco-pregunta-form-container.component.scss',
})
export class AulaBancoPreguntaFormContainerComponent {
    private _formBuilder = inject(FormBuilder)

    public formAulaBanco = this._formBuilder.group({
        '0': this._formBuilder.group({}),
        '1': this._formBuilder.group({}),
        '2': this._formBuilder.group({}),
    })
    // formulario completo
    // mande a guardar, actualizar
}
