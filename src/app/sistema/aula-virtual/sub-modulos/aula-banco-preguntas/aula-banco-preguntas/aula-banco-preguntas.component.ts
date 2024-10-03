import { Component, inject, OnInit } from '@angular/core'
import { AulaBancoPreguntasModule } from '../aula-banco-preguntas.module'
import {
    actionsContainer,
    actionsTable,
    columns,
} from './aula-banco-preguntas.model'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ApiAulaBancoPreguntasService } from '../../../services/api-aula-banco-preguntas.service'
import { BancoPreguntaListaComponent } from '@/app/sistema/evaluaciones/sub-evaluaciones/banco-preguntas/components/banco-pregunta-lista/banco-pregunta-lista.component'

@Component({
    selector: 'app-aula-banco-preguntas',
    standalone: true,
    imports: [AulaBancoPreguntasModule, BancoPreguntaListaComponent],
    templateUrl: './aula-banco-preguntas.component.html',
    styleUrl: './aula-banco-preguntas.component.scss',
})
export class AulaBancoPreguntasComponent implements OnInit {
    public actionsTable = actionsTable
    public actionsContainer = actionsContainer
    public columnas = columns
    public bancoPreguntas = []
    public expandedRowKeys = {}

    private _aulaBancoApiService = inject(ApiAulaBancoPreguntasService)

    public params = {
        iCursoId: 1,
        iDocenteId: 1,
        iCurrContId: 1,
        iNivelCicloId: 1,
        busqueda: '',
        iTipoPregId: 0,
    }

    private _confirmService = inject(ConfirmationModalService)

    ngOnInit() {
        this.getData()
    }

    private getData() {
        this._aulaBancoApiService.obtenerBancoPreguntas(this.params).subscribe({
            next: (data) => {
                this.bancoPreguntas = data
                this.bancoPreguntas.forEach((item) => {
                    this.expandedRowKeys[item.iPreguntaId] = true
                })

                this.expandedRowKeys = Object.assign({}, this.expandedRowKeys)
            },
        })
    }

    public handleAcciones({ accion, item }) {
        console.log(accion, item)
        if (accion === 'agregar') {
            this.handleAgregarActualizarBancoPreguntas(null)
            return
        }
        if (accion === 'editar') {
            this.handleAgregarActualizarBancoPreguntas(item)
        }

        if (accion === 'eliminar') {
            this.handleEliminarBancoPreguntas(item)
        }
    }

    handleAgregarActualizarBancoPreguntas(pregunta) {
        console.log(pregunta)
    }

    handleEliminarBancoPreguntas(pregunta) {
        this._confirmService.openConfirm({
            header: '¿Esta seguro de agregar la pregunta?',
            accept: () => {
                console.log('eliminado', pregunta)
            },
        })
    }
}
