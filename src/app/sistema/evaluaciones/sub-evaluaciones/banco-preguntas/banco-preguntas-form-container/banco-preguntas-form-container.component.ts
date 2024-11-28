import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
    crearFormularioBaseEncabezado,
    crearFormularioBaseInformacionPregunta,
} from '../models/formulario-base'
import { BancoPreguntasFormComponent } from '../banco-preguntas-form/banco-preguntas-form.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { Subject, takeUntil } from 'rxjs'
import { sinEncabezadoObj } from '../components/banco-pregunta-encabezado-form/banco-pregunta-encabezado-form.component'

@Component({
    selector: 'app-banco-preguntas-form-container',
    standalone: true,
    imports: [CommonModule, BancoPreguntasFormComponent],
    templateUrl: './banco-preguntas-form-container.component.html',
    styleUrl: './banco-preguntas-form-container.component.scss',
})
export class BancoPreguntasFormContainerComponent implements OnInit {
    public tipoPreguntas = []
    private _formBuilder = inject(FormBuilder)
    public bancoPreguntasForm: FormGroup
    private _config = inject(DynamicDialogConfig)
    private _ref = inject(DynamicDialogRef)
    private _evaluacionesService = inject(ApiEvaluacionesRService)

    private unsubscribe$: Subject<boolean> = new Subject()

    public encabezados = []
    public encabezadosFiltered = []
    public pregunta
    public encabezadoMode: 'COMPLETADO' | 'EDITAR' = 'EDITAR'

    public modePregunta: 'CREAR' | 'EDITAR' = 'CREAR'
    private params = {}
    public iEvaluacionId = this._config.data.iEvaluacionId //Aqui viene desde el Banco-Preguntas
    constructor() {
        this.inicializarFormulario()
    }

    ngOnInit() {
        this.getData()
        console.log('Data de Banco preguntas Llega', this._config)
        this.tipoPreguntas = this._config.data.tipoPreguntas.filter((item) => {
            return item.iTipoPregId !== 0
        })
        if (this._config.data.pregunta.iPreguntaId == 0) {
            this.modePregunta = 'CREAR'
        } else {
            this.modePregunta = 'EDITAR'
            this.encabezadoMode = 'COMPLETADO'
        }
        this.pregunta = this._config.data.pregunta

        // Aquí verificamos que el iEvaluacionId llega correctamente
        console.log('iEvaluacionId recibido en Form:', this.iEvaluacionId) // Asegúrate de que esta línea sea correcta
    }

    getData() {
        this.obtenerEncabezados()
    }

    obtenerEncabezados() {
        const params = {
            iCursoId: this._config.data.iCursoId,
            iNivelGradoId: 1,
            iEspecialistaId: 1,
        }
        this._evaluacionesService
            .obtenerEncabezadosPreguntas(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.encabezados = data
                    this.encabezadosFiltered = [
                        sinEncabezadoObj,
                        ...this.encabezados,
                    ]
                },
            })
    }

    obtenerPreguntasPorEncabezado(iEncabPregId) {
        const params = {
            iEncabPregId,
        }
        this._evaluacionesService
            .obtenerBancoPreguntas(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data) => {
                    if (data.length > 0) {
                        this.pregunta = undefined
                        this.pregunta = data[0]
                    }
                },
            })
    }

    inicializarFormulario() {
        this.bancoPreguntasForm = this._formBuilder.group({
            0: crearFormularioBaseEncabezado(this._formBuilder),
            1: crearFormularioBaseInformacionPregunta(this._formBuilder, false),
            2: this._formBuilder.group({
                alternativas: [[]],
            }),
        })
    }

    guardarBancoPreguntas(data) {
        // Aqui se puede poner datos agregados en data para insertar en la base de datos
        data.iCursoId = 3
        data.iNivelGradoId = 1
        data.iEspecialistaId = 1
        //console.table(data)
        this._evaluacionesService
            .guardarActualizarPreguntaConAlternativas(data)
            .subscribe({
                next: () => {
                    this.closeModal(data)
                    console.log('GuardarBancoPreguntas exitosa', data)
                },
            })
    }

    closeModal(data) {
        this._ref.close(data)
    }
}
