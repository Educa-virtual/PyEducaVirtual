import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import {
    IColumn,
    TablePrimengComponent,
} from '../../../../../shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-asignar-matriz-preguntas-form',
    standalone: true,
    imports: [
        CommonModule,
        DropdownModule,
        ButtonModule,
        TablePrimengComponent,
    ],
    templateUrl: './asignar-matriz-preguntas-form.component.html',
    styleUrl: './asignar-matriz-preguntas-form.component.scss',
})
export class AsignarMatrizPreguntasFormComponent implements OnInit {
    public competencias = []
    public capacidades = []
    public desempenios = []
    public preguntas = []
    private selectedPreguntas = []

    private _config = inject(DynamicDialogConfig)
    private ref = inject(DynamicDialogRef)

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

    ngOnInit() {
        this.competencias = [
            {
                iCompentenciaId: 1,
                cCompetenciaDescripcion: 'Capacidad 1',
            },
        ]
        this.preguntas = this._config.data.map((item) => {
            item.checked = true
            return item
        })
        this.selectedPreguntas = this.preguntas
    }

    setSelectedItems(event) {
        this.selectedPreguntas = event
    }

    closeModal(data) {
        this.ref.close(data)
    }
}
