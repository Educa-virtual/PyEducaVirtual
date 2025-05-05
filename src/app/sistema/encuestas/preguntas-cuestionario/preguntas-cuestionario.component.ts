import { PrimengModule } from '@/app/primeng.module'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { Component } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { EvaluacionAgregarPreguntasComponent } from './evaluacion-agregar-preguntas/evaluacion-agregar-preguntas.component'

@Component({
    selector: 'app-preguntas-cuestionario',
    standalone: true,
    templateUrl: './preguntas-cuestionario.component.html',
    styleUrl: './preguntas-cuestionario.component.scss',
    imports: [
        PrimengModule,
        ToolbarPrimengComponent,
        EvaluacionAgregarPreguntasComponent,
    ],
})
export class PreguntasCuestionarioComponent {
    items: MenuItem[] = []

    constructor() {
        this.items = [
            {
                label: 'Preguntas',
                icon: 'pi pi-fw pi-plus',
                routerLink:
                    '/sistema/encuestas/preguntas-cuestionario/preguntas',
            },
            {
                label: 'Cuestionarios',
                icon: 'pi pi-fw pi-plus',
                routerLink:
                    '/sistema/encuestas/preguntas-cuestionario/cuestionarios',
            },
        ]
    }
    ngOnInit() {
        console.log('PreguntasCuestionarioComponent initialized')
    }
}
