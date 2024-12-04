import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import { Component, Input, OnChanges } from '@angular/core'
import { MenuItem } from 'primeng/api'

@Component({
    selector: 'app-list-preguntas',
    standalone: true,
    imports: [ModalPrimengComponent, ContainerPageComponent, PrimengModule],
    templateUrl: './list-preguntas.component.html',
    styleUrl: './list-preguntas.component.scss',
})
export class ListPreguntasComponent implements OnChanges {
    @Input() showModalListPreguntas: boolean = false
    @Input() opcionModalPreguntas: string = ''
    @Input() tituloModalPreguntas: string = ''
    @Input() data

    showModal = true

    ngOnChanges(changes) {
        if (changes.data?.currentValue) {
            this.data = changes.data.currentValue
            console.log(this.data)
        }
    }

    tiposAgrecacionPregunta: MenuItem[] = [
        {
            label: 'Nueva Pregunta sin Enunciado',
            icon: 'pi pi-plus',
            command: () => {
                //this.handleNuevaPregunta()
            },
        },
        {
            label: 'Nueva Pregunta con Enunciado',
            icon: 'pi pi-plus',
            command: () => {
                //this.handleNuevaPregunta()
            },
        },
        {
            label: 'Agregar del banco de preguntas',
            icon: 'pi pi-plus',
            command: () => {
                //this.handleBancopregunta()
            },
        },
    ]
}
