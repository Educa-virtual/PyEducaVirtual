import { Component } from '@angular/core'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { FormsModule } from '@angular/forms'
import { InputSwitchModule } from 'primeng/inputswitch'
@Component({
    selector: 'app-alternativas-form',
    standalone: true,
    imports: [InputTextareaModule, FormsModule, InputSwitchModule],
    templateUrl: './alternativas-form.component.html',
    styleUrl: './alternativas-form.component.scss',
})
export class AlternativasFormComponent {
    value!: string
    checked: boolean = true
}
