import { PrimengModule } from '@/app/primeng.module'
import { IIcon } from '@/app/shared/icon/icon.interface'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MenuItem } from 'primeng/api'

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
    imports: [PrimengModule],
})
export class ContainerPageAccionbComponent {
    @Output() accionBtnItem = new EventEmitter()
    @Input() title: string = ''
    @Input() titleBtn: string = ''
    @Input() showActions: boolean = true
    @Input() actions: MenuItem[] | undefined = [
        {
            items: [
                {
                    label: 'Menu 1',
                    icon: 'pi pi-list',
                },
            ],
        },
    ]
    accionBtn(accion) {
        this.accionBtnItem.emit({
            accion: accion,
            item: accion,
        })
    }
}
