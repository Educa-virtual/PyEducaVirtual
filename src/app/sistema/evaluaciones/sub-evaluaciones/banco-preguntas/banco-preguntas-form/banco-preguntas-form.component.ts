import { Component, inject, OnInit, OnDestroy } from '@angular/core'
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { InputSwitchModule } from 'primeng/inputswitch'
import { EditorModule } from 'primeng/editor'
import { TabViewModule } from 'primeng/tabview'
import { InputTextModule } from 'primeng/inputtext'
import { AlternativasComponent } from '../alternativas/alternativas.component'
import { AccordionModule } from 'primeng/accordion'
import { ButtonModule } from 'primeng/button'
import { CommonInputComponent } from '@/app/shared/components/common-input/common-input.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { StepsModule } from 'primeng/steps'
import { getAlternativaValidation } from '../alternativas/get-alternativa-validation'

import Quill from 'quill'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { Subject, takeUntil } from 'rxjs'
import { EncabezadosPreguntasComponent } from '../encabezados-preguntas/encabezados-preguntas.component'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { BancoPreguntaInformacionFormComponent } from './banco-pregunta-informacion-form/banco-pregunta-informacion-form.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { BancoPreguntaFormListComponent } from './banco-pregunta-form-list/banco-pregunta-form-list.component'
import { generarIdAleatorio } from '@/app/shared/utils/random-id'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { MenuItem } from 'primeng/api'
import {
    BancoPreguntaEncabezadoFormComponent,
    sinEncabezadoObj,
} from './banco-pregunta-encabezado-form/banco-pregunta-encabezado-form.component'

const ColorClass = Quill.import('attributors/class/color')
const SizeStyle = Quill.import('attributors/style/size')
Quill.register('attributors/class/color', ColorClass, true)
Quill.register('attributors/style/size', SizeStyle, true)

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
        DropdownModule,
        InputSwitchModule,
        EditorModule,
        TabViewModule,
        InputTextModule,
        AlternativasComponent,
        ButtonModule,
        AccordionModule,
        ReactiveFormsModule,
        CommonInputComponent,
        StepsModule,
        AutoCompleteModule,
        EncabezadosPreguntasComponent,
        BancoPreguntaInformacionFormComponent,
        TablePrimengComponent,
        BancoPreguntaFormListComponent,
        BancoPreguntaEncabezadoFormComponent,
    ],
    templateUrl: './banco-preguntas-form.component.html',
    styleUrl: './banco-preguntas-form.component.scss',
})
export class BancoPreguntasFormComponent implements OnInit, OnDestroy {
    public encabezadosFiltered = []
    public tipoPreguntas = []
    public customOptions = []
    public preguntas = []

    public mode: 'EDITAR' | 'CREAR' = 'CREAR'
    public formMode: 'SUB-PREGUNTAS' | 'UNA-PREGUNTA' = 'UNA-PREGUNTA'
    public pregunta
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

    private _formBuilder = inject(FormBuilder)
    private _config = inject(DynamicDialogConfig)
    private _evaluacionesService = inject(ApiEvaluacionesRService)
    private _ref = inject(DynamicDialogRef)
    private _confirmationModalService = inject(ConfirmationModalService)
    public evaluacionesService = this._evaluacionesService
    private unsubscribe$: Subject<boolean> = new Subject()

    public encabezados = []

    public bancoPreguntasForm: FormGroup
    alternativasEliminadas = []
    public preguntaSelected = null
    preguntasEliminar = []

    constructor() {
        this.inicializarFormulario()
    }

    inicializarFormulario() {
        this.bancoPreguntasForm = this._formBuilder.group({
            0: this._formBuilder.group({
                iEncabPregId: [-1],
                cEncabPregTitulo: [''],
                encabezadoSelected: [sinEncabezadoObj],
                cEncabPregContenido: [''],
            }),
            1: this.inicializarPreguntaInfoForm(),
            2: this._formBuilder.group({
                alternativas: [
                    [],
                    // [Validators.required, this.alternativasValidator()],
                ],
            }),
        })
    }

