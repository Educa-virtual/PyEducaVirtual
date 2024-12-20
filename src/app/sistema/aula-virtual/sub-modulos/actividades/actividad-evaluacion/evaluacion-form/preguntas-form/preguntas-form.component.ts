import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    inject,
} from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { NgIf } from '@angular/common'
import { FormBuilder } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { abecedario } from '@/app/sistema/aula-virtual/constants/aula-virtual'

@Component({
    selector: 'app-preguntas-form',
    standalone: true,
    imports: [PrimengModule, NgIf],
    templateUrl: './preguntas-form.component.html',
    styleUrl: './preguntas-form.component.scss',
})
export class PreguntasFormComponent implements OnChanges {
    private _FormBuilder = inject(FormBuilder)
    private _GeneralService = inject(GeneralService)
    private _MessageService = inject(MessageService)
    private _ConstantesService = inject(ConstantesService)

    @Output() accionBtnItem = new EventEmitter()

    @Input() showModalPreguntas: boolean = false
    @Input() cEvaluacionTitulo: string
    @Input() curso
    @Input() iEvaluacionId
    @Input() idEncabPregId
    @Input() data

    iBancoId
    opcion: string = 'GUARDAR'

    ngOnChanges(changes) {
        if (changes.showModalPreguntas?.currentValue) {
            this.showModalPreguntas = changes.showModalPreguntas.currentValue
            if (this.formBancoPreguntas) {
                this.formBancoPreguntas.reset()
                this.formBancoPreguntas.controls.iTipoPregId.setValue(1)
                this.cAlternativa = ''
                this.cAlternativaExplicacion = ''
                this.bRptaCorreta = false
                this.alternativas = []
            }
        }
        if (changes.curso?.currentValue) {
            this.curso = changes.curso.currentValue
        }
        if (changes.iEvaluacionId?.currentValue) {
            this.iEvaluacionId = changes.iEvaluacionId.currentValue
        }
        if (changes.data?.currentValue) {
            this.data = changes.data.currentValue
            const data = this.data.length ? this.data[0] : null
            this.opcion = this.data.length ? 'ACTUALIZAR' : 'GUARDAR'
            this.formBancoPreguntas.patchValue(data)
            if (data) {
                this.alternativas = data['alternativas']
                    ? JSON.parse(data['alternativas'])
                    : []
                this.formBancoPreguntas.controls.iTipoPregId.setValue(
                    Number(data['iTipoPregId'])
                )
                console.log(this.alternativas)
            }
        }
    }

    formBancoPreguntas = this._FormBuilder.group({
        opcion: [''],
        valorBusqueda: [''],

        iBancoId: [''],
        iDocenteId: [''],
        iTipoPregId: [1],
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
                const iRptaCorrecta = this.alternativas.filter(
                    (i) => i.bBancoAltRptaCorrecta
                ).length
                const iAlternativas = this.alternativas.length
                switch (this.formBancoPreguntas.value.iTipoPregId) {
                    case 1:
                        if (iRptaCorrecta !== 1 || iAlternativas <= 2) {
                            this._MessageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Debe haber solo una alternativa correcta y más de 2 alternativas. ',
                            })
                            return
                        }
                        break
                    case 2:
                        if (iRptaCorrecta < 2 || iAlternativas <= 3) {
                            this._MessageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Debe haber más de una alternativa correcta y más de 3 alternativas. ',
                            })
                            return
                        }
                        break
                }
                this.formBancoPreguntas.controls.opcion.setValue(
                    this.opcion + 'xBancoPreguntas'
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
            case this.opcion + 'xBancoPreguntas':
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
    cAlternativa: string = null
    cAlternativaExplicacion: string = null
    bRptaCorreta: boolean = false
    agregarAlternativa() {
        const letra = abecedario.find((i) => i.id === this.alternativas.length)

        this.alternativas.push({
            iBancoAltId: null,
            iBancoId: this.iBancoId,
            cBancoAltLetra: letra.code,
            cBancoAltDescripcion: this.cAlternativa,
            bBancoAltRptaCorrecta: this.bRptaCorreta,
            cBancoAltExplicacionRpta: this.cAlternativaExplicacion,
            bImage: this.cAlternativa.includes('image') ? true : false,
        })
        this.cAlternativa = null
        this.cAlternativaExplicacion = null
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
