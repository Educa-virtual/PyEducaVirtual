import { PrimengModule } from '@/app/primeng.module'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core'
import { MenuItem } from 'primeng/api'
import { AulaBancoPreguntasComponent } from '../../../../aula-banco-preguntas/aula-banco-preguntas/aula-banco-preguntas.component'
import { PreguntasFormComponent } from '../../evaluacion-form/preguntas-form/preguntas-form.component'

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
}
