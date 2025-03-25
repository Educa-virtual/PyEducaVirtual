import { Component } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'app-resumen',
    standalone: true,
    imports: [ContainerPageComponent, TablePrimengComponent],
    templateUrl: './resumen.component.html',
    styleUrl: './resumen.component.scss',
})
export class ResumenComponent {
    @Output() emitMode = new EventEmitter()

    actionBtn(mode) {
        this.emitMode.emit(mode)
    }
    actionsContainer = [
        {
            labelTooltip: 'Regresar',
            text: 'Regresar',
            icon: 'pi pi-arrow-left',
            accion: '',
            class: 'p-button-primary',
        },
    ]
}
