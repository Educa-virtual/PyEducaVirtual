import { Component, inject } from '@angular/core'
/*Droodwn*/
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { InputSwitchModule } from 'primeng/inputswitch'

//EDITOR
import { EditorModule } from 'primeng/editor'

/*Tab */
import { TabViewModule } from 'primeng/tabview'

/*Input text */
import { InputTextModule } from 'primeng/inputtext'
/*import alternativa*/
import { AlternativasComponent } from '../alternativas/alternativas.component'
/*acordion */
import { AccordionModule } from 'primeng/accordion'

import { ButtonModule } from 'primeng/button'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
@Component({
    selector: 'app-banco-preguntas-form',
    standalone: true,
    imports: [
        FormsModule,
        DropdownModule,
        InputSwitchModule,
        EditorModule,
        TabViewModule,
        InputTextModule,
        AlternativasComponent,
        ButtonModule,
        AccordionModule,
        ReactiveFormsModule,
        CommonInputComponent,
    ],
    templateUrl: './banco-preguntas-form.component.html',
    styleUrl: './banco-preguntas-form.component.scss',
})
export class BancoPreguntasFormComponent {
    public tipoPreguntas = []

    private _formBuilder = inject(FormBuilder)

    public bancoPreguntasForm: FormGroup = this._formBuilder.group({
        iTipoPregId: [null, [Validators.required]],
        iCursoId: [null, [Validators.required]],
        cPregunta: [null, [Validators.required]],
        cPreguntaTextoAyuda: [null, Validators.required],
        iPreguntaNivel: [null, [Validators.required]],
        iPreguntaPeso: [null, [Validators.required]],
        // dtPreguntaTiempo: [null, [Validators.required]],
        iHoras: [0, [Validators.required]],
        iMinutos: [0, [Validators.required]],
        iSegundos: [0, [Validators.required]],
        cPreguntaClave: [null, [Validators.required]],
    })
}
