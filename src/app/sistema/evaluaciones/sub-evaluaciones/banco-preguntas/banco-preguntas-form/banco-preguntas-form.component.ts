import {
    Component,
    inject,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
} from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { EditorModule } from 'primeng/editor'
import { TabViewModule } from 'primeng/tabview'
import { AlternativasComponent } from '../alternativas/alternativas.component'
import { StepsModule } from 'primeng/steps'

import { Subject, takeUntil } from 'rxjs'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { BancoPreguntaInformacionFormComponent } from './banco-pregunta-informacion-form/banco-pregunta-informacion-form.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { generarIdAleatorio } from '@/app/shared/utils/random-id'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { MenuItem } from 'primeng/api'
import { BancoPreguntaEncabezadoFormComponent } from '../components/banco-pregunta-encabezado-form/banco-pregunta-encabezado-form.component'
import { BancoPreguntasModule } from '../banco-preguntas.module'
import { validarPregunta } from '../banco-preguntas-validators'
import {
    accionesTablaListaPreguntaForm,
    columnasListaPreguntaForm,
} from './pregunta-lista-columns'
import { provideIcons } from '@ng-icons/core'
import { matListAlt } from '@ng-icons/material-icons/baseline'
import { PrimengModule } from '@/app/primeng.module'

const preguntaFormInfoDefaultValues = {
    iPreguntaId: generarIdAleatorio(),
    isDeleted: false,
    iHoras: 0,
    iMinutos: 0,
    iSegundos: 0,
    isLocal: true,
}

const alternativasLabel = {
    id: '2',
    label: 'Alternativas',
}

@Component({
    selector: 'app-banco-preguntas-form',
    standalone: true,
    imports: [
        EditorModule,
        TabViewModule,
        AlternativasComponent,
        StepsModule,
        BancoPreguntaInformacionFormComponent,
        TablePrimengComponent,
        BancoPreguntaEncabezadoFormComponent,
        BancoPreguntasModule,
        ReactiveFormsModule,
        PrimengModule,
    ],
    templateUrl: './banco-preguntas-form.component.html',
    styleUrl: './banco-preguntas-form.component.scss',
    providers: [provideIcons({ matListAlt })],
})
export class BancoPreguntasFormComponent implements OnInit, OnDestroy {
    @Output() closeModalChange = new EventEmitter()
    @Output() submitChange = new EventEmitter()
    @Output() encabezadoChange = new EventEmitter()
    @Input() public tipoPreguntas = []
    @Input() public encabezados = []
    @Input() public bancoPreguntasForm: FormGroup
    @Input() public encabezadosFiltered = []
    @Input() public obtenerPreguntasPorEncabezado: (id: number) => void
    @Input() public columnasPreguntas = columnasListaPreguntaForm
    @Input() public accionesPreguntas = accionesTablaListaPreguntaForm
    @Input() _iEvaluacionId: string | null = null // Aquí definimos el @Input

    private _pregunta
    private _FormBuilder = inject(FormBuilder)
    payloadRecibido: any
    // si envia la pregunta se hace el patch del formulario
    @Input()
    set pregunta(pregunta) {
        if (pregunta === undefined) {
            return
        }

        if (
            pregunta.preguntas !== undefined &&
            pregunta.preguntas?.length > 0
        ) {
            this.formMode = 'SUB-PREGUNTAS'
            this.preguntas = pregunta.preguntas

            this.handleConEncabezado()
        } else {
            this.formMode = 'UNA-PREGUNTA'
            this.alternativas = pregunta.alternativas ?? []
            this.handleSinEncabezado()
        }
        if (this.modePregunta === 'EDITAR') {
            if (pregunta.iTipoPregId === 3) {
                this.agregarQuitarAlternativasPaso('QUITAR')
            }
            this.patchForm(pregunta)
        }
        this._pregunta = pregunta
    }

    get pregunta() {
        return this._pregunta
    }

    public customOptions = []
    public preguntas = []
    public alternativas = []

