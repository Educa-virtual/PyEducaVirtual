import { ConstantesService } from '@/app/servicios/constantes.service'
import { ApiAulaBancoPreguntasService } from '@/app/sistema/aula-virtual/services/api-aula-banco-preguntas.service'
import { sinEncabezadoObj } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-encabezado-form/banco-pregunta-encabezado-form.component'
import {
    crearFormularioBaseEncabezado,
    crearFormularioBaseInformacionPregunta,
} from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/models/formulario-base'
import { Component, inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-aula-banco-pregunta-form-container',
    templateUrl: './aula-banco-pregunta-form-container.component.html',
    styleUrl: './aula-banco-pregunta-form-container.component.scss',
})
export class AulaBancoPreguntaFormContainerComponent implements OnInit {
    public tipoPreguntas = []
    private _formBuilder = inject(FormBuilder)
    public bancoPreguntasForm: FormGroup
    private _config = inject(DynamicDialogConfig)
    private _ref = inject(DynamicDialogRef)
    private _aulaBancoPreguntasService = inject(ApiAulaBancoPreguntasService)
    private iEvaluacionId = null
    private _constantesService = inject(ConstantesService)
    private unsubscribe$: Subject<boolean> = new Subject()

    public encabezados = []
    public encabezadosFiltered = []
    public pregunta

    public modePregunta: 'CREAR' | 'EDITAR' = 'CREAR'
    public encabezadoMode: 'COMPLETADO' | 'EDITAR' = 'EDITAR'
    private params = {
        iCursoId: null,
        iCurrContId: null,
        iEvaluacionId: 0,
    }

    constructor() {
        this.inicializarFormulario()
    }
    padreComponente: 'AULA-VIRTUAL' | 'BANCO-PREGUNTAS' = 'BANCO-PREGUNTAS'
    ngOnInit() {
        this.getData()
        this.tipoPreguntas = this._config.data.tipoPreguntas.filter((item) => {
            return item.iTipoPregId !== 0
        })
        this.params.iEvaluacionId = this._config.data.iEvaluacionId ?? 0
        this.params.iCursoId = this._config.data.iCursoId
        this.params.iCurrContId = this._constantesService.iCurrContId
        this.padreComponente = this._config.data.padreComponente

        if (this._config.data.pregunta.iPreguntaId == 0) {
            this.modePregunta = 'CREAR'
        } else {
            this.modePregunta = 'EDITAR'
            this.encabezadoMode = 'COMPLETADO'
        }
        this.pregunta = this._config.data.pregunta
    }

    getData() {
        this.obtenerEncabezados()
        this.obtenerTipoPreguntas()
    }

    obtenerEncabezados() {
        const params = {
            iCursoId: this._config.data.iCursoId,
            iNivelCicloId: this._constantesService.iNivelCicloId,
            iDocenteId: this._constantesService.iDocenteId,
        }
        this._aulaBancoPreguntasService
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

    obtenerTipoPreguntas() {
        if (this.tipoPreguntas.length > 0) return
        this._aulaBancoPreguntasService
            .obtenerTipoPreguntas({ bancoTipo: 'aula' })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.tipoPreguntas = data
                },
            })
    }

    inicializarFormulario() {
        this.bancoPreguntasForm = this._formBuilder.group({
            0: crearFormularioBaseEncabezado(this._formBuilder),
            1: crearFormularioBaseInformacionPregunta(this._formBuilder),
            2: this._formBuilder.group({
                alternativas: [[]],
            }),
        })
    }

    obtenerPreguntasPorEncabezado(iEncabPregId) {
        const params = {
            iEncabPregId,
            iCursoId: this.params.iCursoId,
            iDocenteId: this._constantesService.iDocenteId,
        }
        this._aulaBancoPreguntasService
            .obtenerBancoPreguntas(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data) => {
                    if (data.length > 0) {
                        this.pregunta = data
                        console.log(data)
                    }
                },
            })
    }

    guardarBancoPreguntas(data) {
        data.iNivelCicloId = this._constantesService.iNivelCicloId
        data.iDocenteId = this._constantesService.iDocenteId
        data.iCursoId = this.params.iCursoId
        data.iCurrContId = this.params.iCurrContId
        // el iEvaluacionId es usado para agregrarlo directamntee a eval.preguntas si no es 0
        data.iEvaluacionId = this.params.iEvaluacionId
        this._aulaBancoPreguntasService
            .guardarActualizarPreguntaConAlternativas(data)
            .subscribe({
                next: (respData) => {
                    if (respData.length > 0) {
                        respData = respData[0]
                    }
                    this.closeModal(respData)
                },
            })
    }

    closeModal(data) {
        this._ref.close(data)
    }
}
