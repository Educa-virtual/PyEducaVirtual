import { Component } from '@angular/core'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonDirective } from 'primeng/button'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'

@Component({
    templateUrl: './formlayoutdemo.component.html',
    standalone: true,
    imports: [
        InputTextModule,
        ButtonDirective,
        InputTextareaModule,
        DropdownModule,
        FormsModule,
    ],
})
export class FormLayoutDemoComponent {
    selectedState: unknown = null

    states: unknown[] = [
        { name: 'Arizona', code: 'Arizona' },
        { name: 'California', value: 'California' },
        { name: 'Florida', code: 'Florida' },
        { name: 'Ohio', code: 'Ohio' },
        { name: 'Washington', code: 'Washington' },
    ]

    dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' },
    ]

    cities1: unknown[] = []

    cities2: unknown[] = []

    city1: unknown = null

    city2: unknown = null
}
