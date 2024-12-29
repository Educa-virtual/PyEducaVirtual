//Agregar Servicio de Evaluacion
//!Se agrego el afterviewinit
import { CompartirIdEvaluacionService } from './../../../services/ereEvaluaciones/compartir-id-evaluacion.service'
//import { CompartirFormularioEvaluacionService } from './../../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'
import { CompartirFormularioEvaluacionService } from './../../../services/ereEvaluaciones/compartir-formulario-evaluacion.service'
import { Component, inject, OnInit, ViewChild } from '@angular/core'

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

import { IeparticipaComponent } from '../ieparticipa/ieparticipa.component' //Referencia Componente IE

import { EvaluacionAreasComponent } from './../evaluacion-areas/evaluacion-areas.component'

import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { Subject, takeUntil } from 'rxjs'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
//Uso para separar y poner en vertical o horizonal
import { DividerModule } from 'primeng/divider'

import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { ScrollPanelModule } from 'primeng/scrollpanel'
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { StepperModule } from 'primeng/stepper'
import { CommonModule } from '@angular/common'
import { TablePrimengComponent } from '../../../../../shared/table-primeng/table-primeng.component'
import { CardModule } from 'primeng/card'
import { StepsModule } from 'primeng/steps'
import { Stepper } from 'primeng/stepper'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { CalendarModule } from 'primeng/calendar'
import { ConstantesService } from '@/app/servicios/constantes.service'

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
        ScrollPanelModule,
        ContainerPageComponent,
        StepsModule,
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
        DividerModule,
        TablePrimengComponent,
        CardModule,
        ToastModule,
        CalendarModule,
    ],
    templateUrl: './evaluaciones-form.component.html',
    styleUrl: './evaluaciones-form.component.scss',
})
export class EvaluacionesFormComponent implements OnInit {
    @ViewChild(EvaluacionAreasComponent)
    evaluacionAreasComponent: EvaluacionAreasComponent

    datosRecIeParticipan: any[] = []
    tipoEvaluacion: TipoEvaluacion[] | undefined
    iEvaluacionId: number
    selectedTipoEvaluacion: TipoEvaluacion | undefined
    nivelEvaluacion: NivelEvaluacion[] | undefined
    selectedNivelEvaluacion: TipoEvaluacion | undefined
    fecha: string
    visible: boolean = false //Accion Editar, Ver, Crear
    value!: string
    accion: string //Accion Editar, Ver, Crear
    activeStep: number = 0 // Paso activo
    totalSteps = 3 // Total de pasos del stepper
    dtEvaluacionCreacion: Date | null = null // Esto guarda la fecha seleccionada
    evaluacionCreadaId: number | null = null // Asegúrate de declararla aquí
    esModoEdicion: boolean = false // Cambiar a true si estás en modo edición

    @ViewChild('stepper') stepper: Stepper

    public evaluacionFormGroup: any
    public params = {
        iCompentenciaId: 0,
        iCapacidadId: 0,
        iDesempenioId: 0,
        bPreguntaEstado: -1,
    }
    public data = []

    private _formBuilder = inject(FormBuilder)
    private _ref = inject(DynamicDialogRef)
    private unsubscribe$: Subject<boolean> = new Subject()
    private _apiEre = inject(ApiEvaluacionesRService)
    private _MessageService = inject(MessageService) //Agregando Mensaje

    // Función para mostrar el valor en la consola
    logCalendarValue() {
        console.log('Valor del calendario:', this.dtEvaluacionCreacion)
    }
    constructor(
        public _config: DynamicDialogConfig, // Inyección de configuración
        private compartirIdEvaluacionService: CompartirIdEvaluacionService, // Inyección del servicio
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService, // Inyección del servicio
        private fb: FormBuilder,
        private constantesService: ConstantesService
    ) {
        // Inicializar formulario reactivo
        this.evaluacionFormGroup = this.fb.group({
            iEvaluacionId: [null],
            idTipoEvalId: [null, [Validators.required]],
            iNivelEvalId: [null, [Validators.required]],
            cEvaluacionNombre: [null, [Validators.required]],
            cEvaluacionDescripcion: [null, [Validators.required]],
            cEvaluacionUrlDrive: [null, [Validators.required]],
            cEvaluacionUrlPlantilla: [null, [Validators.required]],
            cEvaluacionUrlManual: [null, [Validators.required]],
            cEvaluacionUrlMatriz: [null, [Validators.required]],
            cEvaluacionObs: [null, [Validators.required]],
            dtEvaluacionCreacion: [null, Validators.required],
            dtEvaluacionLiberarMatriz: [null, Validators.required],
            dtEvaluacionLiberarCuadernillo: [null, Validators.required],
            dtEvaluacionLiberarResultados: [null, Validators.required],
            iSesionId: [null],
        })
    }

