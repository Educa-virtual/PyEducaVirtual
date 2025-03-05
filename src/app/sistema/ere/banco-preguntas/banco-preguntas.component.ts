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
    tipoDePregunta: string = 'Tipo Pregunta'
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

    tipoPreguntas: any[] = []

    capacidades: any[] = []

    competencias: any[] = []

    procesos: any[] = []

    // Tabla

    preguntas: any[] = []

    //anios

    //Tipo Pregunta

    //Capacidades

    //competencias

    //procesos

    ngOnInit(): void {
        this.obtenerAnios()
        this.tipoPregunta()
        this.capacidadesFiltro()
        this.competenciaFiltro()
        this.procesoFiltro()
    }

    obtenerAnios() {
        this._ApiEvaluacionesRService.obtenerAnios().subscribe({
            next: (respuesta) => {
                this.anios = respuesta
            },
            error: (error) => {
                console.error('error obtenido' + error)
            },
        })
    }

    tipoPregunta() {
        this._ApiEvaluacionesRService.tipoPregunta().subscribe({
            next: (respuesta) => {
                this.tipoPreguntas = respuesta
            },

            error: (error) => {
                console.error('error obtenido' + error)
            },
        })
    }

    capacidadesFiltro() {
        this._ApiEvaluacionesRService.capacidadesFiltro().subscribe({
            next: (respuesta) => {
                this.capacidades = respuesta.selectData
            },

            error: (error) => {
                console.log('error obtenido' + error)
            },
        })
    }

    competenciaFiltro() {
        this._ApiEvaluacionesRService.competenciaFiltro().subscribe({
            next: (respuesta) => {
                this.competencias = respuesta.selectData
            },

            error: (error) => {
                console.log('error obtenido' + error)
            },
        })
    }

    procesoFiltro() {
        this._ApiEvaluacionesRService.procesoFiltro().subscribe({
            next: (respuesta) => {
                this.procesos = respuesta
            },

            error: (error) => {
                console.log('error obtenido' + error)
            },
        })
    }
}
