import { Component } from '@angular/core'
/*Droodwn*/
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
interface City {
    name: string
    code: string
}
/*InputSwitch */
import { InputSwitchModule } from 'primeng/inputswitch'

//EDITOR
import { EditorModule } from 'primeng/editor'

/*Tab */
import { TabViewModule } from 'primeng/tabview'

/*Input text */
import { InputTextModule } from 'primeng/inputtext'
/*import alternativa*/
import { AlternativasComponent } from '../alternativas/alternativas.component'

import { ButtonModule } from 'primeng/button'
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
    ],
    templateUrl: './banco-preguntas-form.component.html',
    styleUrl: './banco-preguntas-form.component.scss',
})
export class BancoPreguntasFormComponent {
    text
    textAyuda
    valSwitch: boolean = false
    cities: City[] | undefined

    selectedCity: City | undefined
    value: string | undefined
    ngOnInit() {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' },
        ]
    }
}
