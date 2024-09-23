import { Component, EventEmitter, Input, Output } from '@angular/core'
import { PrimengModule } from 'src/app/primeng.module'
import { IconComponent, IconSize } from '../icon/icon.component'

export interface IIconAction {
    color: string
    size?: IconSize
    name: string
}

export interface IActionContainer {
    labelTooltip: string
    text: string
    icon: string | IIconAction
    accion: string
    class: string
}

@Component({
    selector: 'app-container-page',
    standalone: true,
    imports: [PrimengModule, IconComponent],
    templateUrl: './container-page.component.html',
    styleUrl: './container-page.component.scss',
})
export class ContainerPageComponent {
    @Output() accionBtnItem = new EventEmitter()
    @Input() title: string = 'Titulo'
    @Input() subtitle?: string
    @Input() actions: IActionContainer[] = [
        {
            labelTooltip: 'Agregar',
            text: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Descargar Pdf',
            text: 'Descargar Pdf',
            icon: 'pi pi-file-pdf',
            accion: 'descargar_pdf',
            class: 'p-button-danger',
        },
        {
            labelTooltip: 'Descargar Excel',
            text: 'Descargar Excel',
            icon: 'pi pi-download',
            accion: 'Descargar Excel',
            class: 'p-button-success',
        },
        {
            labelTooltip: 'Descargar Excel',
            text: 'Descargar Excel',
            icon: 'pi pi-download',
            accion: 'Descargar Excel',
            class: 'p-button-success',
        },
    ]

    accionBtn(accion, item) {
        const data = {
            accion,
            item,
        }
        this.accionBtnItem.emit(data)
    }

    isIconObject(icon): icon is { name: string; size: string; color: string } {
        return typeof icon === 'object' && icon !== null && 'name' in icon
    }
}