    inicializarPreguntaInfoForm() {
        return this._formBuilder.group({
            iPreguntaId: [generarIdAleatorio()],
            iTipoPregId: [null],
            cPregunta: [null],
            cPreguntaTextoAyuda: [''],
            iPreguntaNivel: [null],
            iPreguntaPeso: [null],
            isLocal: [true],
            isDeleted: [false],
            // dtPreguntaTiempo: [null, [Validators.required]],
            iHoras: [0],
            iMinutos: [0],
            iSegundos: [0],
            cPreguntaClave: [null],
            bPreguntaEstado: [0],
        })
    }

    ngOnInit() {
        this.tipoPreguntas = this._config.data.tipoPreguntas.filter((item) => {
            return item.iTipoPregId !== 0
        })

        this.pregunta = this._config.data.pregunta

        console.log(this.pregunta)

        // la pregunta tiene preguntas
        if (this.pregunta.preguntas?.length > 0) {
            this.mode = 'EDITAR'
            this.formMode = 'SUB-PREGUNTAS'
            this.patchForm(this.pregunta)
            this.preguntas = this._config.data.pregunta.preguntas
        } else {
            // es solo una pregunta
            this.toggleAlternativasSinEncabezado(true)
            this.preguntaSelected = this._config.data.pregunta
            if (
                this.pregunta.iPreguntaId != 0 &&
                this.pregunta.iEncabPregId == -1
            ) {
                this.mode = 'EDITAR'
                this.patchForm(this.pregunta)
                // this.obtenerAlternativas()
            }
        }
        this.obtenerEncabezados()

        this.obtenerEncabezados()

        this.bancoPreguntasForm
            .get('1.iTipoPregId')
            ?.valueChanges.subscribe(() => {
                // this.handleTipoPreguntaChange(value)
            })
        this.bancoPreguntasForm
            .get('0.encabezadoSelected')
            .valueChanges.subscribe((value) => {
                if (this.esSinEncabezado) {
                    this.bancoPreguntasForm.get('0.iEncabPregId').setValue(null)
                    this.toggleValidationInformacionPregunta(true)
                    this.toggleAlternativasSinEncabezado(true)
                    this.toggleValidationCabecera(false)
                    this.formMode = 'UNA-PREGUNTA'
                } else {
                    // agregar quitar validaciones
                    this.formMode = 'SUB-PREGUNTAS'
                    this.toggleValidationInformacionPregunta(false)
                    this.toggleAlternativasSinEncabezado(false)
                    this.toggleValidationCabecera(true)
                }
                if (typeof value === 'string') {
                    this.bancoPreguntasForm.get('0.iEncabPregId').setValue(0)
                    this.bancoPreguntasForm
                        .get('0.cEncabPregTitulo')
                        .setValue(value)
                }
                if (typeof value === 'object') {
                    this.bancoPreguntasForm
                        .get('0.iEncabPregId')
                        .setValue(value?.iEncabPregId)
                    this.bancoPreguntasForm
                        .get('0.cEncabPregTitulo')
                        .setValue(value?.cEncabPregTitulo)
                    this.bancoPreguntasForm
                        .get('0.cEncabPregContenido')
                        .setValue(value?.cEncabPregContenido)
                }
            })
    }