    @Input() public modePregunta: 'EDITAR' | 'CREAR' = 'CREAR'
    @Input() public encabezadoMode: 'COMPLETADO' | 'EDITAR' = 'EDITAR'
    public formMode: 'SUB-PREGUNTAS' | 'UNA-PREGUNTA' = 'UNA-PREGUNTA'
    public showFooterSteps = true
    public pasos: MenuItem[] = [
        {
            id: '0',
            label: 'Encabezado',
        },
        {
            id: '1',
            label: 'Información Pregunta',
        },
    ]
    public activeIndex = 0
    public bancoPreguntaActiveIndex = 0

    // Injeccion de depedencias
    private _formBuilder = inject(FormBuilder)
    private _evaluacionesService = inject(ApiEvaluacionesRService)
    private _confirmationModalService = inject(ConfirmationModalService)

    public evaluacionesService = this._evaluacionesService
    private unsubscribe$: Subject<boolean> = new Subject()
    public alternativasEliminadas = []
    public preguntaSelected = null
    public preguntasEliminar = []
    datosListos: boolean = false //! Indicador de que los datos llegaron

    ngOnInit() {
        // Aqui llego la iEvaluacion desde BancoPreguntasForm
        console.log(
            'iEvaluacionId recibido desde form Click Agregar Pregunta :',
            this._iEvaluacionId
        )
        //Aqui esta el Desempeno desde el hijo
        console.log('Desempeno recibido desde el hijo:', this.payloadRecibido)
        // escuchar cambio tipo pregunta
        this.listenTipoPregunta()
        // Llenar el formulario paso 1 basado en la seleccion de la cabecera.
        this.bancoPreguntasForm
            .get('0.encabezadoSelected')
            .valueChanges.subscribe((value) => {
                if (this.esSinEncabezado) {
                    this.formMode = 'UNA-PREGUNTA'
                    this.handleSinEncabezado()
                } else {
                    this.formMode = 'SUB-PREGUNTAS'
                    this.handleConEncabezado()
                }
                if (typeof value === 'string') {
                    this.bancoPreguntasForm.get('0.iEncabPregId').setValue(0)
                    this.bancoPreguntasForm
                        .get('0.cEncabPregTitulo')
                        .setValue(value)
                }
                if (typeof value === 'object') {
                    this.formEncabezado.patchValue({
                        iEncabPregId: value?.iEncabPregId,
                        cEncabPregTitulo: value?.cEncabPregTitulo,
                        cEncabPregContenido: value?.cEncabPregContenido,
                    })
                }
            })
    }

    get formPreguntaInfo(): FormGroup {
        return this.bancoPreguntasForm.get('1') as FormGroup
    }

    get formEncabezado() {
        return this.bancoPreguntasForm.get('0')
    }

