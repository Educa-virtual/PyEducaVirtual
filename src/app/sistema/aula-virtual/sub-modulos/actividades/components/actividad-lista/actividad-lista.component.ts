import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ActividadRowComponent } from '../actividad-row/actividad-row.component'
import { MenuModule } from 'primeng/menu'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-actividad-lista',
    standalone: true,
    imports: [ActividadRowComponent, MenuModule, PrimengModule],
    templateUrl: './actividad-lista.component.html',
    styleUrl: './actividad-lista.component.scss',
})
export class ActividadListaComponent {
    @Input({ required: true }) actividades: IActividad[]

    @Output() actionSelected = new EventEmitter<{
        actividad: IActividad
        action: string
    }>()
}
