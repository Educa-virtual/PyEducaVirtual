import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
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
        PrimengModule,
        ContainerPageAccionbComponent,
        TablePrimengComponent,
    ],
    templateUrl: './banco-preguntas.component.html',
    styleUrls: ['./banco-preguntas.component.scss'],
})
export class BancoPreguntasComponent implements OnInit {
    private evaluacionesRService = inject(ApiEvaluacionesRService)
    private preguntasService = inject(PreguntasReutilizablesService)
    //checked: boolean = false
    visible: boolean = true
    formCriterios!: FormGroup
    matrizCompetencia: any[] = []
    procesos: any[] = []
    anios: any[] = []
    tipoPreguntas: any[] = []
    selectedTipoPregunta: any
    matrizCapacidad: any[] = []
    preguntas: any[] = []

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
            type: 'item-checkbox',
            width: '1rem',
            field: 'iPreguntaId',
            header: 'Elegir',
            text_header: 'center',
            text: 'center',
        },
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
            width: '2rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: 'cPregunta',
            header: 'Pregunta',
            type: 'text',
            width: '15rem',
            text: 'left',
            text_header: 'center',
        },
        {
            field: 'cNivelEvalNombre',
            header: 'Últ. nivel eval.',
            type: 'text',
            width: '4rem',
            text: 'center',
            text_header: 'center',
        },
        {
            field: '',
            header: 'Acciones',
            type: 'actions',
            width: '3rem',
            text: 'center',
            text_header: 'center',
        },
    ]

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.formCriterios = this.fb.group({
            ddTipoPregunta: [null],
            ddCompetencia: [null],
            ddAnioEvaluacion: [null],
            ddNivelEvaluacion: [null],
            ddCapacidad: [null],
        })
        this.obtenerAnios()
        this.obtenerProcesos()
        this.obtenerMatrizCompetencias()
        this.obtenerTipoPreguntas()
        this.obtenerMatrizCapacidad()
    }

    accionBtnItemTable({ accion }) {
        switch (accion) {
            case 'ver':
                console.log('visto')
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
                this.formCriterios.patchValue({
                    ddTipoPregunta: respuesta[0].iTipoPregId,
                })
                this.obtenerPreguntas()
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

    obtenerPreguntas() {
        const iEvaluacionId =
            'JB8LQ3vGbkEzKJ2qXVNxDY06g55Ogyj5oRlr41mpaZeW7AM9wd'
        const iCursosNivelGradId =
            'p4a702dYbzM9l5WZwmxEeok6x2eOrGQVqJgDy8AvXpB1NjLRK3'
        let params = new HttpParams()
        params = params.set(
            'tipo_pregunta',
            this.formCriterios.get('ddTipoPregunta')?.value
        )

        if (this.formCriterios.get('ddCompetencia')?.value != null) {
            params = params.set(
                'competencia',
                this.formCriterios.get('ddCompetencia')?.value
            )
        }
        if (this.formCriterios.get('ddAnioEvaluacion')?.value != null) {
            params = params.set(
                'anio_evaluacion',
                this.formCriterios.get('ddAnioEvaluacion')?.value
            )
        }
        if (this.formCriterios.get('ddNivelEvaluacion')?.value != null) {
            params = params.set(
                'nivel_evaluacion',
                this.formCriterios.get('ddNivelEvaluacion')?.value
            )
        }
        if (this.formCriterios.get('ddCapacidad')?.value != null) {
            params = params.set(
                'capacidad',
                this.formCriterios.get('ddCapacidad')?.value
            )
        }
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
