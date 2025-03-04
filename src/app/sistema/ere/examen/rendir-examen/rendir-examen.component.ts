import { PrimengModule } from '@/app/primeng.module'
import {
    matAccessTime,
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
} from '@ng-icons/material-icons/baseline'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, OnInit } from '@angular/core'
import { provideIcons } from '@ng-icons/core'

import { IconComponent } from '@/app/shared/icon/icon.component'
import { MostrarEvaluacionComponent } from '../mostrar-evaluacion/mostrar-evaluacion.component'

@Component({
    selector: 'app-rendir-examen',
    standalone: true,
    templateUrl: './rendir-examen.component.html',
    styleUrls: ['./rendir-examen.component.scss'],
    imports: [
        PrimengModule,
        ContainerPageComponent,
        IconComponent,
        MostrarEvaluacionComponent,
    ],
    providers: [
        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,
        }),
    ],
})
export class RendirExamenComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        console.log('hola')
    }

    // para ocultadar la interfaz de inicio.
    mostrarOtraInterfaz = false
    cambiarInterfaz() {
        this.mostrarOtraInterfaz = !this.mostrarOtraInterfaz
    }
}
