import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { DropdownModule } from 'primeng/dropdown'
import { PaginatorModule } from 'primeng/paginator'
import { DialogModule } from 'primeng/dialog'
import { ApiEvaluacionesRService } from '../../evaluaciones/services/api-evaluaciones-r.service'

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
        DialogModule,
    ],
    templateUrl: './banco-preguntas.component.html',
    styleUrls: ['./banco-preguntas.component.scss'],
})
export class BancoPreguntasComponent {
    private _ApiEvaluacionesRService = inject(ApiEvaluacionesRService)

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

    // Listas seleccionables
    anios: any[] = []

    tipoPreguntas: any[] = [
        {
            iTipoPregId: 1,
            cTipoPregDescripcion: 'Opcion Única',
        },
        {
            iTipoPregId: 2,
            cTipoPregDescripcion: 'Opcion Múltiple',
        },
    ]

    procesos: any[] = [
        {
            iNivelEvalId: '1',
            cNivelEvalNombre: 'Inicio',
        },
        {
            iNivelEvalId: '2',
            cNivelEvalNombre: 'Proceso',
        },
        {
            iNivelEvalId: '3',
            cNivelEvalNombre: 'Salida',
        },
    ]

    capacidades: any[] = [
        {
            iCapacidadId: '1',
            cCapacidadNombre: 'Se valora a sí mismo',
        },
        {
            iCapacidadId: '2',
            cCapacidadNombre: 'Autorregula sus emociones',
        },
    ]

    competencias: any[] = [
        {
            iCompetenciaId: '1',
            cCompetenciaNombre: 'Construye su identidad',
        },
        {
            iCompetenciaId: '2',
            cCompetenciaNombre:
                'Se desenvuelve de manera autónoma a través de su motricidad',
        },
    ]

    //anios

    //Tipo Pregunta
    tipoPreguntaSeleccionada: string

    //Capacidades
    Capacidade: string

    //competencias
    competencia: string

    //procesos
    procesoAnio: string

    ngOnInit(): void {
        this.obtenerAnios()
    }

    obtenerAnios() {
        this._ApiEvaluacionesRService.obtenerAnios().subscribe({
            next: (respuesta) => {
                this.anios = respuesta
            },
            error: (error) => {
                console.error('error obtenido', error)
            },
        })
    }
}
