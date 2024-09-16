import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'

@Component({
    selector: 'app-common-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule],
    templateUrl: './common-input.component.html',
    styleUrl: './common-input.component.scss',
})
export class CommonInputComponent {
    @Input({ required: true }) formControlName: string
    @Input() id: string
}
