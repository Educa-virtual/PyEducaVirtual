import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import {
    IColumn,
    TablePrimengComponent,
} from '../../../../../shared/table-primeng/table-primeng.component'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'

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
    // injeccion de depdencias
    private formBuilder = inject(FormBuilder)
    private selectedPreguntas = []
    private _config = inject(DynamicDialogConfig)
    private _ref = inject(DynamicDialogRef)
    private _apiEre = inject(ApiEvaluacionesRService)

    public competencias = []
    public capacidades = []
    public desempenos = []
    public preguntas = []
    public selectedDesempeno
    public formAsignarMatriz: FormGroup = this.formBuilder.group({
        iDesempenoId: [null, Validators.required],
    })

    // columnas de l atabla desempeño
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

    // columnas de la tabla desempeño
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
            type: 'p-editor',
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
        const preguntas = this._config.data.preguntas

        //  mapear las preguntas si es con cabecera o no
        preguntas.forEach((item) => {
            if (item.iEncabPregId == -1) {
                this.preguntas = [...this.preguntas, item]
            } else {
                this.preguntas = [...this.preguntas, ...item.preguntas]
            }
        })

        this.desempenos = this._config.data.desempenos
        let iDesempenoId = 0

        // marcar el desempeno por defecto
        this.preguntas = this.preguntas.map((item) => {
            item.checked = true
            if (item.iDesempenoId != null) {
                iDesempenoId = item.iDesempenoId
            }
            return item
        })

        this.desempenos = this.desempenos.map((item) => {
            if (item.iDesempenoId == iDesempenoId) {
                item.checked = true
            }
            return item
        })

        this.selectedDesempeno = this.desempenos.find(
            (item) => item.iDesempenoId == iDesempenoId
        )

        this.selectedPreguntas = this.preguntas
    }

    setSelectedItems(event) {
        this.selectedPreguntas = event
    }

    onSelectDesempeno(event) {
        this.selectedDesempeno = event
        this.formAsignarMatriz
            .get('iDesempenoId')
            .setValue(this.selectedDesempeno['iDesempenoId'])
    }

    closeModal(data) {
        this._ref.close(data)
    }

    // asignar matriz de preguntas a las preguntas seleccionadas
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

        this._apiEre.actualizarMatrizPreguntas(data).subscribe({
            next: () => {
                this.closeModal(data)
            },
        })
    }
}
