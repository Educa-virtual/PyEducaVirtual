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
import { CardModule } from 'primeng/card'
import { StepsModule } from 'primeng/steps'
import { Stepper } from 'primeng/stepper'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { CalendarModule } from 'primeng/calendar'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { InputSwitchModule } from 'primeng/inputswitch'
import { EditorModule } from 'primeng/editor'
import { PrimengModule } from '@/app/primeng.module'

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
        InputSwitchModule,
        EditorModule,
        ScrollPanelModule,
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
        CardModule,
        ToastModule,
        CalendarModule,
        PrimengModule,
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
    checked: boolean = true // Inicializa con 'true' para que el switch esté encendido

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
            cEvaluacionUrlDrive: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)'
                    ),
                ],
            ],
            dtEvaluacionFechaInicio: [null, [Validators.required]],
            dtEvaluacionFechaFin: [null, [Validators.required]],
        })
    }
    // Función para mostrar el valor en la consola
    logCalendarValue() {
        console.log('Valor del calendario:', this.dtEvaluacionCreacion)
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
    // Función para manejar el botón de "Siguiente"
    handleNext() {
        if (this.activeStep === 0 && this.accion === 'ver') {
            this.evaluacionFormGroup.disable() // Hacer el formulario solo lectura
            //console.log('Formulario DESABILITADO', this.accion)
        }

        if (this.activeStep === 0 && this.accion === 'editar') {
            const camposInvalidos: string[] = []
            Object.keys(this.evaluacionFormGroup.controls).forEach((campo) => {
                const control = this.evaluacionFormGroup.get(campo)
                if (control?.invalid) {
                    camposInvalidos.push(campo)
                }
            })
            if (camposInvalidos.length > 0) {
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Rellenar los campos',
                    detail: `Rellene los campos que esten vacíos o inválidos: ${camposInvalidos.join(', ')}`,
                })
                // Marca los campos como tocados para que se muestren los errores
                this.evaluacionFormGroup.markAllAsTouched()
                return
            }

            // agregando  this.actualizarEvaluacion();
            this.actualizarEvaluacion()

            // if (this.evaluacionFormGroup.invalid) {
            //     this._MessageService.add({
            //         severity: 'error',
            //         summary: 'Rellenar los campos',
            //         detail: 'Rellene todos los campos para editar la evaluación.',
            //     })
            //     // Marca los campos como tocados para que se muestren los errores
            //     this.evaluacionFormGroup.markAllAsTouched()
            //     return
            // }
            // this.esModoEdicion = true
            // this.actualizarEvaluacion()
            //console.log('Formulario EDITAR DESDE HANDLE', this.accion)
        }

        if (this.activeStep === 0 && this.accion === 'nuevo') {
            // console.log(this.evaluacionFormGroup)

            const camposInvalidos: string[] = []
            Object.keys(this.evaluacionFormGroup.controls).forEach((campo) => {
                const control = this.evaluacionFormGroup.get(campo)
                if (control?.invalid) {
                    camposInvalidos.push(campo)
                }
            })
            if (camposInvalidos.length > 0) {
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Rellenar los campos',
                    detail: `Los siguientes campos están vacíos o inválidos: ${camposInvalidos.join(', ')}`,
                })
                // Marca los campos como tocados para que se muestren los errores
                this.evaluacionFormGroup.markAllAsTouched()
                return
            }
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
            dtEvaluacionFechaInicio: [null, [Validators.required]],
            dtEvaluacionFechaFin: [null, [Validators.required]],
        })
    }

    ereVerEvaluacion() {
        const evaluacionData = this._config.data.evaluacion // Obtener los datos del modal
        if (evaluacionData) {
            const patchData = { ...evaluacionData }
            if (patchData.dtEvaluacionFechaInicio) {
                const [dia, mes, anio] =
                    patchData.dtEvaluacionFechaInicio.split('/')
                patchData.dtEvaluacionFechaInicio = new Date(
                    Number(anio),
                    Number(mes) - 1,
                    Number(dia)
                )
            }
            if (patchData.dtEvaluacionFechaFin) {
                const [dia, mes, anio] =
                    patchData.dtEvaluacionFechaFin.split('/')
                patchData.dtEvaluacionFechaFin = new Date(
                    Number(anio),
                    Number(mes) - 1,
                    Number(dia)
                )
            }
            this.evaluacionFormGroup.patchValue(patchData)
        }
    }
    guardarEvaluacion() {
        const estado = 1
        const data = {
            idTipoEvalId: this.evaluacionFormGroup.get('idTipoEvalId').value,
            iNivelEvalId: this.evaluacionFormGroup.get('iNivelEvalId').value,
            cEvaluacionNombre:
                this.evaluacionFormGroup.get('cEvaluacionNombre').value,
            cEvaluacionDescripcion: this.evaluacionFormGroup.get(
                'cEvaluacionDescripcion'
            ).value,
            cEvaluacionUrlDrive: this.evaluacionFormGroup.get(
                'cEvaluacionUrlDrive'
            ).value,
            dtEvaluacionFechaInicio: this.evaluacionFormGroup.get(
                'dtEvaluacionFechaInicio'
            ).value,
            dtEvaluacionFechaFin: this.evaluacionFormGroup.get(
                'dtEvaluacionFechaFin'
            ).value,
            iEstado: estado,
        }

        this._apiEre
            .guardarEvaluacion(data)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: any) => {
                    this.iEvaluacionId = resp['data'][0]['iEvaluacionId'] // Captura el ID generado
                    this.compartirIdEvaluacionService.iEvaluacionId =
                        this.iEvaluacionId // Guardar en el servicio

                    const nombreEvaluacion =
                        resp['data'][0]['cEvaluacionNombre'] // Obtiene el nombre de la respuesta
                    this.compartirFormularioEvaluacionService.setcEvaluacionNombre(
                        nombreEvaluacion
                    )
                    this._MessageService.add({
                        severity: 'success',
                        summary: 'Se guardó con éxito',
                        detail: 'La evaluación se ha guardado con éxito.',
                    })
                },
                error: (error) => {
                    console.error('Error al guardar la evaluación:', error) // Captura el error aquí
                    //alert('Error en el servidor: ' + JSON.stringify(error))
                },
            })
    }

    actualizarEvaluacion() {
        const fechaInicioOriginal = this.evaluacionFormGroup.get(
            'dtEvaluacionFechaInicio'
        ).value
        const fechaFinOriginal = this.evaluacionFormGroup.get(
            'dtEvaluacionFechaFin'
        ).value
        // Se agrega logs para depuración
        /*console.log('Fecha Inicio (original):', fechaInicioOriginal)
        console.log('Tipo de fecha inicio:', typeof fechaInicioOriginal)
        console.log('Es Date?', fechaInicioOriginal instanceof Date)

        console.log('Fecha Fin (original):', fechaFinOriginal)
        console.log('Tipo de fecha fin:', typeof fechaFinOriginal)
        console.log('Es Date?', fechaFinOriginal instanceof Date)*/

        /*const formatearFecha = (fecha) => {
            if (!fecha) return null

            if (fecha instanceof Date) {
                return fecha.toISOString().split('T')[0]
            }

            if (typeof fecha === 'string') {
                if (fecha.includes('/')) {
                    const partes = fecha.split('/')
                    if (partes.length === 3) {
                        const dia = partes[0].padStart(2, '0')
                        const mes = partes[1].padStart(2, '0')
                        const anio = partes[2]
                        return `${anio}-${mes}-${dia}`
                    }
                } else if (fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    return fecha
                }
            }
            return null
        }*/

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
            cEvaluacionNombre:
                this.evaluacionFormGroup.get('cEvaluacionNombre').value,
            cEvaluacionDescripcion: this.evaluacionFormGroup.get(
                'cEvaluacionDescripcion'
            ).value,
            cEvaluacionUrlDrive: this.evaluacionFormGroup.get(
                'cEvaluacionUrlDrive'
            ).value,
            dtEvaluacionFechaInicio: fechaInicioOriginal, //formatearFecha(fechaInicioOriginal),
            dtEvaluacionFechaFin: fechaFinOriginal, //formatearFecha(fechaFinOriginal),
        }

        //console.log('Datos para actualizar (con fechas formateadas):', data)

        if (!data.dtEvaluacionFechaInicio || !data.dtEvaluacionFechaFin) {
            this._MessageService.add({
                severity: 'error',
                summary: 'Error de formato',
                detail: 'Las fechas de inicio y/o fin no tienen un formato válido',
            })
            return
        }

        this._apiEre.actualizarEvaluacion(data).subscribe({
            next: () => {
                //console.log('respuesta de actualizacion', resp)
                this._MessageService.add({
                    severity: 'success',
                    summary: 'Actualización exitosa',
                    detail: 'Los datos de la evaluación han sido actualizados.',
                })
            },
            error: () => {
                //console.error('Error al actualizar la evaluación:', error)
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error de actualización',
                    detail: 'No se pudo actualizar la evaluación. Por favor intente de nuevo.',
                })
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
