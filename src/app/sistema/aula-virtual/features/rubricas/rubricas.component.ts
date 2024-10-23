import { Component, inject } from '@angular/core'
import { RubricasModule } from './rubricas.module'
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { DialogService } from 'primeng/dynamicdialog'
import { RubricaFormComponent } from './components/rubrica-form/rubrica-form.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'

@Component({
    selector: 'app-rubricas',
    standalone: true,
    imports: [RubricasModule],
    templateUrl: './rubricas.component.html',
    styleUrl: './rubricas.component.scss',
})
export class RubricasComponent {
    public columnasTabla: IColumn[] = [
        {
            type: 'text',
            width: 'auto',
            field: 'cInstrumentoNombre',
            header: 'Instrumento de Evaluación',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cInstrumentoDescripcion',
            header: 'Descripcion',
            text_header: 'left',
            text: 'left',
        },
    ]

    public data = []

    private _dialogService = inject(DialogService)

    agregarInstrumentoEvaluacion() {
        this.agregarActualizarEvaluacionModal(null)
    }

    agregarActualizarEvaluacionModal(item) {
        const header = item == null ? 'Crear rubrica' : 'Editar rubrica'
        this._dialogService.open(RubricaFormComponent, {
            ...MODAL_CONFIG,
            header,
            data: {
                rubrica: item,
            },
        })
    }

    public onActionBtn({ accion, item }) {
        console.log(accion, item)
    }
}
