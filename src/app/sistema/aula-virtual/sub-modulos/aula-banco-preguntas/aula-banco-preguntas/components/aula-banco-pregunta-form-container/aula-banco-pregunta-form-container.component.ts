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

    private unsubscribe$: Subject<boolean> = new Subject()

    public encabezados = []
    public encabezadosFiltered = []
    public pregunta

    public modePregunta: 'CREAR' | 'EDITAR' = 'CREAR'
    private params = {}

    constructor() {
        this.inicializarFormulario()
    }

    ngOnInit() {
        this.getData()
        this.tipoPreguntas = this._config.data.tipoPreguntas.filter((item) => {
            return item.iTipoPregId !== 0
        })
        this.pregunta = this._config.data.pregunta

        if (this.pregunta.iPreguntaId == 0) {
            this.modePregunta = 'CREAR'
        } else {
            this.modePregunta = 'EDITAR'
        }
    }

    getData() {
        this.obtenerEncabezados()
    }

    obtenerEncabezados() {
        const params = {
            iCursoId: this._config.data.iCursoId,
            iNivelCicloId: 1,
            iEspecialistaId: 1,
            iDocenteId: 1,
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

    inicializarFormulario() {
        this.bancoPreguntasForm = this._formBuilder.group({
            0: crearFormularioBaseEncabezado(this._formBuilder),
            1: crearFormularioBaseInformacionPregunta(this._formBuilder),
            2: this._formBuilder.group({
                alternativas: [[]],
            }),
        })
    }

    guardarBancoPreguntas(data) {
        this._aulaBancoPreguntasService
            .guardarActualizarPreguntaConAlternativas(data)
            .subscribe({
                next: () => {
                    this.closeModal(data)
                },
            })
    }

    closeModal(data) {
        this._ref.close(data)
    }
}
