//Agregar Servicio de Evaluacion
import { CompartirIdEvaluacionService } from './../../../services/ereEvaluaciones/compartir-id-evaluacion.service'
import { Component, inject, OnInit } from '@angular/core'

/*BOTONES */
import { ButtonModule } from 'primeng/button'

/*MODAL */
import { DialogModule } from 'primeng/dialog'

/*INPUT TEXT */
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'

//TAB
import { TabViewModule } from 'primeng/tabview'
import { DropdownModule } from 'primeng/dropdown'

import { IeparticipaComponent } from '../ieparticipa/ieparticipa.component'

import { EvaluacionAreasComponent } from './../evaluacion-areas/evaluacion-areas.component'

import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { Subject, takeUntil } from 'rxjs'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { StepperModule } from 'primeng/stepper'
import { CommonModule } from '@angular/common'

interface TipoEvaluacion {
    idTipoEvalId: number
    cTipoEvalDescripcion: string
}
interface NivelEvaluacion {
    iNivelEvalId: number
    cNivelEvalNombre: string
}

@Component({
    selector: 'app-evaluaciones-form',
    standalone: true,
    imports: [
        ButtonModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        FormsModule,
        TabViewModule,
        IeparticipaComponent,
        DropdownModule,
        CommonInputComponent,
        ReactiveFormsModule,
        EvaluacionAreasComponent,
        StepperModule,
        CommonModule,
    ],
    templateUrl: './evaluaciones-form.component.html',
    styleUrl: './evaluaciones-form.component.scss',
})
export class EvaluacionesFormComponent implements OnInit {
    private _formBuilder = inject(FormBuilder)
    private _ref = inject(DynamicDialogRef)

    public evaluacionFormGroup: any

