import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
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
    @Input() payload: any //!ATRAE DE PADRE 1
    recibirPayloadForms: any

    private _apiEre = inject(ApiEvaluacionesRService)
    iDesempenoId: number
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
            console.log(
                'Editar Pregunta: ',
                this._config.data.pregunta.iPreguntaId
            )
            this.modePregunta = 'EDITAR'
            this.encabezadoMode = 'COMPLETADO'

            console.log('Modo Pregunta Editar: ', this.modePregunta)
        }
        this.pregunta = this._config.data.pregunta

        // Aquí verificamos que el iEvaluacionId llega correctamente
        console.log('iEvaluacionId recibido en Form:', this.iEvaluacionId) // Asegúrate de que esta línea sea correcta
        console.log('Payload recibido en el segundo padre:', this.payload)
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

    // guardarConFlujoEncadenado(data: any) {
    //     console.log(
    //         'Valor actual de this.recibirPayloadForms:',
    //         this.recibirPayloadForms
    //     )
    //     if (this.recibirPayloadForms) {
    //         console.log(
    //             'Insertando datos en el desempeño:',
    //             this.recibirPayloadForms
    //         )
    //         // Llamar al servicio para insertar en la tabla "desempeños"
    //         this._apiEre
    //             .insertarMatrizDesempeno(this.recibirPayloadForms) // Paso 1: Insertar desempeño
    //             .pipe(
    //                 takeUntil(this.unsubscribe$), // Limpiar suscripciones
    //                 switchMap((resp: any) => {
    //                     // Extraer el ID generado
    //                     const iiDesempenoId = resp?.iDesempenoId
    //                     console.log('ID generado:', iiDesempenoId)

    //                     // Validar que el ID exista
    //                     if (!iiDesempenoId) {
    //                         throw new Error(
    //                             'No se generó un iDesempeñoId válido.'
    //                         )
    //                     }
    //                     // Convertir iDesempenoId a entero
    //                     const iiiDesempenoId = parseInt(iiDesempenoId, 10) // Asegurarse de que sea un número
    //                     console.log(
    //                         'ID de Desempeño recibido (convertido a número):',
    //                         iiiDesempenoId
    //                     )

    //                     // Agregar el iDesempenoId al objeto `data` recibido
    //                     data.iDesempenoId = iiiDesempenoId
    //                     data.iCursosNivelGradId = 6 // Con esto al momento de guardar, la pregunta se ira al curso correspondiente.
    //                     data.iNivelGradoId = 1
    //                     data.iEspecialistaId = 2

    //                     console.log(
    //                         'Datos listos para guardar preguntas:',
    //                         data
    //                     )

    //                     // Paso 2: Guardar en el banco de preguntas
    //                     return this._evaluacionesService.guardarActualizarPreguntaConAlternativas(
    //                         data
    //                     )
    //                 })
    //             )
    //             .subscribe({
    //                 next: () => {
    //                     console.log('Flujo completo: Guardar pregunta exitosa')
    //                     this.closeModal(data) // Cerrar modal opcionalmente
    //                 },
    //                 error: (err) => {
    //                     console.error('Error en el flujo de inserción:', err)
    //                     console.warn('Datos enviados:', data)
    //                 },
    //             })
    //     } else {
    //         console.log('No se ha recibido el payload aún.')
    //     }
    // }

    // guardarBancoPreguntas(data) {
    //     // Aqui se puede poner datos agregados en data para insertar en la base de datos
    //     //data.iCursoId = 3
    //     data.iCursosNivelGradId = 6
    //     data.iNivelGradoId = 1
    //     data.iEspecialistaId = 1
    //     //console.table(data)
    //     this._evaluacionesService
    //         .guardarActualizarPreguntaConAlternativas(data)
    //         .subscribe({
    //             next: () => {
    //                 this.closeModal(data)
    //                 console.log('GuardarBancoPreguntas exitosa', data)
    //             },
    //         })
    // }

    //Atreae padre 1
    recibirPayloadForm(payloadEmitidoForms: any) {
        console.log(
            'Payload recibido desde el banco-preguntas-form >>>:',
            payloadEmitidoForms
        )
        // Crear una copia modificada
        this.recibirPayloadForms = {
            ...payloadEmitidoForms, // Copia todas las propiedades originales
            iEvaluacionId: 679, // Aqui cambiamos el ID de evaluacion
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

                        // Paso 2: Preparar el objeto `data` con los valores adicionales
                        data.iDesempenoId = iiiDesempenoId
                        data.iCursosNivelGradId = 6
                        data.iNivelGradoId = 1
                        data.iEspecialistaId = 2

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
            console.log('No se ha recibido el payload aún.')

            // Si no se ha recibido payload, simplemente guardamos preguntas con datos básicos
            data.iCursosNivelGradId = 6
            data.iNivelGradoId = 1
            data.iEspecialistaId = 1

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