    generatePreguntaFormInfo() {
        return this._formBuilder.group({})
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
                next: (resp: unknown) => {
                    this.encabezados = resp['data']
                    this.encabezadosFiltered = [
                        sinEncabezadoObj,
                        ...this.encabezados,
                    ]
                },
            })
    }

    // cambiar validaciones si selecciona con o sin cabecera.
    toggleValidationCabecera(required: boolean) {
        if (required) {
            this.bancoPreguntasForm
                .get('0.iEncabPregId')
                .setValidators([Validators.required])
            this.bancoPreguntasForm
                .get('0.cEncabPregTitulo')
                .setValidators([Validators.required])
            this.bancoPreguntasForm
                .get('0.cEncabPregContenido')
                .setValidators([Validators.required])
        } else {
            this.bancoPreguntasForm.get('0.iEncabPregId').setValidators(null)
            this.bancoPreguntasForm
                .get('0.cEncabPregTitulo')
                .setValidators(null)
            this.bancoPreguntasForm
                .get('0.cEncabPregContenido')
                .setValidators(null)
        }

        this.bancoPreguntasForm.get('0.iEncabPregId').updateValueAndValidity()
        this.bancoPreguntasForm
            .get('0.cEncabPregTitulo')
            .updateValueAndValidity()
        this.bancoPreguntasForm
            .get('0.cEncabPregContenido')
            .updateValueAndValidity()
    }

    toggleValidationInformacionPregunta(required: boolean) {
        if (required) {
            this.bancoPreguntasForm
                .get('1.iPreguntaId')
                .setValidators([Validators.required])
            this.bancoPreguntasForm
                .get('1.iTipoPregId')
                .setValidators([Validators.required])
            this.bancoPreguntasForm
                .get('1.cPregunta')
                .setValidators([Validators.required])
            this.bancoPreguntasForm
                .get('1.iPreguntaNivel')
                .setValidators([Validators.required])
            this.bancoPreguntasForm
                .get('1.iPreguntaPeso')
                .setValidators([Validators.required])
            this.bancoPreguntasForm
                .get('1.iHoras')
                .setValidators([Validators.required])
            this.bancoPreguntasForm
                .get('1.iMinutos')
                .setValidators([Validators.required])
            this.bancoPreguntasForm
                .get('1.iSegundos')
                .setValidators([Validators.required])
            this.bancoPreguntasForm
                .get('1.cPreguntaClave')
                .setValidators([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(1),
                ])
            this.bancoPreguntasForm.get('1').updateValueAndValidity()
        } else {
            const formGroup = this.bancoPreguntasForm.get('1') as FormGroup
            Object.keys(formGroup.controls).forEach((key) => {
                this.bancoPreguntasForm.get('1').get(key).clearValidators()
                this.bancoPreguntasForm
                    .get('1')
                    .get(key)
                    .updateValueAndValidity()
            })
        }
    }

    toggleAlternativasSinEncabezado(toggle: boolean) {
        if (toggle) {
            const label = this.pasos.find((item) => item.id === '2')
            if (label == undefined) {
                this.pasos = [...this.pasos, alternativasLabel]
            }
        } else {
            this.pasos = this.pasos.filter((item) => item.id !== '2')
        }
    }

    get alternativas() {
        return this.bancoPreguntasForm.get('2.alternativas').value
    }

    set alternativas(value) {
        this.bancoPreguntasForm.get('2.alternativas').setValue(value)
    }

    get esSinEncabezado(): boolean {
        return (
            typeof this.bancoPreguntasForm.get('0.encabezadoSelected').value ===
                'object' &&
            this.bancoPreguntasForm.get('0.encabezadoSelected').value
                ?.iEncabPregId === -1
        )
    }

    alternativasChange(alternativas) {
        this.alternativas = alternativas
        if (this.formMode === 'SUB-PREGUNTAS') {
            this.preguntaSelected.alternativas = alternativas
            this.actualizarPreguntas(this.preguntaSelected)
        }
    }

    setAlternativasEliminadas(alternativas) {
        this.alternativasEliminadas = alternativas
        if (this.formMode === 'SUB-PREGUNTAS') {
            this.preguntaSelected.alternativasEliminar = alternativas
            this.actualizarPreguntas(this.preguntaSelected)
        }
    }

    // avanzar pasos
    goStep(opcion: string) {
        switch (opcion) {
            case 'next':
                console.log(
                    this.bancoPreguntasForm.get(this.activeIndex.toString())
                        .invalid
                )

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
                        this.toggleAlternativasSinEncabezado(false)
                    }
                    this.activeIndex--
                }
                break
        }
    }

    obtenerAlternativas() {
        this._evaluacionesService
            .obtenerAlternativaByPreguntaId(this.pregunta.iPreguntaId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (resp: unknown) => {
                    this.alternativas = resp['data'].map((item) => {
                        item.isLocal = false
                        return item
                    })
                    console.log(this.alternativas)
                },
            })
    }

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
        this.bancoPreguntasForm.get('1').patchValue(pregunta)
    }

    // escuchar cambio de tipo de preguntas y activar validaciones de las alternativas
    handleTipoPreguntaChange(tipoPregunta: number): void {
        console.log(tipoPregunta)

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

    // validaciones alternativas
    alternativasValidator() {
        return (control: AbstractControl) => {
            let tipoPregunta =
                this.bancoPreguntasForm?.get('1.iTipoPregId')?.value
            const alternativas = control.value
            tipoPregunta = parseInt(tipoPregunta, 10)

            const errorMessage = getAlternativaValidation(
                tipoPregunta,
                alternativas
            )
            if (errorMessage) {
                return {
                    alternativasInvalidas: errorMessage,
                }
            }
            return errorMessage
        }
    }

    changeIndexBancoForm(index) {
        this.bancoPreguntaActiveIndex = index
    }

    agregarPreguntaForm() {
        this.changeIndexBancoForm(1)
        // agregar validaciones
        this.toggleValidationInformacionPregunta(true)
    }

    accionPreguntaTable({ accion, item }) {
        if (accion === 'editar') {
            this.changeIndexBancoForm(1)
            this.bancoPreguntasForm.get('1').patchValue(item)
            console.log(this.bancoPreguntasForm.get('1').value)
        }
        if (accion === 'eliminar') {
            this.eliminarPregunta(item)
        }
        if (accion === 'alternativas') {
            this.preguntaSelected = item
            this.toggleAlternativasSinEncabezado(true)
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
            console.log(this.preguntas)
        } else {
            this.preguntas.push(pregunta)
        }
    }

    guardarActualizarPreguntaForm() {
        if (this.bancoPreguntasForm.get('1').invalid) {
            this.bancoPreguntasForm.get('1').markAllAsTouched()
            return
        }
        const preguntaForm = { ...this.bancoPreguntasForm.get('1').value }
        // manejar el crud de preguntas local
        this.actualizarPreguntas(preguntaForm)
        this.changeIndexBancoForm(0)
        this.bancoPreguntasForm.get('1').reset(preguntaFormInfoDefaultValues)
        this.toggleValidationInformacionPregunta(false)
    }

    closeModal(data) {
        this._ref.close(data)
    }

    guardarActualizarBancoPreguntas() {
        console.log(
            this.bancoPreguntasForm.invalid,
            this.bancoPreguntasForm.value,
            this.bancoPreguntasForm
        )

        if (this.bancoPreguntasForm.invalid) {
            // mostrar menasje
            this.bancoPreguntasForm.markAllAsTouched()
            return
        }

        // if (this.alternativas.length == 0) {
        //     return
        // }

        const pregunta = this.bancoPreguntasForm.get('1').value
        pregunta.alternativasEliminadas = this.alternativasEliminadas
        const encabezado = this.bancoPreguntasForm.get('0').value
        pregunta.alternativas = this.alternativas

        let preguntas = [pregunta]
        if (this.formMode === 'SUB-PREGUNTAS') {
            preguntas = this.preguntas
        }

        pregunta.iNivelGradoId = 1
        pregunta.iEspecialistaId = 1

        const data = {
            encabezado,
            preguntas,
            preguntasEliminar: this.preguntasEliminar,
        }

        this._evaluacionesService
            .guardarActualizarPreguntaConAlternativas(data)
            .subscribe({
                next: () => {
                    this.closeModal(pregunta)
                },
            })
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }
}
