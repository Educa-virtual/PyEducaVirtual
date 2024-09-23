import { Component, OnInit, inject, OnDestroy } from '@angular/core'
import { Button } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'

import { AlternativasComponent } from './alternativas/alternativas.component'
import { CompetenciasComponent } from '../competencias/competencias.component'

import {
    IActionTable,
    IColumn,
    TablePrimengComponent,
} from '../../../../shared/table-primeng/table-primeng.component'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import { provideIcons } from '@ng-icons/core'
import { matGroupWork } from '@ng-icons/material-icons/baseline'
import { DialogService } from 'primeng/dynamicdialog'
import { BancoPreguntasFormComponent } from '../banco-preguntas/banco-preguntas-form/banco-preguntas-form.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { AsignarMatrizPreguntasFormComponent } from './asignar-matriz-preguntas-form/asignar-matriz-preguntas-form.component'
import { MessageService } from 'primeng/api'
import { ApiEreService } from '../../services/api-ere.service'

import dayjs from 'dayjs'
import { FloatLabelModule } from 'primeng/floatlabel'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-banco-preguntas',
    templateUrl: './banco-preguntas.component.html',
    providers: [provideIcons({ matGroupWork }), DialogService, MessageService],
    standalone: true,
    imports: [
        AlternativasComponent,
        CompetenciasComponent,
        InputTextModule,
        MultiSelectModule,
        FormsModule,
        DropdownModule,
        ContainerPageComponent,
        Button,
        TablePrimengComponent,
        FloatLabelModule,
    ],
    styleUrls: ['./banco-preguntas.component.scss'],
})
export class BancoPreguntasComponent implements OnInit, OnDestroy {
    private _dialogService = inject(DialogService)
    private _apiEre = inject(ApiEreService)
    private unsubscribe$: Subject<boolean> = new Subject()

    public competencias = []
    public capacidades = []
    public desempenios = []
    public estados = []

    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }

    selectedItems = []
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Asignar Matriz',
            text: 'Asignar Matriz',
            icon: {
                name: 'matGroupWork',
                size: 'xs',
                color: '',
            },
            accion: 'asignar',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Agregar Pregunta',
            text: 'Agregar Pregunta',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-secondary',
        },
    ]

    data = [{ id: 0 }, { id: 1 }, { id: 2 }]

    columnas: IColumn[] = [
        {
            field: 'checked',
            header: '',
            type: 'checkbox',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
        {
            field: 'cPregunta',
            header: 'Pregunta',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Pregunta',
        },
        {
            field: 'time',
            header: 'Tiempo',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Tiempo',
        },

        {
            field: 'iPreguntaPeso',
            header: 'Puntaje',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Puntaje',
        },
        {
            field: 'iPreguntaNivel',
            header: 'Nivel',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Nivel',
        },
        {
            field: 'cPreguntaClave',
            header: 'Clave',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Clave',
        },
        {
            field: 'bPreguntaEstado',
            header: 'Estado',
            type: 'estado',
            width: '5rem',
            text: 'left',
            text_header: 'Estado',
            customFalsy: {
                trueText: 'Con Matriz',
                falseText: 'Sin Matriz',
            },
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

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Asignar Matriz',
            icon: {
                name: 'matGroupWork',
                size: 'xs',
            },
            accion: 'agregar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]
    constructor() {}

    ngOnInit() {
        this.competencias = [
            {
                iCompentenciaId: 0,
                cCompetenciaDescripcion: 'Todos',
            },
        ]

        this.estados = [
            {
                bPreguntaEstado: -1,
                cDSC: 'Todos',
            },
            {
                bPreguntaEstado: 0,
                cDSC: 'Sin Asignar',
            },
            {
                bPreguntaEstado: 1,
                cDSC: 'Asignado',
            },
        ]
        this.capacidades = [
            {
                iCapacidadId: 0,
                cCapacidadDescripcion: 'Todos',
            },
        ]

        // this.obtenerBancoPreguntas()
        // this.obtenerCompetencias()
    }

    obtenerBancoPreguntas() {
        this._apiEre
            .obtenerBancoPreguntas(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    resp['data'] = resp['data'].map((item) => {
                        const time = dayjs(item.dtPreguntaTiempo)
                        const hours = time.get('hour')
                        const minutes = time.get('minute')
                        const seconds = time.get('second')
                        item.time = `${hours}h ${minutes}m ${seconds}s`
                        item.bPreguntaEstado = parseInt(
                            item.bPreguntaEstado,
                            10
                        )
                        return item
                    })
                    this.data = resp['data']
                },
            })
    }

    obtenerCompetencias() {
        this._apiEre
            .obtenerCompetencias(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    this.competencias = resp['data']
                    this.competencias.unshift({
                        iCompentenciaId: 0,
                        cCompetenciaDescripcion: 'Todos',
                    })
                },
            })
    }

    obtenerCapacidades() {
        this._apiEre
            .obtenerCapacidades(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    this.capacidades = resp['data']
                    this.capacidades.unshift({
                        iCapacidadId: 0,
                        cCapacidadDescripcion: 'Todos',
                    })
                },
            })
    }

    // manejar las acciones
    accionBtnItem(action) {
        if (action.accion === 'agregar') {
            this.agregarPregunta()
        }
        if (action.accion === 'asignar') {
            this.asignarPreguntas()
        }
    }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'agregar') {
            this.selectedItems = []
            this.selectedItems = [item]
            this.asignarPreguntas()
        }
    }

    // abrir el modal para asignar preguntas
    asignarPreguntas() {
        if (this.selectedItems.length === 0) {
            return
        }
        const refModal = this._dialogService.open(
            AsignarMatrizPreguntasFormComponent,
            {
                ...MODAL_CONFIG,
                data: this.selectedItems,
                header: 'Asignar preguntas',
            }
        )

        refModal.onClose.subscribe((result) => {
            if (result) {
                this.obtenerBancoPreguntas()
            }
            // this.selectedItems = []
        })
    }

    // abrir el modal para agregar una nueva pregunta
    agregarPregunta() {
        this._dialogService.open(BancoPreguntasFormComponent, {
            ...MODAL_CONFIG,
            header: 'Nueva pregunta',
        })
    }

    // desuscribirse de los observables cuando se destruye el componente
    ngOnDestroy(): void {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
