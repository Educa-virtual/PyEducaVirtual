import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { CalendarModule } from 'primeng/calendar'
import { EditorModule } from 'primeng/editor'
import dayjs from 'dayjs'
import { BaseDatePickerDirective } from '@/app/shared/directives/base-date-picker.directive'

@Component({
    selector: 'app-evaluacion-form-info',
    standalone: true,
    imports: [
        CommonModule,
        CommonInputComponent,
        ReactiveFormsModule,
        DropdownModule,
        CalendarModule,
        EditorModule,
        BaseDatePickerDirective,
    ],
    templateUrl: './evaluacion-form-info.component.html',
    styleUrl: './evaluacion-form-info.component.scss',
})
export class EvaluacionFormInfoComponent implements OnInit {
    @Input() public evaluacionInfoForm: FormGroup

    @Input() public tipoEvaluaciones = []

    public currentTime = dayjs().toDate()

    get invalidForm() {
        return true
    }

    ngOnInit() {
        console.log(this.currentTime)
    }
}