    // Método para enviar el formulario y guardar el dato en el servicio
    onSubmit(): void {
        const nombre = this.evaluacionFormGroup.get('cEvaluacionNombre')?.value
        this.compartirFormularioEvaluacionService.setcEvaluacionNombre(nombre) // Guardar el valor en el servicio
        //console.log('Valor enviado al servicio:', nombre)
    }
    enviarVarlorDesdeForm(): void {
        this.onSubmit()
    }
    //! Función para manejar el botón de "Siguiente"
    handleNext() {
        if (this.activeStep === 0 && this.accion === 'ver') {
            this.evaluacionFormGroup.disable() // Hacer el formulario solo lectura
            //console.log('Formulario DESABILITADO', this.accion)
        }

        if (this.activeStep === 0 && this.accion === 'editar') {
            //! if (this.evaluacionFormGroup.invalid) {
            //     // Marca los campos como tocados para que se muestren los errores
            //     this.evaluacionFormGroup.markAllAsTouched()

            //     // Mostrar mensaje de error
            //     this._MessageService.add({
            //         severity: 'error',
            //         summary: 'Formulario incompleto',
            //         detail: 'Por favor, completa todos los campos obligatorios antes de continuar.',
            //     })
            //     // Detener el flujo
            //     return
            // }
            this.esModoEdicion = true
            this.actualizarEvaluacion()
            //console.log('Formulario EDITAR DESDE HANDLE', this.accion)
        }

        if (this.activeStep === 0 && this.accion === 'nuevo') {
            //! if (this.evaluacionFormGroup.invalid) {
            //     // Marca los campos como tocados para que se muestren los errores
            //     this.evaluacionFormGroup.markAllAsTouched()

            //     // Mostrar mensaje de error
            //     this._MessageService.add({
            //         severity: 'error',
            //         summary: 'Formulario incompleto',
            //         detail: 'Por favor, completa todos los campos obligatorios antes de continuar.',
            //     })
            //     // Detener el flujo
            //     return
            // }
            // Si es válido, guardar la evaluación
            this.guardarEvaluacion()
            this.enviarVarlorDesdeForm()
        }
        // Pasar al siguiente paso
        if (this.activeStep < this.totalSteps - 1) {
            this.activeStep++
            return
        }
    }
    // Función para manejar el botón "Atrás"
    handlePrevious() {
        if (this.activeStep > 0) {
            this.activeStep--
        }
        if (this.activeStep === 0 && this.accion === 'nuevo') {
            this.accion = 'editar' // Cambia a 'editar' cuando retrocedemos
            this.iEvaluacionId = this.evaluacionCreadaId // iEvaluacionId es el ID creado al guardar
            this.iEvaluacionId = this.compartirIdEvaluacionService.iEvaluacionId // Luego de retroceder, ya estamos en modo edición
            this.evaluacionFormGroup // Asegúrate de asignar el valor de iEvaluacionId al formulario
                .get('iEvaluacionId')
                .setValue(this.iEvaluacionId)
            this.esModoEdicion = true
            //console.log('GG Reasignado iEvaluacionId:', this.iEvaluacionId)
        }
    }
    // Finalizar el formulario
    finalizarFormulario(data) {
        //  console.log('Formulario finalizado.')
        this._ref.close(data)
        // console.log('Salir de Formulario')
        this.evaluacionFormGroup.reset()
    }

    // Función para determinar si es el último paso
    get isLastStep(): boolean {
        return this.activeStep === this.totalSteps - 1
    }

