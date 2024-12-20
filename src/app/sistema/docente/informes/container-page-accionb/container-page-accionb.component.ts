import { PrimengModule } from '@/app/primeng.module'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { IIcon } from '@/app/shared/icon/icon.interface'
import { IsIconTypePipe } from '@/app/shared/pipes/is-icon-type.pipe'
import { Component, EventEmitter, Input, Output } from '@angular/core'

export interface IActionContainer {
    labelTooltip: string
    text: string
    icon: string | IIcon
    accion: string
    class: string
}
@Component({
    selector: 'app-container-page-accionb',
    standalone: true,
    templateUrl: './container-page-accionb.component.html',
    styleUrls: ['./container-page-accionb.component.scss'],
    imports: [PrimengModule, IconComponent, IsIconTypePipe],
})
export class ContainerPageAccionbComponent {
    @Output() accionBtnItem = new EventEmitter()
    @Input() title: string = 'Titulo'
    @Input() subtitle?: string
    @Input() actions: IActionContainer[] = [
        // {
        //     labelTooltip: 'Agregar',
        //     text: 'Agregar',
        //     icon: 'pi pi-plus',
        //     accion: 'agregar',
        //     class: 'p-button-primary',
        // },
        {
            labelTooltip: 'Descargar Pdf',
            text: 'Descargar Pdf',
            icon: 'pi pi-file-pdf',
            accion: 'descargar_pdf',
            class: 'p-button-danger',
        },
        // {
        //     labelTooltip: 'Descargar Excel',
        //     text: 'Descargar Excel',
        //     icon: 'pi pi-download',
        //     accion: 'Descargar Excel',
        //     class: 'p-button-success',
        // },
    ]

    accionBtn(accion, item) {
        const data = {
            accion,
            item,
        }
        this.accionBtnItem.emit(data)
    }
}
