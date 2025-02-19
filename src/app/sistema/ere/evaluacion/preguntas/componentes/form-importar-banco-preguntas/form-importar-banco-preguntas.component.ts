import { PrimengModule } from '@/app/primeng.module'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { AulaBancoPreguntasComponent } from '@/app/sistema/aula-virtual/sub-modulos/aula-banco-preguntas/aula-banco-preguntas/aula-banco-preguntas.component'
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
    selector: 'app-form-importar-banco-preguntas',
    standalone: true,
    imports: [
        ModalPrimengComponent,
        PrimengModule,
        AulaBancoPreguntasComponent,
    ],
    templateUrl: './form-importar-banco-preguntas.component.html',
    styleUrl: './form-importar-banco-preguntas.component.scss',
})
export class FormImportarBancoPreguntasComponent {
    @Output() accionBtnItem = new EventEmitter()
    @Input() showModal: boolean = false

    params = {
        iCursoId: 0,
        iDocenteId: null,
        iCurrContId: null,
        iNivelCicloId: null,
        iYearId: 0, // Nuevo parámetro para el año
        iSeccionId: 0, // Nuevo parámetro para la sección
        busqueda: '',
        iTipoPregId: 0,
        iEvaluacionId: 0,
        iGradoId: 0,
    }
    origen = [
        {
            iOrigenId: 0,
            cOrigen: 'Todos',
        },
        {
            iOrigenId: 1,
            cOrigen: 'Personal',
        },
        {
            iOrigenId: 2,
            cOrigen: 'Docentes',
        },
    ]
    docentes = [
        {
            iDocenteId: 0,
            cDocente: 'Todos',
        },
        {
            iDocenteId: 1,
            cDocente: 'Juan David Reyes Elizondo',
        },
        {
            iDocenteId: 2,
            cDocente: 'Flor de María de los Ángeles Villafuerte Casas',
        },
        {
            iDocenteId: 3,
            cDocente: 'Erica Esther Mamani Quispe',
        },
        {
            iDocenteId: 4,
            cDocente: 'Andrew Ríos Eyzaguirre',
        },
    ]

    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                this.accionBtnItem.emit({ accion, item })
                break
        }
    }
}