    ngOnInit() {
        if (this._config?.data?.evaluacion?.iEvaluacionId) {
            this.iEvaluacionId = this._config.data.evaluacion.iEvaluacionId
            // console.log('Se agrego esto:', this.iEvaluacionId)
        }
        // console.log(this.opcion, 'LLEGARAEL DATO OPCION')
        this.accion = this._config.data.accion
        this.obtenerTipoEvaluacion()
        this.obtenerNivelEvaluacion()
        this.ereCrearFormulario()
        this.ereVerEvaluacion()
        if (this.evaluacionFormGroup.get('iEvaluacionId').value) {
            this.esModoEdicion = true
            // console.log('Formulario EDITAR', this.accion)
        }
        // Configura el formulario dependiendo de la acción
        if (this.accion === 'ver') {
            this.evaluacionFormGroup.disable() // Hacer el formulario solo lectura
            //  console.log('Formulario DESABILITADO', this.accion)
        } else if (this.accion === 'editar') {
            this.esModoEdicion = true
            this.ereVerEvaluacion() // Llenar el formulario con los datos para editar
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
            cEvaluacionObs: [null, [Validators.required]],
            dtEvaluacionCreacion: [null, Validators.required],
            dtEvaluacionLiberarMatriz: [null, Validators.required],
            dtEvaluacionLiberarCuadernillo: [null, Validators.required],
            dtEvaluacionLiberarResultados: [null, Validators.required],
        })
    }
    ereVerEvaluacion() {
        const evaluacionData = this._config.data.evaluacion // Obtener los datos del modal
        if (evaluacionData) {
            //console.log(evaluacionData.dtEvaluacionCreacion)
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
    guardarEvaluacion() {
        const iSesionId = this.constantesService.iDocenteId // Si es un array, toma el primer valor
        const data = {
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

            iSesionId: iSesionId,
        }
        console.log(data)
        this._apiEre
            .guardarEvaluacion(data)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    this.iEvaluacionId = resp['data'][0]['iEvaluacionId'] // Captura el ID generado
                    this.compartirIdEvaluacionService.iEvaluacionId =
                        this.iEvaluacionId // Guardar en el servicio
                    // console.log(
                    //     'ID de Evaluación guardado:',
                    //     this.iEvaluacionId
                    // )
                    //this.iEvaluacionId = resp['data'][0]['iEvaluacionId']
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Evaluación registrada',
                        detail: 'La evaluación se registró correctamente en el sistema.',
                    })

                    const nombreEvaluacion =
                        resp['data'][0]['cEvaluacionNombre'] // Obtiene el nombre de la respuesta
                    this.compartirFormularioEvaluacionService.setcEvaluacionNombre(
                        nombreEvaluacion
                    )
                },
                error: (error) => {
                    console.error('Error al guardar la evaluación:', error) // Captura el error aquí
                    //alert('Error en el servidor: ' + JSON.stringify(error))
                },
            })
    }

    // Método para actualizar los datos en el backend
    actualizarEvaluacion() {
        const iSesionId = this.constantesService.iDocenteId // Si es un array, toma el primer valor
        console.warn('iSesionId', iSesionId)
        const data = {
            iEvaluacionId: Number(
                this.evaluacionFormGroup.get('iEvaluacionId').value
            ),
            idTipoEvalId: Number(
                this.evaluacionFormGroup.get('idTipoEvalId').value
            ),
            iNivelEvalId: Number(
                this.evaluacionFormGroup.get('iNivelEvalId').value
            ),
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
            iSesionId: iSesionId,
        }
        console.warn('Datos enviados para actualizar:', data)
        this._apiEre.actualizarEvaluacion(data).subscribe({
            next: (resp) => {
                console.log('Evaluación actualizada:', resp)
            },
            error: (error) => {
                console.error('Error al actualizar la evaluación:', error)
            },
        })
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
    // Este método será llamado cuando el evento closeModalEvent sea emitido desde el hijo
    handleCloseModal(data: any): void {
        console.log('Cerrar modal en el padre:', data)
        this.evaluacionFormGroup.reset()
    }

    closeModal(data) {
        this._ref.close(data)
        console.log('Salir de Formulario')

        // Resetear el formulario si es necesario
        this.evaluacionFormGroup.reset()
    }
}
