import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import {
    IColumn,
    TablePrimengComponent,
} from '../../../../../shared/table-primeng/table-primeng.component'
import { ApiEreService } from '../../../services/api-ere.service'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'

@Component({
    selector: 'app-asignar-matriz-preguntas-form',
    standalone: true,
    imports: [
        CommonModule,
        DropdownModule,
        ButtonModule,
        TablePrimengComponent,
        ReactiveFormsModule,
    ],
    templateUrl: './asignar-matriz-preguntas-form.component.html',
    styleUrl: './asignar-matriz-preguntas-form.component.scss',
})
export class AsignarMatrizPreguntasFormComponent implements OnInit {
    private formBuilder = inject(FormBuilder)
    private selectedPreguntas = []
    private _config = inject(DynamicDialogConfig)
    private ref = inject(DynamicDialogRef)
    private apiEre = inject(ApiEreService)

    public competencias = []
    public capacidades = []
    public desempenos = []
    public preguntas = []
    public selectedDesempeno
    public formAsignarMatriz: FormGroup = this.formBuilder.group({
        iDesempenoId: [null, Validators.required],
    })

    public columnasDesempeno: IColumn[] = [
        {
            field: 'radio',
            header: '',
            type: 'radio',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
        {
            field: 'cEvaluacionNombre',
            header: 'Evaluación',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
        {
            field: 'cCapacidadNombre',
            header: 'Capacidad',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
        {
            field: 'cCompetenciaNombre',
            header: 'Competencia',
            type: 'text',
            width: '5rem',
            text: 'left',
            text_header: '',
        },
        {
            field: 'cDesempenoDescripcion',
            header: 'Desempeño',
            type: 'text',
            width: 'auto',
            text: 'left',
            text_header: '',
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

    ngOnInit() {
        this.competencias = [
            {
                iCompentenciaId: 1,
                cCompetenciaDescripcion: 'Capacidad 1',
            },
        ]
        this.capacidades = [
            {
                iCapacidadId: 1,
                cCompetenciaDescripcion: 'Competencia 1',
            },
        ]
        this.desempenos = [
            {
                iDesempenoId: 1,
                cCompetenciaDescripcion: 'Desempeño 1',
            },
        ]
        this.preguntas = this._config.data.preguntas
        this.desempenos = this._config.data.desempenos

        this.preguntas = this.preguntas.map((item) => {
            item.checked = true
            if (item.iDesempenoId != null) {
                this.selectedDesempeno = {
                    iDesempenoId: item.iDesempenoId,
                    checked: true,
                }
            }
            return item
        })
        console.log(this.selectedDesempeno)

        this.selectedPreguntas = this.preguntas
    }

    setSelectedItems(event) {
        this.selectedPreguntas = event
    }

    onSelectDesempeno(event) {
        console.log('select', event)

        this.selectedDesempeno = event
        this.formAsignarMatriz
            .get('iDesempenoId')
            .setValue(this.selectedDesempeno['iDesempenoId'])
    }

    closeModal(data) {
        this.ref.close(data)
    }

    asignarMatrizPreguntas() {
        if (this.formAsignarMatriz.invalid) {
            this.formAsignarMatriz.markAllAsTouched()
            return
        }

        const matriz = this.formAsignarMatriz.value
        const data = { preguntas: [] }
        data.preguntas = this.selectedPreguntas.map((item) => {
            item.datosJson = matriz
            return item
        })

        this.apiEre.actualizarMatrizPreguntas(data).subscribe({
            next: () => {
                this.closeModal(data)
            },
        })
    }
}
