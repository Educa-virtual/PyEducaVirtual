import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { DropdownModule } from 'primeng/dropdown'
import { PaginatorModule } from 'primeng/paginator'
import { DialogModule } from 'primeng/dialog'
import { ApiEvaluacionesRService } from '../../evaluaciones/services/api-evaluaciones-r.service'
import { ContainerPageAccionbComponent } from '../../docente/informes/container-page-accionb/container-page-accionb.component'
import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { HttpParams } from '@angular/common/http'
import { PreguntasReutilizablesService } from '../../evaluaciones/services/preguntas-reutilizables.service'

/*interface PageEvent {
    first: number
    rows: number
    page: number
    pageCount: number
}*/

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
        ContainerPageAccionbComponent,
        TablePrimengComponent,
    ],
    templateUrl: './banco-preguntas.component.html',
    styleUrls: ['./banco-preguntas.component.scss'],
})
export class BancoPreguntasComponent implements OnInit {
    private evaluacionesRService = inject(ApiEvaluacionesRService)
    private preguntasService = inject(PreguntasReutilizablesService)
    checked: boolean = false
    // variables para los filtros seleccionados
    /*fechaEvaluacion: string = 'Fecha de Evaluacion'
    pregunta: string = 'pregunta'
    tipoDePregunta: string = 'Tipo Pregunta'
    proceso: string = 'Proceso'
    grado: string = 'Grado'
    accion: string = 'Acciones'
    first: number = 0
    rows: number = 10*/

    matrizCompetencia: any[] = []
    procesos: any[] = []
    anios: any[] = []
    tipoPreguntas: any[] = []
    selectedTipoPregunta: any
    matrizCapacidad: any[] = []
    preguntas: any[] = []
    /*onPageChange(event: PageEvent) {
        //this.first = event.first
        //this.rows = event.rows
    }*/
    accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]

    columnas: IColumn[] = [
        {
            type: 'item',
            width: '0.5rem',
            field: 'index',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            field: 'dtUltimaFechaEvaluacion',
            header: 'Últ. fecha eval.',
            type: 'text',
            width: '7rem',
            text: 'left',
            text_header: 'dtUltimaFechaEvaluacion',
        },
        {
            field: 'cPregunta',
            header: 'Pregunta',
            type: 'text',
            width: '7rem',
            text: 'left',
            text_header: 'cPregunta',
        },
        {
            field: 'cNivelEvalNombre',
            header: 'Últ. nivel eval.',
            type: 'text',
            width: '7rem',
            text: 'left',
            text_header: 'cNivelEvalNombre',
        },
        {
            field: '',
            header: 'Acciones',
            type: 'actions',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
    ]

    ngOnInit(): void {
        this.obtenerAnios()
        this.obtenerProcesos()
        this.obtenerMatrizCompetencias()
        this.obtenerTipoPreguntas()
        this.obtenerMatrizCapacidad()
        this.obtenerPreguntas()
        /*this.tipoPregunta()
        this.capacidadesFiltro()


        this.obtenerPreguntas()*/
    }

    accionBtnItemTable({ accion }) {
        switch (accion) {
            case 'seleccionar':
                break
        }
    }

    obtenerAnios() {
        this.evaluacionesRService.obtenerAnios().subscribe({
            next: (resp: any) => {
                this.anios = resp
            },
            error: (error) => {
                console.error('error obtenido' + error)
            },
        })
    }

    obtenerProcesos() {
        this.evaluacionesRService.obtenerNivelEvaluacion({}).subscribe({
            next: (resp: any) => {
                this.procesos = resp.data
            },

            error: (error) => {
                console.log('error obtenido' + error)
            },
        })
    }

    obtenerMatrizCompetencias(): void {
        this.evaluacionesRService.obtenerMatrizCompetencias({}).subscribe({
            next: (resp: any) => {
                this.matrizCompetencia = resp.data.fullData
            },
            error: (err) => {
                console.error('Error al cargar datos:', err)
            },
        })
    }

    obtenerTipoPreguntas() {
        this.evaluacionesRService.obtenerTipoPreguntas().subscribe({
            next: (respuesta) => {
                this.tipoPreguntas = respuesta
                this.selectedTipoPregunta = respuesta[0].iTipoPregId
            },

            error: (error) => {
                console.error('error obtenido' + error)
            },
        })
    }

    obtenerMatrizCapacidad() {
        this.evaluacionesRService.obtenerMatrizCapacidades({}).subscribe({
            next: (resp: any) => {
                this.matrizCapacidad = resp.data.fullData
            },
            error: (err) => {
                console.error('Error al cargar datos:', err)
            },
        })
    }

    /*obtenerMatrizCapacidades() {
        this.evaluacionesRService.obtenerMatrizCapacidades().subscribe({
            next: (respuesta) => {
                this.capacidades = respuesta.selectData
            },

            error: (error) => {
                console.log('error obtenido' + error)
            },
        })
    }*/

    obtenerPreguntas() {
        const iEvaluacionId =
            'JB8LQ3vGbkEzKJ2qXVNxDY06g55Ogyj5oRlr41mpaZeW7AM9wd'
        const iCursosNivelGradId =
            'p4a702dYbzM9l5WZwmxEeok6x2eOrGQVqJgDy8AvXpB1NjLRK3'
        let params = new HttpParams()
        params = params.set('tipo_pregunta', 1)
        this.preguntasService
            .obtenerPreguntas(iEvaluacionId, iCursosNivelGradId, params)
            .subscribe({
                next: (respuesta) => {
                    this.preguntas = respuesta
                },
                error: (error) => {
                    console.log('error obtenido' + error)
                },
            })
    }
}