    private unsubscribe$: Subject<boolean> = new Subject()
    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }
    public data = []
    private _apiEre = inject(ApiEvaluacionesRService)
    tipoEvaluacion: TipoEvaluacion[] | undefined
    iEvaluacionId: any
    selectedTipoEvaluacion: TipoEvaluacion | undefined
    nivelEvaluacion: NivelEvaluacion[] | undefined
    selectedNivelEvaluacion: TipoEvaluacion | undefined
    fecha: string
    visible: boolean = false
    value!: string
    accion: string
    //Agregar Servicio de Evaluacion
    constructor(
        private _config: DynamicDialogConfig, // Inyección de configuración
        private compartirIdEvaluacionService: CompartirIdEvaluacionService // Inyección del servicio
    ) {}
    // convertToDate(dateString: string | null): Date | null {
    //     if (!dateString) return null // Manejar null
    //     const [day, month, year] = dateString.split('/') // Asumiendo que el formato es 'dd/MM/yyyy'
    //     return new Date(+year, +month - 1, +day) // Recuerda que los meses son indexados desde 0
    // }
    ngOnInit() {
        this.accion = this._config.data.accion
        this.obtenerTipoEvaluacion()
        this.obtenerNivelEvaluacion()
        this.ereCrearFormulario()
        this.ereVerEvaluacion()

        //this.accion = this._config.data.accion // Inicializa la acción

        if (this.accion === 'editar' || this.accion === 'ver') {
            this.ereVerEvaluacion() // Carga los datos si está en modo ver o editar
        }
    }
    ereCrearFormulario() {
        this.evaluacionFormGroup = this._formBuilder.group({
            iEvaluacionId: [null],
            idTipoEvalId: [null, [Validators.required]],
            iNivelEvalId: [null, [Validators.required]],
            cEvaluacionNombre: [null, [Validators.required]],
            cEvaluacionDescripcion: [null, [Validators.required]],
            cEvaluacionUrlDrive: [null, [Validators.required]],
            cEvaluacionUrlPlantilla: [null, [Validators.required]],
            cEvaluacionUrlManual: [null, [Validators.required]],
            cEvaluacionUrlMatriz: [null, [Validators.required]],
            cEvaluacionObs: [null],
            dtEvaluacionCreacion: [null, Validators.required],
            dtEvaluacionLiberarMatriz: [null, Validators.required],
            dtEvaluacionLiberarCuadernillo: [null, Validators.required],
            dtEvaluacionLiberarResultados: [null, Validators.required],
        })
    }
    ereVerEvaluacion() {
        const evaluacionData = this._config.data.evaluacion // Obtener los datos del modal

        if (evaluacionData) {
            console.log(evaluacionData.dtEvaluacionCreacion)
            this.evaluacionFormGroup.patchValue({
                iEvaluacionId: evaluacionData.iEvaluacionId,
                idTipoEvalId: evaluacionData.idTipoEvalId,
                iNivelEvalId: evaluacionData.iNivelEvalId,
                cEvaluacionNombre: evaluacionData.cEvaluacionNombre,
                cEvaluacionDescripcion: evaluacionData.cEvaluacionDescripcion,
                cEvaluacionUrlDrive: evaluacionData.cEvaluacionUrlDrive,
                cEvaluacionUrlPlantilla: evaluacionData.cEvaluacionUrlPlantilla,
                cEvaluacionUrlManual: evaluacionData.cEvaluacionUrlManual,
                cEvaluacionUrlMatriz: evaluacionData.cEvaluacionUrlMatriz,
                cEvaluacionObs: evaluacionData.cEvaluacionObs,
                dtEvaluacionCreacion: evaluacionData.dtEvaluacionCreacion,
                dtEvaluacionLiberarMatriz:
                    evaluacionData.dtEvaluacionLiberarMatriz,
                dtEvaluacionLiberarCuadernillo:
                    evaluacionData.dtEvaluacionLiberarCuadernillo,
                dtEvaluacionLiberarResultados:
                    evaluacionData.dtEvaluacionLiberarResultados,
            })
        }
    }
    // guardarEvaluacion() {
    //     const data = {
    //         idTipoEvalId: this.evaluacionFormGroup.get('idTipoEvalId').value,
    //         iNivelEvalId: this.evaluacionFormGroup.get('iNivelEvalId').value,
    //         dtEvaluacionCreacion: this.evaluacionFormGroup.get(
    //             'dtEvaluacionCreacion'
    //         ).value,
    //         cEvaluacionNombre:
    //             this.evaluacionFormGroup.get('cEvaluacionNombre').value,
    //         cEvaluacionDescripcion: this.evaluacionFormGroup.get(
    //             'cEvaluacionDescripcion'
    //         ).value,
    //         cEvaluacionUrlDrive: this.evaluacionFormGroup.get(
    //             'cEvaluacionUrlDrive'
    //         ).value,
    //         cEvaluacionUrlPlantilla: this.evaluacionFormGroup.get(
    //             'cEvaluacionUrlPlantilla'
    //         ).value,
    //         cEvaluacionUrlManual: this.evaluacionFormGroup.get(
    //             'cEvaluacionUrlManual'
    //         ).value,
    //         cEvaluacionUrlMatriz: this.evaluacionFormGroup.get(
    //             'cEvaluacionUrlMatriz'
    //         ).value,
    //         cEvaluacionObs:
    //             this.evaluacionFormGroup.get('cEvaluacionObs').value,
    //         dtEvaluacionLiberarMatriz: this.evaluacionFormGroup.get(
    //             'dtEvaluacionLiberarMatriz'
    //         ).value,
    //         dtEvaluacionLiberarCuadernillo: this.evaluacionFormGroup.get(
    //             'dtEvaluacionLiberarCuadernillo'
    //         ).value,
    //         dtEvaluacionLiberarResultados: this.evaluacionFormGroup.get(
    //             'dtEvaluacionLiberarResultados'
    //         ).value,
    //     }
    //     console.log(data)
    //     this._apiEre
    //         .guardarEvaluacion(data)
    //         .pipe(takeUntil(this.unsubscribe$))
    //         .subscribe({
    //             next: (resp: any) => {
    //                 this.iEvaluacionId = resp['data'][0]['iEvaluacionId'] // Captura el ID generado
    //                 this.compartirIdEvaluacionService.iEvaluacionId =
    //                     this.iEvaluacionId // Guardar en el servicio
    //                 console.log(
    //                     'ID de Evaluación guardado:',
    //                     this.iEvaluacionId
    //                 )
    //                 this.iEvaluacionId = resp['data'][0]['iEvaluacionId']
    //                 //alert(JSON.stringify(this.data))
    //                 //this.sourceProducts = this.data
    //             },
    //             error: (error) => {
    //                 console.error('Error al guardar la evaluación:', error) // Captura el error aquí
    //                 alert('Error en el servidor: ' + JSON.stringify(error))
    //             },
    //         })
    // }
    guardarEvaluacion() {
        const data = {
            iEvaluacionId: this.evaluacionFormGroup.get('iEvaluacionId').value,
            idTipoEvalId: this.evaluacionFormGroup.get('idTipoEvalId').value,
            iNivelEvalId: this.evaluacionFormGroup.get('iNivelEvalId').value,
            dtEvaluacionCreacion: this.evaluacionFormGroup.get(
                'dtEvaluacionCreacion'
            ).value,
            cEvaluacionNombre:
                this.evaluacionFormGroup.get('cEvaluacionNombre').value,
            cEvaluacionDescripcion: this.evaluacionFormGroup.get(
                'cEvaluacionDescripcion'
            ).value,
            cEvaluacionUrlDrive: this.evaluacionFormGroup.get(
                'cEvaluacionUrlDrive'
            ).value,
            cEvaluacionUrlPlantilla: this.evaluacionFormGroup.get(
                'cEvaluacionUrlPlantilla'
            ).value,
            cEvaluacionUrlManual: this.evaluacionFormGroup.get(
                'cEvaluacionUrlManual'
            ).value,
            cEvaluacionUrlMatriz: this.evaluacionFormGroup.get(
                'cEvaluacionUrlMatriz'
            ).value,
            cEvaluacionObs:
                this.evaluacionFormGroup.get('cEvaluacionObs').value,
            dtEvaluacionLiberarMatriz: this.evaluacionFormGroup.get(
                'dtEvaluacionLiberarMatriz'
            ).value,
            dtEvaluacionLiberarCuadernillo: this.evaluacionFormGroup.get(
                'dtEvaluacionLiberarCuadernillo'
            ).value,
            dtEvaluacionLiberarResultados: this.evaluacionFormGroup.get(
                'dtEvaluacionLiberarResultados'
            ).value,
        }

        // if (this.accion === 'editar') {
        //     // Lógica para actualizar
        //     this.iEvaluacionId =
        //         this.evaluacionFormGroup.get('iEvaluacionId').value
        //     console.log('aqui va las fechas', data)
        //     console.log('aqui va el id', this.iEvaluacionId)
        //     this._apiEre.actualizarEvaluacion(data).subscribe(
        //         (resp: any) => {
        //             console.log('Evaluación actualizada', resp)
        //         },
        //         (error) => {
        //             console.error(
        //                 'Error al actualizar la evaluación asdzxc:',
        //                 error
        //             )
        //         }
        //     )
        // } else {
        //     // Lógica para guardar una nueva evaluación
        //     this._apiEre.guardarEvaluacion(data).subscribe(
        //         (resp: any) => {
        //             console.log('Nueva evaluación guardada', resp)
        //         },
        //         (error) => {
        //             console.error('Error al guardar la evaluación:', error)
        //         }
        //     )
        // }
        if (this.accion === 'editar') {
            // Lógica para actualizar
            this.iEvaluacionId =
                this.evaluacionFormGroup.get('iEvaluacionId').value
            console.log('ID para actualizar:', this.iEvaluacionId)

            if (!this.iEvaluacionId) {
                console.error('El ID de evaluación es undefined o null')
                return // Salir si el ID no es válido
            }

            // Agregar el ID al objeto data
            data.iEvaluacionId = this.iEvaluacionId

            console.log('Datos a enviar para actualización:', data)
            this._apiEre.actualizarEvaluacion(data).subscribe(
                (resp: any) => {
                    console.log('Evaluación actualizada', resp)
                },
                (error) => {
                    console.error('Error al actualizar la evaluación:', error)
                    if (error.error) {
                        console.error('Detalles del error:', error.error) // Captura detalles adicionales del error
                    }
                }
            )
        } else {
            // Lógica para guardar una nueva evaluación
            console.log('Datos a enviar para nueva evaluación:', data)
            this._apiEre.guardarEvaluacion(data).subscribe(
                (resp: any) => {
                    console.log('Nueva evaluación guardada', resp)
                },
                (error) => {
                    console.error('Error al guardar la evaluación:', error)
                    if (error.error) {
                        console.error('Detalles del error:', error.error) // Captura detalles adicionales del error
                    }
                }
            )
        }
    }
    obtenerTipoEvaluacion() {
        this._apiEre
            .obtenerTipoEvaluacion(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    this.tipoEvaluacion = resp['data']
                },
            })
    }

    obtenerNivelEvaluacion() {
        this._apiEre
            .obtenerNivelEvaluacion(this.params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    this.nivelEvaluacion = resp['data']
                },
            })
    }
    onchange() {
        //alert(JSON.stringify(this.selectedTipoEvaluacion))
        //alert(this.fecha)
    }

    closeModal(data) {
        this._ref.close(data)
        console.log('Formulario de evaluación cancelado')

        // Resetear el formulario si es necesario
        this.evaluacionFormGroup.reset()
    }
}
