import { Component, inject, OnInit } from '@angular/core'
import { AulaBancoPreguntasModule } from '../aula-banco-preguntas.module'
import {
    actionsContainer,
    actionsTable,
    columns,
} from './aula-banco-preguntas.model'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

@Component({
    selector: 'app-aula-banco-preguntas',
    standalone: true,
    imports: [AulaBancoPreguntasModule],
    templateUrl: './aula-banco-preguntas.component.html',
    styleUrl: './aula-banco-preguntas.component.scss',
})
export class AulaBancoPreguntasComponent implements OnInit {
    public actionsTable = actionsTable
    public actionsContainer = actionsContainer
    public columnas = columns

    private _confirmService = inject(ConfirmationModalService)
    ngOnInit() {
        console.log('obtener datos')
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
