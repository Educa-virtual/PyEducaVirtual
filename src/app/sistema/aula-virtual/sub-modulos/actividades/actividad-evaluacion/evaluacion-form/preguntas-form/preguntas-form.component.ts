import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    inject,
} from '@angular/core'
import { ModalPrimengComponent } from '../../../../../../../shared/modal-primeng/modal-primeng.component'
import { PrimengModule } from '@/app/primeng.module'
import { NgIf } from '@angular/common'
import { FormBuilder } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-preguntas-form',
    standalone: true,
    imports: [ModalPrimengComponent, PrimengModule, NgIf],
    templateUrl: './preguntas-form.component.html',
    styleUrl: './preguntas-form.component.scss',
})
export class PreguntasFormComponent implements OnChanges {
    private _FormBuilder = inject(FormBuilder)
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private _ConstantesService = inject(ConstantesService)

    @Output() accionBtnItem = new EventEmitter()

    @Input() showModalPreguntas
    @Input() cEvaluacionTitulo: string
    @Input() curso
    @Input() iEvaluacionId
    @Input() idEncabPregId

    iBancoId

    ngOnChanges(changes) {
        if (changes.showModalPreguntas?.currentValue) {
            this.showModalPreguntas = changes.showModalPreguntas.currentValue
        }
        if (changes.curso?.currentValue) {
            this.curso = changes.curso.currentValue
        }
        if (changes.iEvaluacionId?.currentValue) {
            this.iEvaluacionId = changes.iEvaluacionId.currentValue
            console.log(this.iEvaluacionId)
        }
    }

    formBancoPreguntas = this._FormBuilder.group({
        opcion: [''],
        valorBusqueda: [''],

        iBancoId: [''],
        iDocenteId: [''],
        iTipoPregId: [],
        iCurrContId: [''],
        dtBancoCreacion: [''],
        cBancoPregunta: [''],
        dtBancoTiempo: [''],
        cBancoTextoAyuda: [''],
        nBancoPuntaje: [''],
        idEncabPregId: [''],
        iCursoId: [''],
        iNivelCicloId: [''],

        //TABLA: EVALUACION_PREGUNTAS
        iEvalPregId: [''],
        iEvaluacionId: [''],
        cEvalPregPregunta: [''],
        dtEvalPregTiempo: [''],
        cEvalPregTextoAyuda: [''],
        nEvalPregPuntaje: [''],

        //
        alternativas: [],
    })

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({
                    accion: 'close-modal-preguntas-form',
                    item,
                })
                break
            case 'guardar-pregunta':
                this.formBancoPreguntas.controls.opcion.setValue(
                    'GUARDARxBancoPreguntas'
                )
                this.formBancoPreguntas.controls.iDocenteId.setValue(
                    this._ConstantesService.iDocenteId
                )
                this.formBancoPreguntas.controls.iNivelCicloId.setValue(
                    this.curso?.iNivelCicloId
                )
                this.formBancoPreguntas.controls.iCursoId.setValue(
                    this.curso?.iCursoId
                )
                this.formBancoPreguntas.controls.iCurrContId.setValue(
                    this._ConstantesService.iCurrContId
                )

                this.formBancoPreguntas.controls.iEvaluacionId.setValue(
                    this.iEvaluacionId
                )
                this.formBancoPreguntas.controls.cEvalPregPregunta.setValue(
                    this.formBancoPreguntas.value.cBancoPregunta
                )
                this.formBancoPreguntas.controls.cEvalPregTextoAyuda.setValue(
                    this.formBancoPreguntas.value.cBancoTextoAyuda
                )

                this.formBancoPreguntas.controls.alternativas.setValue(
                    this.alternativas
                )
                this.formBancoPreguntas.controls.idEncabPregId.setValue(
                    this.idEncabPregId
                )

                const params = {
                    petition: 'post',
                    group: 'evaluaciones',
                    prefix: 'banco-preguntas',
                    ruta: 'handleCrudOperation',
                    data: this.formBancoPreguntas.value,
                }
                this.getInformation(
                    params,
                    this.formBancoPreguntas.value.opcion
                )
                break
            case 'GUARDARxBancoPreguntas':
                this.accionBtn({ accion: 'close-modal', item: [] })
                break
        }
    }

    tipoPreguntas = [
        {
            iTipoPregId: 1,
            cTipoPregunta: 'Opción única',
        },
        {
            iTipoPregId: 2,
            cTipoPregunta: 'Opción múltiple',
        },
        {
            iTipoPregId: 3,
            cTipoPregunta: 'Opción libre',
        },
    ]

    //TABLA: BANCO_ALTERNATIVAS
    // iBancoAltId
    // iBancoId
    // cBancoAltLetra
    // cBancoAltDescripcion
    // bBancoAltRptaCorrecta
    // cBancoAltExplicacionRpta

    alternativas = []
    cAlternativa: string = ''
    cAlternativaExplicacion: string = ''
    bRptaCorreta: boolean = false
    agregarAlternativa() {
        this.alternativas.push({
            iBancoAltId: null,
            iBancoId: this.iBancoId,
            cBancoAltLetra: null,
            cBancoAltDescripcion: this.cAlternativa,
            bBancoAltRptaCorrecta: this.bRptaCorreta,
            cBancoAltExplicacionRpta: this.cAlternativaExplicacion,
        })
        this.cAlternativa = ''
        this.cAlternativaExplicacion = ''
        this.bRptaCorreta = false
    }

    getInformation(params, accion) {
        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.accionBtn({ accion, item: response?.data })
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
                this._MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }
}
