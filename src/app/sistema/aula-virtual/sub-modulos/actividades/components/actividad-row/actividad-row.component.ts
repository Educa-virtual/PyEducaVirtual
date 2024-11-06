import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'

import { IconComponent } from '@/app/shared/icon/icon.component'
import { ActividadConfigPipe } from '@/app/sistema/aula-virtual/pipes/actividad-config.pipe'
import { MenuItem } from 'primeng/api'
import { IsIconTypePipe } from '@/app/shared/pipes/is-icon-type.pipe'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-actividad-row',
    standalone: true,
    imports: [
        CommonModule,
        IconComponent,
        ActividadConfigPipe,
        IsIconTypePipe,
        PrimengModule,
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
