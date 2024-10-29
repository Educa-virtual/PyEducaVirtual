import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { AccordionModule } from 'primeng/accordion'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { PanelModule } from 'primeng/panel'

import { IconComponent } from '@/app/shared/icon/icon.component'
import { ActividadConfigPipe } from '@/app/sistema/aula-virtual/pipes/actividad-config.pipe'
import { MenuItem } from 'primeng/api'
import { IsIconTypePipe } from '@/app/shared/pipes/is-icon-type.pipe'

@Component({
    selector: 'app-actividad-row',
    standalone: true,
    imports: [
        CommonModule,
        AccordionModule,
        MenuModule,
        PanelModule,
        ButtonModule,
        IconComponent,
        ActividadConfigPipe,
        IsIconTypePipe,
    ],
    templateUrl: './actividad-row.component.html',
    styleUrl: './actividad-row.component.scss',
})
export class ActividadRowComponent {
    @Input({ required: true }) actividad: IActividad
    @Output() actionSelected = new EventEmitter<{
        actividad: IActividad
        action: string
    }>()

    public accionesActividad: MenuItem[] | undefined

    onAction(action: string, event: Event) {
        this.actionSelected.emit({ actividad: this.actividad, action })
        event.stopPropagation()
    }
}
