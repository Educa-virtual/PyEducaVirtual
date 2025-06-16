import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { Component, OnInit } from '@angular/core'
import { PrimeTemplate } from 'primeng/api'

@Component({
    selector: 'app-resultados-cursos',
    standalone: true,
    templateUrl: './resultados-cursos.component.html',
    styleUrls: ['./resultados-cursos.component.scss'],
    imports: [PrimeTemplate, ToolbarPrimengComponent],
})
export class ResultadosCursosComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        console.log('ng s')
    }
}
