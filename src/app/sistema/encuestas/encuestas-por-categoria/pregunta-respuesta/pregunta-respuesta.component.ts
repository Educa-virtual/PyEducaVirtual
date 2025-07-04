import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem } from 'primeng/api'
import { LlenadoPreguntasEncuestaComponent } from '../llenado-preguntas-encuesta/llenado-preguntas-encuesta.component'
import { RespuestaPreguntasEncuestaComponent } from '../respuesta-preguntas-encuesta/respuesta-preguntas-encuesta.component'

@Component({
    selector: 'app-pregunta-respuesta',
    standalone: true,
    imports: [
        PrimengModule,
        CommonModule,
        LlenadoPreguntasEncuestaComponent,
        RespuestaPreguntasEncuestaComponent,
    ],
    templateUrl: './pregunta-respuesta.component.html',
    styleUrl: './pregunta-respuesta.component.scss',
})
export class PreguntaRespuestaComponent implements OnInit {
    title: string = 'Encuesta: Situación Académica'

    // TabMenu items
    items: MenuItem[] = []
    activeItem: MenuItem = {}

    // Componentes a mostrar
    pregunta: boolean = true
    respuesta: boolean = false

    constructor() {}

    ngOnInit() {
        this.items = [
            {
                label: 'Preguntas',
                icon: 'pi pi-pencil',
                command: () => this.ShowComponent('llenado-preguntas'),
            },
            {
                label: 'Respuestas',
                icon: 'pi pi-check',
                command: () => this.ShowComponent('respuesta'),
            },
        ]

        this.activeItem = this.items[0]
    }

    // Mostrar componente según la pestaña seleccionada
    ShowComponent(componente: string) {
        this.pregunta = false
        this.respuesta = false

        switch (componente) {
            case 'llenado-preguntas':
                this.pregunta = true
                break
            case 'respuesta':
                this.respuesta = true
                break
        }
    }
}
