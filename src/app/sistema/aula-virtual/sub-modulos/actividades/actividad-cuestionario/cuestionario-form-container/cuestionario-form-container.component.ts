import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-cuestionario-form-container',
    standalone: true,
    templateUrl: './cuestionario-form-container.component.html',
    styleUrls: ['./cuestionario-form-container.component.scss'],
    imports: [PrimengModule],
})
export class CuestionarioFormContainerComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        console.log('Hello! world...')
    }
}
