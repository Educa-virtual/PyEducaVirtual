import { Component, OnInit, inject } from '@angular/core'
import { Button } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'
import { FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'

import { AlternativasComponent } from './alternativas/alternativas.component'
import { CompetenciasComponent } from '../competencias/competencias.component'

import {
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
    ],
    styleUrls: ['./banco-preguntas.component.scss'],
})
export class BancoPreguntasComponent implements OnInit {
    private _dialogService = inject(DialogService)

    public competencias = []
    public capacidades = []
    public desempenios = []

    selectedItems = []
    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Asignar',
            text: 'Asignar',
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

    data = [
        {
            id: 1,
            cPregunta: 'Pregunta 1',
            tiempo: '0h 2m 0s',
            iPreguntaPeso: '2',
        },
        {
            id: 2,
            cPregunta: 'Pregunta 2',
            tiempo: '0h 2m 0s',
            iPreguntaPeso: '2',
        },
    ]

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
            field: 'tiempo',
            header: 'Tiempo',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Puntaje',
        },

        {
            field: 'iPreguntaPeso',
            header: 'Puntaje',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: 'Puntaje',
        },
    ]
    constructor() {}

    ngOnInit() {
        this.competencias = [
            {
                iCompentenciaId: 0,
                cCompetenciaDescripcion: 'Sin Asignar',
            },
            {
                iCompentenciaId: 1,
                cCompetenciaDescripcion: 'Capacidad 1',
            },
        ]
        this.capacidades = [
            {
                iCapacidadId: 0,
                cCapacidadDescripcion: 'Sin Asignar',
            },
            {
                iCapacidadId: 1,
                cCapacidadDescripcion:
                    'Comunica su comprensión sobrelos números y las operacione',
            },
        ]
    }

    setSelectedItems(event) {
        this.selectedItems = event
    }

    accionBtnItem(action) {
        if (action.accion === 'agregar') {
            this.agregarPregunta()
        }
        if (action.accion === 'asignar') {
            this.asignarPreguntas()
        }
    }

    asignarPreguntas() {
        if (this.selectedItems.length === 0) {
            return
        }
        this._dialogService.open(AsignarMatrizPreguntasFormComponent, {
            ...MODAL_CONFIG,
            data: this.selectedItems,
            header: 'Asignar preguntas',
        })
    }

    agregarPregunta() {
        this._dialogService.open(BancoPreguntasFormComponent, {
            ...MODAL_CONFIG,
            header: 'Nueva pregunta',
        })
    }
}
