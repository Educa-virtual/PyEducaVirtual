import { Component } from '@angular/core'
import { Button } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { DividerModule } from 'primeng/divider'
import { TableModule } from 'primeng/table'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'

interface City {
    name: string
}
@Component({
    selector: 'app-respuesta-evaluacion',
    standalone: true,
    imports: [
        DividerModule,
        CardModule,
        Button,
        TableModule,
        DropdownModule,
        FormsModule,
    ],
    templateUrl: './respuesta-evaluacion.component.html',
    styleUrl: './respuesta-evaluacion.component.scss',
})
export class RespuestaEvaluacionComponent {
    cities: City[] | undefined

    selectedCity: City | undefined

    ngOnInit() {
        this.cities = [
            { name: 'New York' },
            { name: 'Rome' },
            { name: 'London' },
            { name: 'Istanbul' },
            { name: 'Paris' },
        ]
    }
}
