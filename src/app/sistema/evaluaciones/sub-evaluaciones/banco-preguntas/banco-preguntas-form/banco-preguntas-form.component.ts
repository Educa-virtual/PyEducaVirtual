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

import { Subject } from 'rxjs'
import { ApiEvaluacionesRService } from '../../../services/api-evaluaciones-r.service'
import { BancoPreguntaInformacionFormComponent } from './banco-pregunta-informacion-form/banco-pregunta-informacion-form.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { BancoPreguntaFormListComponent } from '../components/banco-pregunta-form-list/banco-pregunta-form-list.component'
import { generarIdAleatorio } from '@/app/shared/utils/random-id'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { MenuItem } from 'primeng/api'
import { BancoPreguntaEncabezadoFormComponent } from '../components/banco-pregunta-encabezado-form/banco-pregunta-encabezado-form.component'
import { BancoPreguntasModule } from '../banco-preguntas.module'

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
        BancoPreguntaFormListComponent,
        BancoPreguntaEncabezadoFormComponent,
        BancoPreguntasModule,
        ReactiveFormsModule,
    ],
    templateUrl: './banco-preguntas-form.component.html',
    styleUrl: './banco-preguntas-form.component.scss',
})
export class BancoPreguntasFormComponent implements OnInit, OnDestroy {
    @Output() closeModalChange = new EventEmitter()
    @Output() submitChange = new EventEmitter()
    @Input() public tipoPreguntas = []
    @Input() public encabezados = []
    @Input() public bancoPreguntasForm: FormGroup
    @Input() public encabezadosFiltered = []
    private _pregunta

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
            this.handleConEncabezado()
        } else {
            this.formMode = 'UNA-PREGUNTA'
            this.preguntaSelected = pregunta
            this.handleSinEncabezado()
            if (this.modePregunta === 'EDITAR') {
                this.patchForm(pregunta)
            }
        }
        this._pregunta = pregunta
    }

    get pregunta() {
        return this._pregunta
    }

    public customOptions = []
    public preguntas = []

    @Input() public modePregunta: 'EDITAR' | 'CREAR' = 'CREAR'
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

    ngOnInit() {
        // Llenar el formulario paso 1 basado en la seleccion de la cabecera.
        this.bancoPreguntasForm
            .get('0.encabezadoSelected')
            .valueChanges.subscribe((value) => {
                if (this.esSinEncabezado) {
                    this.handleSinEncabezado()
                } else {
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

    private handleSinEncabezado() {
        this.agregarQuitarValidacionesFormPregunta('AGREGAR')
        this.agregarQuitarValidacionesEncabezado('QUITAR')
        this.agregarQuitarAlternativasPaso('AGREGAR')
    }

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
                .setValidators([Validators.required])
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
        this.bancoPreguntasForm.get('1').patchValue(pregunta)
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
        const preguntaForm = { ...this.bancoPreguntasForm.get('1').value }
        // manejar el crud de preguntas local
        this.actualizarPreguntas(preguntaForm)
        this.changeIndexBancoForm(0)
        this.bancoPreguntasForm.get('1').reset(preguntaFormInfoDefaultValues)
        this.agregarQuitarValidacionesFormPregunta('QUITAR')
        this.toggleStepsVisibility(true)
    }

    // enviar el formulario de banco de preguntas a guardar o actualizar
    guardarActualizarBancoPreguntas() {
        if (this.bancoPreguntasForm.invalid) {
            this.bancoPreguntasForm.markAllAsTouched()
            return
        }

        const pregunta = this.bancoPreguntasForm.get('1').value
        pregunta.alternativasEliminadas = this.alternativasEliminadas
        const encabezado = this.bancoPreguntasForm.get('0').value
        pregunta.alternativas = this.alternativas
        pregunta.cPreguntaClave = this.getPreguntaClave(pregunta.alternativas)

        let preguntas = [pregunta]

        if (this.formMode === 'SUB-PREGUNTAS') {
            preguntas = this.preguntas
            preguntas = preguntas.map((x) => {
                x.cPreguntaClave = this.getPreguntaClave(x.alternativas)
            })
        }

        pregunta.iNivelGradoId = 1
        pregunta.iEspecialistaId = 1

        const data = {
            encabezado,
            preguntas,
            preguntasEliminar: this.preguntasEliminar,
        }

        this.submitChange.emit(data)
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
}
