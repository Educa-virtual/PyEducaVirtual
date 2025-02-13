import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'app-container-preguntas',
    templateUrl: './container-preguntas.component.html',
    styleUrls: ['./container-preguntas.component.scss'],
})
export class ContainerPreguntasComponent implements OnInit {
    @Input() nombre: string

    constructor() {
        console.log('ff')
    }

    ngOnInit() {
        console.log('ff')
    }
}
