import { Component } from '@angular/core'

/*BOTONES */
import { ButtonModule } from 'primeng/button'

/*MODAL */
import { DialogModule } from 'primeng/dialog'

/*INPUT TEXT */
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { FormsModule } from '@angular/forms'
//TAB
import { TabViewModule } from 'primeng/tabview'

import { IeparticipaComponent } from '../ieparticipa/ieparticipa.component'
@Component({
    selector: 'app-evaluaciones-form',
    standalone: true,
    imports: [
        ButtonModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        FormsModule,
        TabViewModule,
        IeparticipaComponent,
    ],
    templateUrl: './evaluaciones-form.component.html',
    styleUrl: './evaluaciones-form.component.scss',
})
export class EvaluacionesFormComponent {
    visible: boolean = false
    value!: string
}
