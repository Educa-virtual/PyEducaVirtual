import { Component, inject, OnInit } from '@angular/core'
import { RubricasModule } from './rubricas.module'
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { DialogService } from 'primeng/dynamicdialog'
import { RubricaFormComponent } from './components/rubrica-form/rubrica-form.component'
import { MODAL_CONFIG } from '@/app/shared/constants/modal.config'
import { ApiEvaluacionesService } from '@/app/sistema/evaluaciones/services/api-evaluaciones.service'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'app-rubricas',
    standalone: true,
    imports: [RubricasModule],
    templateUrl: './rubricas.component.html',
    styleUrl: './rubricas.component.scss',
})
export class RubricasComponent implements OnInit {
    public columnasTabla: IColumn[] = [
        {
            type: 'text',
            width: 'auto',
            field: 'cIntrumentoNombre',
            header: 'Instrumento de Evaluación',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cIntrumentoDescripcion',
            header: 'Descripcion',
            text_header: 'left',
            text: 'left',
        },
    ]

    public data = []
    private _dialogService = inject(DialogService)
    private _evaluacionApiService = inject(ApiEvaluacionesService)
    private _unsubscribe$ = new Subject<boolean>()

    ngOnInit() {
        this.getData()
    }

    getData() {
        this.obtenerRubricas()
    }

    obtenerRubricas() {
        this._evaluacionApiService
            .obtenerRubricas({})
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (data) => {
                    this.data = data
                },
            })
    }

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
