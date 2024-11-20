//Agregar Servicio de Evaluacion
//!Se agrego el afterviewinit
import { CompartirIdEvaluacionService } from './../../../services/ereEvaluaciones/compartir-id-evaluacion.service'
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
    private _MessageService = inject(MessageService) //!Agregando Mensaje
    tipoEvaluacion: TipoEvaluacion[] | undefined
    iEvaluacionId: number
    selectedTipoEvaluacion: TipoEvaluacion | undefined
    nivelEvaluacion: NivelEvaluacion[] | undefined
    selectedNivelEvaluacion: TipoEvaluacion | undefined
    fecha: string
    visible: boolean = false //Accion Editar, Ver, Crear
    value!: string
    accion: string //Accion Editar, Ver, Crear
    @ViewChild('stepper') stepper: Stepper
    activeStep: number = 0 // Paso activo
    totalSteps = 3 // Total de pasos del stepper

    dtEvaluacionCreacion: Date | null = null // Esto guarda la fecha seleccionada

    // Función para mostrar el valor en la consola
    logCalendarValue() {
        console.log('Valor del calendario:', this.dtEvaluacionCreacion)
    }
    constructor(
        public _config: DynamicDialogConfig, // Inyección de configuración
        private compartirIdEvaluacionService: CompartirIdEvaluacionService, // Inyección del servicio
        private compartirFormularioEvaluacionService: CompartirFormularioEvaluacionService, // Inyección del servicio
        private fb: FormBuilder
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
            cEvaluacionObs: [null],
            dtEvaluacionCreacion: [null, Validators.required],
            dtEvaluacionLiberarMatriz: [null, Validators.required],
            dtEvaluacionLiberarCuadernillo: [null, Validators.required],
            dtEvaluacionLiberarResultados: [null, Validators.required],
        })
    }

    // Función para manejar el botón de "Siguiente"
    handleNext() {
        if (this.activeStep === 0 && this.accion === 'ver') {
            this.evaluacionFormGroup.disable() // Hacer el formulario solo lectura

            console.log('Formulario DESABILITADO', this.accion)
        }

        if (this.activeStep === 0 && this.accion === 'editar') {
            this.esModoEdicion = true

            this.actualizarEvaluacion()
            console.log('Formulario EDITAR DESDE HANDLE', this.accion)
        }

        if (this.activeStep === 0 && this.accion === 'nuevo') {
            // Guardar datos de Información Evaluación

            // this._MessageService.add({
            //     severity: 'success',
            //     summary: 'Actualización exitosa',
            //     detail: 'La evaluacion se inserto Correctamente.',
            // })
            this.guardarEvaluacion()
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
    }

    // Finalizar el formulario
    finalizarFormulario(data) {
        console.log('Formulario finalizado.')
        this._ref.close(data)
        console.log('Salir de Formulario')

        // Resetear el formulario si es necesario
        this.evaluacionFormGroup.reset()
        // Aquí va la lógica para finalizar el formulario
    }

    // Función para determinar si es el último paso
    get isLastStep(): boolean {
        return this.activeStep === this.totalSteps - 1
    }
    //!TERMINA AQUI
    esModoEdicion: boolean = false // Cambiar a true si estás en modo edición
    ngOnInit() {
        if (this._config?.data?.evaluacion?.iEvaluacionId) {
            this.iEvaluacionId = this._config.data.evaluacion.iEvaluacionId
            console.log('Se agrego esto:', this.iEvaluacionId)
        }
        // console.log(this.opcion, 'LLEGARAEL DATO OPCION')
        this.accion = this._config.data.accion

        this.obtenerTipoEvaluacion()
        this.obtenerNivelEvaluacion()
        this.ereCrearFormulario()
        this.ereVerEvaluacion()
        if (this.evaluacionFormGroup.get('iEvaluacionId').value) {
            this.esModoEdicion = true
            console.log('Formulario EDITAR', this.accion)
        }

        // Configura el formulario dependiendo de la acción
        if (this.accion === 'ver') {
            this.evaluacionFormGroup.disable() // Hacer el formulario solo lectura
            console.log('Formulario DESABILITADO', this.accion)
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
    guardarEvaluacion() {
        console.log('STEPPER Guardando información de evaluación...')
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
                    console.log(
                        'ID de Evaluación guardado:',
                        this.iEvaluacionId
                    )
                    this.iEvaluacionId = resp['data'][0]['iEvaluacionId']
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Evaluación registrada',
                        detail: 'La evaluación se registró correctamente en el sistema.',
                    })
                    //alert(JSON.stringify(this.data))
                    //this.sourceProducts = this.data
                },
                error: (error) => {
                    console.error('Error al guardar la evaluación:', error) // Captura el error aquí
                    //alert('Error en el servidor: ' + JSON.stringify(error))
                },
            })
    }
    // Método para actualizar los datos en el backend
    actualizarEvaluacion() {
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

        this._apiEre.actualizarEvaluacion(data).subscribe({
            next: (resp) => {
                console.log('Evaluación actualizada:', resp)
                //alert('Evaluación actualizada exitosamente')
            },
            error: (error) => {
                console.error('Error al actualizar la evaluación:', error)
                //alert('Error al actualizar la evaluación')
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
    onchange() {
        //alert(JSON.stringify(this.selectedTipoEvaluacion))
        //alert(this.fecha)
    }
    //Mandando el Closet Modal al hijo
    @ViewChild(EvaluacionAreasComponent)
    evaluacionAreasComponent: EvaluacionAreasComponent
    // Este método será llamado cuando el evento closeModalEvent sea emitido desde el hijo
    handleCloseModal(data: any): void {
        console.log('Cerrar modal en el padre:', data)
        this.evaluacionFormGroup.reset()
        // Aquí puedes realizar acciones adicionales, como cerrar el modal, resetear campos, etc.
        // Si tienes un modal, podrías hacer algo como:
        // this.modalService.close(); // o algo similar para cerrar el modal
    }

    closeModal(data) {
        this._ref.close(data)
        console.log('Salir de Formulario')

        // Resetear el formulario si es necesario
        this.evaluacionFormGroup.reset()
    }
}
