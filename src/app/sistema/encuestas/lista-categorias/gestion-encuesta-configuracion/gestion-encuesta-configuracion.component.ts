import {
    Component,
    inject,
    ViewChild,
    EventEmitter,
    Input,
    Output,
    OnInit,
} from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { StepperModule } from 'primeng/stepper'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { Stepper } from 'primeng/stepper'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { CommonModule } from '@angular/common'
import { ScrollPanelModule } from 'primeng/scrollpanel'

@Component({
    selector: 'app-gestion-encuesta-configuracion',
    standalone: true,
    imports: [
        StepperModule,
        PrimengModule,
        ReactiveFormsModule,
        ToastModule,
        CommonModule,
        ScrollPanelModule,
    ],
    templateUrl: './gestion-encuesta-configuracion.component.html',
    styleUrl: './gestion-encuesta-configuracion.component.scss',
    providers: [MessageService],
})
export class GestionEncuestaConfiguracionComponent implements OnInit {
    // Propiedades del stepper
    activeStep: number = 0
    totalSteps = 2
    // Encuesta configuracion
    encuestaConfiguracionFormGroup: FormGroup
    @Input() visible: boolean = false
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() mostrarDialogoConfiguracion = new EventEmitter<any>()

    // Datos para dropdowns
    tiposEncuesta = [
        { id: 1, nombre: 'Satisfacción' },
        { id: 2, nombre: 'Evaluación' },
        { id: 3, nombre: 'Opinión' },
    ]

    configuraciones = [
        { id: 1, nombre: 'Básica' },
        { id: 2, nombre: 'Avanzada' },
        { id: 3, nombre: 'Personalizada' },
    ]

    @ViewChild('stepper') stepper: Stepper

    private _formBuilder = inject(FormBuilder)
    private _messageService = inject(MessageService)

    constructor() {
        this.initializeForm()
    }

    ngOnInit(): void {
        console.log('ngOnInit')
    }

    initializeForm() {
        this.encuestaConfiguracionFormGroup = this._formBuilder.group({
            // Campos del paso 1
            nombreEncuesta: [null, [Validators.required]],
            descripcionEncuesta: [null, [Validators.required]],
            fechaInicio: [null, [Validators.required]],
            fechaFin: [null, [Validators.required]],

            // Campos del paso 2
            tipoEncuesta: [null, [Validators.required]],
            configuracion: [null],
            observaciones: [null],
        })
    }

    // Función para manejar el botón "Siguiente"
    handleNext() {
        if (this.activeStep === 0) {
            // Validar campos del paso 1
            const camposStep1 = [
                'nombreEncuesta',
                'descripcionEncuesta',
                'fechaInicio',
                'fechaFin',
            ]
            const camposInvalidos: string[] = []

            camposStep1.forEach((campo) => {
                const control = this.encuestaConfiguracionFormGroup.get(campo)
                if (control?.invalid) {
                    camposInvalidos.push(campo)
                }
            })

            if (camposInvalidos.length > 0) {
                this._messageService.add({
                    severity: 'error',
                    summary: 'Faltan datos en campos requeridos',
                    detail: 'Complete todos los campos marcados como obligatorios',
                })
                this.encuestaConfiguracionFormGroup.markAllAsTouched()
                return
            }

            // Si la validación es exitosa, continuar al siguiente paso
            this.proceedToNextStep()
        }
    }

    // Función para manejar el botón "Atrás"
    handlePrevious() {
        if (this.activeStep > 0) {
            this.activeStep--
            console.log('Retrocediendo al paso:', this.activeStep)
        }
    }

    // Finalizar la encuesta
    finalizarEncuesta() {
        // Validar campos del paso 2 si es necesario
        const camposStep2 = ['tipoEncuesta']
        const camposInvalidos: string[] = []

        camposStep2.forEach((campo) => {
            const control = this.encuestaConfiguracionFormGroup.get(campo)
            if (control?.invalid) {
                camposInvalidos.push(campo)
            }
        })

        if (camposInvalidos.length > 0) {
            this._messageService.add({
                severity: 'error',
                summary: 'Complete la configuración',
                detail: 'Complete todos los campos requeridos del paso 2',
            })
            this.encuestaConfiguracionFormGroup.markAllAsTouched()
            return
        }

        // Procesar datos y finalizar
        this.guardarEncuesta()
    }

    // Avanzar al siguiente paso
    private proceedToNextStep() {
        if (this.activeStep < this.totalSteps - 1) {
            this.activeStep++
            this._messageService.add({
                severity: 'success',
                summary: 'Paso completado',
                detail: `Avanzando al paso ${this.activeStep + 1}`,
            })
        }
    }

    // Función para determinar si es el último paso
    get isLastStep(): boolean {
        return this.activeStep === this.totalSteps - 1
    }

    // Guardar la encuesta
    private guardarEncuesta() {
        const datosEncuesta = this.encuestaConfiguracionFormGroup.value

        console.log('Datos de la encuesta:', datosEncuesta)
        this._messageService.add({
            severity: 'success',
            summary: 'Encuesta guardada',
            detail: 'La encuesta se ha guardado exitosamente',
        })

        // resetear formulario
        // this.resetFormulario()
    }

    // Resetear formulario (opcional)
    resetFormulario() {
        this.activeStep = 0
        this.encuestaConfiguracionFormGroup.reset()
    }
    onHide() {
        this.visible = false
        this.visibleChange.emit(this.visible)
    }
}
