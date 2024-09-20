import { Component } from '@angular/core'

/*BOTONES */
import { ButtonModule } from 'primeng/button'

/*MODAL */
import { DialogModule } from 'primeng/dialog'

/*INPUT TEXT */
import { InputTextModule } from 'primeng/inputtext'

@Component({
    selector: 'app-evaluaciones-form',
    standalone: true,
    imports: [ButtonModule, DialogModule, InputTextModule],
    templateUrl: './evaluaciones-form.component.html',
    styleUrl: './evaluaciones-form.component.scss',
})
export class EvaluacionesFormComponent {
    visible: boolean = false
}