    // escuchar cambio tipo pregunta
    private listenTipoPregunta() {
        this.formPreguntaInfo
            .get('iTipoPregId')
            .valueChanges.pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (value) => {
                    if (this.formMode === 'UNA-PREGUNTA') {
                        this.pregunta.iTipoPregId = value
                        if (value === 3) {
                            this.agregarQuitarAlternativasPaso('QUITAR')
                        } else {
                            this.agregarQuitarAlternativasPaso('AGREGAR')
                        }
                    }
                },
            })
    }

    // agrega o quita la pregunta única
    private handleSinEncabezado() {
        this.agregarQuitarValidacionesFormPregunta('AGREGAR')
        this.agregarQuitarValidacionesEncabezado('QUITAR')
        this.agregarQuitarAlternativasPaso('AGREGAR')
    }

    // agrega o quita el paso alternativas
    private handleConEncabezado() {
        this.agregarQuitarAlternativasPaso('QUITAR')
        this.agregarQuitarValidacionesEncabezado('AGREGAR')
        this.agregarQuitarValidacionesFormPregunta('QUITAR')
    }

    agregarQuitarValidacionesEncabezado(mode: 'AGREGAR' | 'QUITAR') {
        if (mode === 'AGREGAR') {
            this.formEncabezado
                .get('iEncabPregId')
                .setValidators([Validators.required])
            this.formEncabezado
                .get('cEncabPregTitulo')
                .setValidators([Validators.required])
            this.formEncabezado
                .get('cEncabPregContenido')
                .setValidators([Validators.required])
        } else {
            this.formEncabezado.get('iEncabPregId').setValidators(null)
            this.formEncabezado.get('cEncabPregTitulo').setValidators(null)
            this.formEncabezado.get('cEncabPregContenido').setValidators(null)
        }

        this.formEncabezado.get('iEncabPregId').updateValueAndValidity()
        this.formEncabezado.get('cEncabPregTitulo').updateValueAndValidity()
        this.formEncabezado.get('cEncabPregContenido').updateValueAndValidity()
    }

    // quitar o agregar validaciones.
    agregarQuitarValidacionesFormPregunta(mode: 'AGREGAR' | 'QUITAR') {
        if (mode === 'AGREGAR') {
            this.formPreguntaInfo
                .get('iPreguntaId')
                .setValidators([Validators.required])
            this.formPreguntaInfo
                .get('iTipoPregId')
                .setValidators([Validators.required])
            this.formPreguntaInfo
                .get('cPregunta')
                .setValidators([Validators.required])
            this.formPreguntaInfo
                .get('iPreguntaNivel')
                ?.setValidators([Validators.required])
            this.formPreguntaInfo
                .get('iPreguntaPeso')
                .setValidators([Validators.required])
            this.formPreguntaInfo
                .get('iHoras')
                .setValidators([Validators.required])
            this.formPreguntaInfo
                .get('iMinutos')
                .setValidators([Validators.required])
            this.formPreguntaInfo
                .get('iSegundos')
                .setValidators([Validators.required])
            this.formPreguntaInfo.updateValueAndValidity()
        } else {
            Object.keys(this.formPreguntaInfo.controls).forEach((key) => {
                this.bancoPreguntasForm.get('1').get(key).clearValidators()
                this.bancoPreguntasForm
                    .get('1')
                    .get(key)
                    .updateValueAndValidity()
            })
        }
    }

    //  quitar o agregar alternativas
    agregarQuitarAlternativasPaso(mode: 'AGREGAR' | 'QUITAR') {
        if (mode === 'AGREGAR') {
            const label = this.pasos.find((item) => item.id === '2')
            if (label == undefined) {
                this.pasos = [...this.pasos, alternativasLabel]
            }
        } else {
            this.pasos = this.pasos.filter((item) => item.id !== '2')
        }
    }

    get esSinEncabezado(): boolean {
        return (
            typeof this.bancoPreguntasForm.get('0.encabezadoSelected').value ===
                'object' &&
            this.bancoPreguntasForm.get('0.encabezadoSelected').value
                ?.iEncabPregId === -1
        )
    }

    // asignar las alternativas a la pregunta
    alternativasChange(alternativas) {
        this.alternativas = alternativas
        if (this.formMode === 'SUB-PREGUNTAS') {
            this.preguntaSelected.alternativas = alternativas
            this.preguntaSelected.iTotalAlternativas = alternativas.length
            this.actualizarPreguntas(this.preguntaSelected)
        }
    }

    // asignar las alternativas a la pregunta
    setAlternativasEliminadas(alternativas) {
        this.alternativasEliminadas = alternativas
        if (this.formMode === 'SUB-PREGUNTAS') {
            this.preguntaSelected.alternativasEliminar = alternativas
            this.preguntaSelected.iTotalAlternativas = alternativas.length
            this.actualizarPreguntas(this.preguntaSelected)
        }
    }

    // avanzar pasos y retroceder
    goStep(opcion: string) {
        switch (opcion) {
            case 'next':
                if (
                    this.bancoPreguntasForm.get(this.activeIndex.toString())
                        .invalid
                ) {
                    this.bancoPreguntasForm.markAllAsTouched()
                    return
                }
                if (this.activeIndex !== 2) {
                    this.activeIndex++
                }
                break
            case 'back':
                if (this.activeIndex !== 0) {
                    if (
                        this.formMode === 'SUB-PREGUNTAS' &&
                        this.pasos[this.activeIndex].id === '2'
                    ) {
                        this.agregarQuitarAlternativasPaso('AGREGAR')
                    }
                    this.activeIndex--
                }
                break
        }
    }

    // asignar los datos al formulario.
    patchForm(pregunta) {
        if (pregunta?.iEncabPregId == '-1' || pregunta.iPreguntaId == 0) {
            pregunta.encabezadoSelected = {
                iEncabPregId: -1,
                cEncabPregTitulo: 'Sin encabezado',
            }
        } else {
            pregunta.encabezadoSelected = {
                iEncabPregId: pregunta.iEncabPregId,
                cEncabPregTitulo: pregunta.cEncabPregTitulo,
                cEncabPregContenido: pregunta.cEncabPregContenido,
            }
        }
        this.bancoPreguntasForm.get('0').patchValue(pregunta)
        this.formPreguntaInfo.get('iTipoPregId').disable()

        if (this.formMode === 'UNA-PREGUNTA') {
            this.bancoPreguntasForm.get('1').patchValue(pregunta)
        }
    }

    // escuchar cambio de tipo de preguntas y activar validaciones de las alternativas
    handleTipoPreguntaChange(): void {
        const alternativasControl =
            this.bancoPreguntasForm.get('1.alternativas')
        if (alternativasControl) {
            // Reaplicar las validaciones personalizadas según el tipo de pregunta
            alternativasControl.updateValueAndValidity()
        }
    }

    setEncabezado(encabezado) {
        this.bancoPreguntasForm.get('0').patchValue(encabezado)
    }

    changeIndexBancoForm(index) {
        this.bancoPreguntaActiveIndex = index
    }

    toggleStepsVisibility(visibiltiy: boolean) {
        this.showFooterSteps = visibiltiy
    }

    agregarPreguntaForm() {
        this.changeIndexBancoForm(1)
        this.toggleStepsVisibility(false)
        this.agregarQuitarValidacionesFormPregunta('AGREGAR')
    }

    // manejar acciones de la tabla preguntas
    accionPreguntaTable({ accion, item }) {
        if (accion === 'editar') {
            this.changeIndexBancoForm(1)
            this.toggleStepsVisibility(false)
            this.bancoPreguntasForm.get('1').patchValue(item)
        }
        if (accion === 'eliminar') {
            this.eliminarPregunta(item)
        }
        if (accion === 'alternativas') {
            this.preguntaSelected = item
            this.toggleStepsVisibility(false)
            this.agregarQuitarAlternativasPaso('AGREGAR')
            this.activeIndex = this.pasos.length - 1
        }
    }

    eliminarPregunta(item) {
        this._confirmationModalService.openConfirm({
            header: '¿Esta seguro de eliminar la pregunta?',
            accept: () => {
                this.eliminarPreguntaLocal(item)
                if (!item.isLocal) {
                    this.preguntasEliminar.push(item)
                }
            },
            reject: () => {},
        })
    }

    eliminarPreguntaLocal(pregunta) {
        this.preguntas = this.preguntas.filter(
            (item) => item.iPreguntaId != pregunta.iPreguntaId
        )
    }

    actualizarPreguntas(pregunta) {
        const existePregunta = this.preguntas.some((x) => {
            return x.iPreguntaId == pregunta.iPreguntaId
        })

        // si existe actualizar
        if (existePregunta) {
            const index = this.preguntas.findIndex(
                (x) => x.iPreguntaId == pregunta.iPreguntaId
            )
            this.preguntas[index] = {
                ...this.preguntas[index],
                ...pregunta,
            }
        } else {
            this.preguntas.push(pregunta)
        }
    }

    guardarActualizarPreguntaForm() {
        if (this.bancoPreguntasForm.get('1').invalid) {
            this.bancoPreguntasForm.get('1').markAllAsTouched()
            return
        }
        const preguntaForm = {
            ...this.bancoPreguntasForm.get('1').getRawValue(),
        }

        preguntaForm.cTipoPregDescripcion = this.obtenerTipoPreguntaDesc(
            preguntaForm.iTipoPregId
        )?.cTipoPregDescripcion
        // manejar el crud de preguntas local
        this.actualizarPreguntas(preguntaForm)
        this.changeIndexBancoForm(0)
        this.bancoPreguntasForm.get('1').reset(preguntaFormInfoDefaultValues)
        this.agregarQuitarValidacionesFormPregunta('QUITAR')
        this.toggleStepsVisibility(true)
    }

    obtenerTipoPreguntaDesc(iTipoPregId: number) {
        return this.tipoPreguntas.find(
            (item) => item.iTipoPregId === iTipoPregId
        )
    }

    // enviar el formulario de banco de preguntas a guardar o actualizar
    guardarActualizarBancoPreguntas() {
        if (this.bancoPreguntasForm.invalid) {
            this.bancoPreguntasForm.markAllAsTouched()
            return
        }

        const encabezado = this.bancoPreguntasForm.get('0').getRawValue()

        let preguntas = []
        if (this.formMode === 'UNA-PREGUNTA') {
            const pregunta = this.bancoPreguntasForm.get('1').getRawValue()
            pregunta.alternativasEliminadas = this.alternativasEliminadas
            pregunta.alternativas = this.alternativas
            pregunta.cPreguntaClave = this.getPreguntaClave(
                pregunta.alternativas
            )

            preguntas = [pregunta]
            const { isValid, message } = validarPregunta(
                pregunta,
                this.alternativas
            )

            if (!isValid) {
                this._confirmationModalService.openAlert({
                    header: pregunta.cPregunta.replace(/<\/?[^>]+(>|$)/g, ''),
                    message,
                })
                return
            }
        }

        if (this.formMode === 'SUB-PREGUNTAS') {
            preguntas = this.preguntas
            preguntas = preguntas.map((x) => {
                x.cPreguntaClave = this.getPreguntaClave(x.alternativas)
                return x
            })
            if (this.preguntas.length === 0) {
                this._confirmationModalService.openAlert({
                    header: encabezado.cEncabPregTitulo,
                    message: 'Debe agregar al menos 1 pregunta',
                })
                return
            }
            for (const subPregunta of preguntas) {
                const { isValid, message } = validarPregunta(
                    subPregunta,
                    this.alternativas
                )

                if (!isValid) {
                    this._confirmationModalService.openAlert({
                        header: subPregunta.cPregunta.replace(
                            /<\/?[^>]+(>|$)/g,
                            ''
                        ),
                        message,
                    })
                    return
                }
            }
        }

        const data = {
            encabezado,
            preguntas,
            preguntasEliminar: this.preguntasEliminar,
        }
        // Aquí accedemos a iPreguntaId
        if (data.preguntas && data.preguntas.length > 0) {
            const iPreguntaId = data.preguntas[0].iPreguntaId // Accedemos al primer elemento del array
            console.log('iPreguntaId Al Apretar Finalizar:', iPreguntaId)
        }
        console.log('Los datos de las preguntas al Apretar Finalizar', data)
        this.submitChange.emit(data)
    }
    //Aqui recibe el payload del hijo
    recibirPayload(payload: any) {
        console.log('Payload recibido desde el hijo:', payload)

        // Guardar o manejar el payload como sea necesario
        this.payloadRecibido = payload

        // Cambiar el indicador para que se sepa que los datos ya llegaron
        this.datosListos = true
    }
    // Método para manejar el clic del botón cuando los datos están listos
    procesarDatos() {
        if (this.datosListos) {
            console.log('Procesando datos:', this.payloadRecibido)
            // Aquí puedes realizar alguna acción con los datos
        }
    }
    closeModal(data) {
        this.closeModalChange.emit(data)
    }

    getPreguntaClave(alternativas = []) {
        return alternativas.find((alt) => alt.bAlternativaCorrecta)
            ?.cAlternativaLetra
    }

    // desuscribirse de los observables cuando se destruye el componente
    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }

    formPreguntas = this._FormBuilder.group({
        cEvaluacionDescripcion: [''],

        iTipoPreguntaId: [''],
        cPeso: [''],
        cHrs: [''],
        cMin: [''],
        cSeg: [''],
        cEnunciado: [''],
        cCorrecto: [''],
        cEnunciadoPregunta: [''],
    })
    agregarPregunta() {}
}
