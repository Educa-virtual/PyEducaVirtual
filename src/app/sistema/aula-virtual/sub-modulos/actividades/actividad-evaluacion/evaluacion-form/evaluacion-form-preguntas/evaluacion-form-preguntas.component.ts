import { BancoPreguntaListaComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-lista/banco-pregunta-lista.component'
import { CommonModule } from '@angular/common'
import { Component, inject, Input } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { DialogService } from 'primeng/dynamicdialog'
import { AulaBancoPreguntasModule } from '../../../../aula-banco-preguntas/aula-banco-preguntas.module'
import { AulaBancoPreguntasService } from '../../../../aula-banco-preguntas/aula-banco-preguntas/aula-banco-.preguntas.service'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { AulaBancoPreguntasComponent } from '../../../../aula-banco-preguntas/aula-banco-preguntas/aula-banco-preguntas.component'

@Component({
    selector: 'app-evaluacion-form-preguntas',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        MenuModule,
        BancoPreguntaListaComponent,
        AulaBancoPreguntasModule,
    ],
    templateUrl: './evaluacion-form-preguntas.component.html',
    styleUrl: './evaluacion-form-preguntas.component.scss',
    providers: [DialogService, AulaBancoPreguntasService],
})
export class EvaluacionFormPreguntasComponent {
    @Input() tituloEvaluacion: string = 'Sin título de evaluación'

    @Input() preguntas: any[] = []

    private _dialogService = inject(DialogService)
    private _aulaBancoPreguntasService = inject(AulaBancoPreguntasService)

    tiposAgrecacionPregunta: MenuItem[] = [
        {
            label: 'Nueva Pregunta',
            icon: 'pi pi-plus',
            command: () => {
                this.handleNuevaPregunta()
            },
        },
        {
            label: 'Del banco de preguntas',
            icon: 'pi pi-plus',
            command: () => {
                this.handleBancopregunta()
            },
        },
    ]

    constructor() {}

    handleNuevaPregunta() {
        this.agregarEditarPregunta({
            iPreguntaId: 0,
            preguntas: [],
            iEncabPregId: -1,
        })
    }

    agregarEditarPregunta(pregunta) {
        const refModal = this._aulaBancoPreguntasService.openPreguntaModal({
            pregunta,
            iCursoId: 1,
            tipoPreguntas: [],
        })
        refModal.onClose.subscribe((result) => {
            if (result) {
                console.log(result)
            }
        })
    }

    handleBancopregunta() {
        this._dialogService.open(AulaBancoPreguntasComponent, {
            ...MODAL_CONFIG,
        })
    }
}
