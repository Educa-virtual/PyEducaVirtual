import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { CommonDropdownComponent } from '../../../../../../../shared/components/common-dropdown/common-dropdown.component'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { CalendarModule } from 'primeng/calendar'
import { EditorModule } from 'primeng/editor'

@Component({
    selector: 'app-evaluacion-form-info',
    standalone: true,
    imports: [
        CommonModule,
        CommonInputComponent,
        CommonDropdownComponent,
        ReactiveFormsModule,
        DropdownModule,
        CalendarModule,
        EditorModule,
    ],
    templateUrl: './evaluacion-form-info.component.html',
    styleUrl: './evaluacion-form-info.component.scss',
})
export class EvaluacionFormInfoComponent {
    @Input() public evaluacionInfoForm: FormGroup

    public tipoEvaluaciones = []

    get invalidForm() {
        return true
    }
}
