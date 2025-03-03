import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { DropdownModule } from 'primeng/dropdown'
import { PaginatorModule } from 'primeng/paginator'

interface PageEvent {
    first: number
    rows: number
    page: number
    pageCount: number
}

@Component({
    selector: 'app-banco-preguntas',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        PrimengModule,
        TableModule,
        ButtonModule,
        CheckboxModule,
        DropdownModule,
        PaginatorModule,
    ],
    templateUrl: './banco-preguntas.component.html',
    styleUrls: ['./banco-preguntas.component.scss'],
})
export class BancoPreguntasComponent {
    checked: boolean = false

    // variables para los filtros seleccionados
    fechaEvaluacion: string = 'Fecha de Evaluacion'
    pregunta: string = 'pregunta'
    tipoPregunta: string = 'Tipo Pregunta'
    proceso: string = 'Proceso'
    grado: string = 'Grado'
    accion: string = 'Acciones'

    first: number = 0

    rows: number = 10

    onPageChange(event: PageEvent) {
        this.first = event.first
        this.rows = event.rows
    }

    filtros = [
        {
            categoria: 'General',
            items: [
                { label: 'Año', value: 'anio' },
                { label: 'Proceso', value: 'proceso' },
                { label: 'Tipo', value: 'tipo' },
            ],
        },
        {
            categoria: 'Competencias y Capacidades',
            items: [
                { label: 'Competencia', value: 'competencia' },
                { label: 'Capacidad', value: 'capacidad' },
            ],
        },
        {
            categoria: 'Búsqueda',
            items: [
                { label: 'Descripción de la pregunta', value: 'descripcion' },
            ],
        },
    ]

    datos = [
        {
            id: 1,
            fechaEval: '2024-03-03',
            pregunta: '¿Cuál es la capital de Francia?',
            tipo: 'Opción Múltiple',
            proceso: 'Inicio',
            grado: '2do',
            acciones: '',
        },
        {
            id: 2,
            fechaEval: '2024-03-04',
            pregunta: '¿Cuánto es 5+5?',
            tipo: 'Opción Múltiple',
            proceso: 'Desarrollo',
            grado: '3ro',
            acciones: '',
        },
        {
            id: 3,
            fechaEval: '2024-03-05',
            pregunta: '¿Quién escribió "Cien años de soledad"?',
            tipo: 'Abierta',
            proceso: 'Cierre',
            grado: '4to',
            acciones: '',
        },
        {
            id: 4,
            fechaEval: '2024-03-03',
            pregunta: '¿Cuál es la capital de Francia?',
            tipo: 'Opción Múltiple',
            proceso: 'Inicio',
            grado: '2do',
            acciones: '',
        },
        {
            id: 5,
            fechaEval: '2024-03-04',
            pregunta: '¿Cuánto es 5+5?',
            tipo: 'Opción Múltiple',
            proceso: 'Desarrollo',
            grado: '3ro',
            acciones: '',
        },
        {
            id: 6,
            fechaEval: '2024-03-05',
            pregunta: '¿Quién escribió "Cien años de soledad"?',
            tipo: 'Abierta',
            proceso: 'Cierre',
            grado: '4to',
            acciones: '',
        },
        {
            id: 7,
            fechaEval: '2024-03-04',
            pregunta: '¿Cuánto es 5+5?',
            tipo: 'Opción Múltiple',
            proceso: 'Desarrollo',
            grado: '3ro',
            acciones: '',
        },
        {
            id: 8,
            fechaEval: '2024-03-05',
            pregunta: '¿Quién escribió "Cien años de soledad"?',
            tipo: 'Abierta',
            proceso: 'Cierre',
            grado: '4to',
            acciones: '',
        },
        {
            id: 9,
            fechaEval: '2024-03-04',
            pregunta: '¿Cuánto es 5+5?',
            tipo: 'Opción Múltiple',
            proceso: 'Desarrollo',
            grado: '3ro',
            acciones: '',
        },
        {
            id: 10,
            fechaEval: '2024-03-05',
            pregunta: '¿Quién escribió "Cien años de soledad"?',
            tipo: 'Abierta',
            proceso: 'Cierre',
            grado: '4to',
            acciones: '',
        },
        {
            id: 11,
            fechaEval: '2024-03-05',
            pregunta: '¿Quién escribió "Cien años de soledad"?',
            tipo: 'Abierta',
            proceso: 'Cierre',
            grado: '4to',
            acciones: '',
        },
    ]
}
