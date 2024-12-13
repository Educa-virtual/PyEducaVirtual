import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { MenuItem } from 'primeng/api'
import { AulaBancoPreguntasComponent } from '../../../../aula-banco-preguntas/aula-banco-preguntas/aula-banco-preguntas.component'
import { PreguntasFormComponent } from '../../evaluacion-form/preguntas-form/preguntas-form.component'
import { ApiAulaBancoPreguntasService } from '@/app/sistema/aula-virtual/services/api-aula-banco-preguntas.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-list-preguntas',
    standalone: true,
    imports: [
        PrimengModule,
        AulaBancoPreguntasComponent,
        PreguntasFormComponent,
    ],
    templateUrl: './list-preguntas.component.html',
    styleUrl: './list-preguntas.component.scss',
})
export class ListPreguntasComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()
    private _ApiAulaBancoPreguntasService = inject(ApiAulaBancoPreguntasService)
    private _ConstantesService = inject(ConstantesService)

    @Input() data

    showModal = true
    showModalPreguntas: boolean = false
    showModalBancoPreguntas: boolean = false
    showEncabezado: boolean = false
    preguntasSeleccionadas = []

    ngOnChanges(changes) {
        if (changes.data?.currentValue) {
            this.data = changes.data.currentValue
        }
    }

    tiposAgrecacionPregunta: MenuItem[] = [
        {
            label: 'Nueva Pregunta sin Enunciado',
            icon: 'pi pi-plus',
            command: () => {
                this.handleNuevaPregunta(false)
            },
        },
        {
            label: 'Nueva Pregunta con Enunciado',
            icon: 'pi pi-plus',
            command: () => {
                this.handleNuevaPregunta(true)
            },
        },
        {
            label: 'Agregar del banco de preguntas',
            icon: 'pi pi-plus',
            command: () => {
                this.handleBancopregunta()
            },
        },
    ]

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
            case 'close-modal-preguntas-form':
                this.showModalPreguntas = false
                break
            case 'guardar-pregunta':
                const preguntas = [
                    {
                        isLocal: false,
                        iPreguntaId: null,
                        iTipoPregId: item.iTipoPregId,
                        cPregunta: item.cPregunta,
                        cPreguntaTextoAyuda: item.cPreguntaTextoAyuda,
                        iPreguntaPeso: item.iPreguntaPeso,
                        alternativas: item.Alternativas,
                    },
                ]
                const params = {
                    iEvaluacionId: 117,
                    iEncabPregId: '-1',
                    iDocenteId: this._ConstantesService.iDocenteId,
                    iCursoId: null,
                    iCurrContId: null,
                    iNivelCicloId: null,
                    preguntas: preguntas,
                    // iTipoPregId : item.iTipoPregId,
                    // iPreguntaPeso : item.iPreguntaPeso,
                    // cPreguntaTextoAyuda : item.cPreguntaTextoAyuda,
                    // cPregunta : item.cPregunta,
                    // Alternativas : item.Alternativas,
                }
                this.guardarActualizarPreguntaConAlternativas(params)
                break
        }
    }

    handleBancopregunta() {
        this.showModalBancoPreguntas = true
    }

    selectedRowDataChange(event) {
        this.preguntasSeleccionadas = [...event]
    }

    handleNuevaPregunta(encabezado) {
        this.showEncabezado = encabezado
        this.showModalPreguntas = true
    }

    guardarActualizarPreguntaConAlternativas(data) {
        console.log(data)
        this._ApiAulaBancoPreguntasService
            .guardarActualizarPreguntaConAlternativas(data)
            .subscribe({
                next: (response) => {
                    console.log(response)
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
    }
}
