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
import { Subject, switchMap, takeUntil } from 'rxjs'
import { sinEncabezadoObj } from '../components/banco-pregunta-encabezado-form/banco-pregunta-encabezado-form.component'
import { CompartirFormularioEvaluacionService } from '../../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'
import { CompartirIdEvaluacionService } from '../../../services/ereEvaluaciones/compartir-id-evaluacion.service'

@Component({
    selector: 'app-banco-preguntas-form-container',
    standalone: true,
    imports: [CommonModule, BancoPreguntasFormComponent],
    templateUrl: './banco-preguntas-form-container.component.html',
    styleUrl: './banco-preguntas-form-container.component.scss',
})
export class BancoPreguntasFormContainerComponent implements OnInit {
    areas: any[] = []
    recibirPayloadForms: any
    iDesempenoId: number

    public tipoPreguntas = []
    public encabezados = []
    public encabezadosFiltered = []
    public pregunta
    public encabezadoMode: 'COMPLETADO' | 'EDITAR' = 'EDITAR'
    public modePregunta: 'CREAR' | 'EDITAR' = 'CREAR'
    public iNivelGradoId
    public bancoPreguntasForm: FormGroup

    private params = {}
    private _formBuilder = inject(FormBuilder)
    private _config = inject(DynamicDialogConfig)
    private _ref = inject(DynamicDialogRef)
    private _evaluacionesService = inject(ApiEvaluacionesRService)
    private unsubscribe$: Subject<boolean> = new Subject()
    private _apiEre = inject(ApiEvaluacionesRService)

    constructor(
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService,
        private compartiridEvaluacionService: CompartirIdEvaluacionService
    ) {
        this.inicializarFormulario()
    }

    ngOnInit() {
        console.warn(
            'CURSO GRADO',
            this.compartirFormularioEvaluacionService.getGrado()
        )
        this.getData()
        console.warn('Data de Banco preguntas Llega', this._config)
        console.warn('iCursoNivelGradId :', this._config.data.iCursoNivelGradId)
        console.warn(
            'iCursosNivelGradId:',
            this._config?.data?.iCursosNivelGradId
        )

        this.tipoPreguntas = this._config.data.tipoPreguntas.filter((item) => {
            return item.iTipoPregId !== 0
        })
        if (this._config.data.pregunta.iPreguntaId == 0) {
            this.modePregunta = 'CREAR'
        } else {
            console.log(
                'Editar Pregunta: ',
                this._config.data.pregunta.iPreguntaId
            )
            this.modePregunta = 'EDITAR'
            this.encabezadoMode = 'COMPLETADO'

            console.log('Modo Pregunta Editar: ', this.modePregunta)
        }
        this.pregunta = this._config.data.pregunta
        console.log(
            'Id recibido en evaluacion :',
            this.compartiridEvaluacionService.iEvaluacionIdStorage
        )
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

    recibirPayloadForm(payloadEmitidoForms: any) {
        console.log(
            'Payload recibido desde el banco-preguntas-form >>>:',
            payloadEmitidoForms
        )
        // Crear una copia modificada
        this.recibirPayloadForms = {
            ...payloadEmitidoForms, // Copia todas las propiedades originales
            //iEvaluacionId: 679, // Aqui cambiamos el ID de evaluacion
            iEvaluacionId:
                this.compartiridEvaluacionService.iEvaluacionIdStorage,
        }

        console.log('Payload modificado >>>:', this.recibirPayloadForms)
    }

    guardarPreguntasConFlujo(data: any) {
        console.log(
            'Valor actual de this.recibirPayloadForms:',
            this.recibirPayloadForms
        )

        if (this.recibirPayloadForms) {
            console.log(
                'Insertando datos en el desempeño:',
                this.recibirPayloadForms
            )

            // Llamar al servicio para insertar en la tabla "desempeños"
            this._apiEre
                .insertarMatrizDesempeno(this.recibirPayloadForms) // Paso 1: Insertar desempeño
                .pipe(
                    takeUntil(this.unsubscribe$), // Limpiar suscripciones
                    switchMap((resp: any) => {
                        const iiDesempenoId = resp?.iDesempenoId // Extraer ID

                        console.log(
                            'Respuesta Servidor GuardarPreguntaFlujo: ',
                            resp
                        )
                        console.log('ID generado:', iiDesempenoId)

                        if (!iiDesempenoId) {
                            throw new Error(
                                'No se generó un iDesempeñoId válido.'
                            )
                        }
                        // Convertir ID a número entero
                        const iiiDesempenoId = parseInt(iiDesempenoId, 10)
                        console.log(
                            'ID de Desempeño recibido (convertido a número):',
                            iiiDesempenoId
                        )

                        const iCursoNivelGradId =
                            this._config?.data?.iCursosNivelGradId
                        console.warn('iCursoNivelGradId:', iCursoNivelGradId)
                        // Paso 2: Preparar el objeto `data` con los valores adicionales
                        data.iDesempenoId = iiiDesempenoId
                        data.iCursosNivelGradId = iCursoNivelGradId //En este caso debe ser dinamico, dependiendo de los cursos.
                        data.iNivelGradoId = 1 //Aqui igual Dinamico
                        data.iEspecialistaId = 2 //Aqui igual Dinamico

                        console.log(
                            'Datos listos para guardar preguntas:',
                            data
                        )

                        // Llamada al servicio para guardar preguntas
                        return this._evaluacionesService.guardarActualizarPreguntaConAlternativas(
                            data
                        )
                    })
                )
                .subscribe({
                    next: () => {
                        console.log('Flujo completo: Guardar pregunta exitosa')
                        this.closeModal(data)
                    },
                    error: (err) => {
                        console.error('Error en el flujo de inserción:', err)
                        console.warn('Datos enviados:', data)
                    },
                })
        } else {
            const iCursoNivelGradId = this._config?.data?.iCursosNivelGradId
            console.warn('iCursoNivelGradId:', iCursoNivelGradId)
            data.iDesempenoId = 81
            // Si no se ha recibido payload, simplemente guardamos preguntas con datos básicos
            data.iCursosNivelGradId = iCursoNivelGradId //aqui igual dinamico
            data.iNivelGradoId = 1 //aqui igual dinamico
            data.iEspecialistaId = 2 //aqui igual dinamico

            console.log('Guardando preguntas sin payload de desempeño:', data)

            // Guardar directamente en el banco de preguntas
            this._evaluacionesService
                .guardarActualizarPreguntaConAlternativas(data)
                .subscribe({
                    next: () => {
                        console.log('Guardar banco de preguntas exitosa')
                        this.closeModal(data)
                    },
                    error: (err) => {
                        console.error(
                            'Error al guardar banco de preguntas:',
                            err
                        )
                    },
                })
        }
    }

    closeModal(data) {
        this._ref.close(data)
    }
}
