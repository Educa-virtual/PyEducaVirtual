import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-cuestionario-preguntas',
    standalone: true,
    templateUrl: './cuestionario-preguntas.component.html',
    styleUrls: ['./cuestionario-preguntas.component.scss'],
    imports: [PrimengModule],
})
export class CuestionarioPreguntasComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        console.log('hola')
    }
}
