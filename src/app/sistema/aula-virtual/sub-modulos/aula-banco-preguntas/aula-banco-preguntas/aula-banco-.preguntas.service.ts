import { DialogService } from 'primeng/dynamicdialog'
import { AulaBancoPreguntaFormContainerComponent } from './components/aula-banco-pregunta-form-container/aula-banco-pregunta-form-container.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { Injectable } from '@angular/core'

@Injectable()
export class AulaBancoPreguntasService {
    constructor(private _dialogService: DialogService) {}

    // Función auxiliar para obtener el header
    getHeader(pregunta: any): string {
        return pregunta.iPreguntaId == 0 ? 'Nueva pregunta' : 'Editar pregunta'
    }

    // Función para abrir el modal
    openPreguntaModal(data: {
        pregunta
        iCursoId
        tipoPreguntas
        iEvaluacionId
        padreComponente
    }) {
        const refModal = this._dialogService.open(
            AulaBancoPreguntaFormContainerComponent,
            {
                ...MODAL_CONFIG,
                data,
                header: this.getHeader(data.pregunta),
            }
        )

        return refModal
    }
}
