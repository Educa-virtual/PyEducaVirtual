import { Component, OnDestroy } from '@angular/core'
import { AccordionModule } from 'primeng/accordion'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-rubrica-evaluacion',
    standalone: true,
    imports: [AccordionModule, CommonModule],

    templateUrl: './rubrica-evaluacion.component.html',
    styleUrl: './rubrica-evaluacion.component.scss',
})
export class RubricaEvaluacionComponent implements OnDestroy {

    constructor() {}


    ngOnDestroy() {

    }
}
