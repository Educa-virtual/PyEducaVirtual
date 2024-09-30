import { Component, OnInit } from '@angular/core'
import { AulaBancoPreguntasModule } from '../aula-banco-preguntas.module'
import {
    actionsContainer,
    actionsTable,
    columns,
} from './aula-banco-pregunta.model'

@Component({
    selector: 'app-aula-banco-preguntas',
    standalone: true,
    imports: [AulaBancoPreguntasModule],
    templateUrl: './aula-banco-preguntas.component.html',
    styleUrl: './aula-banco-preguntas.component.scss',
})
export class AulaBancoPreguntasComponent implements OnInit {
    public actionsTable = actionsTable
    public actionsContainer = actionsContainer
    public columnas = columns
    ngOnInit() {
        console.log('obtener datos')
    }
}
