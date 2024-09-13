import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { Component, Input } from '@angular/core'
import { ActividadRowComponent } from '../actividad-row/actividad-row.component'

@Component({
    selector: 'app-actividad-lista',
    standalone: true,
    imports: [ActividadRowComponent],
    templateUrl: './actividad-lista.component.html',
    styleUrl: './actividad-lista.component.scss',
})
export class ActividadListaComponent {
    @Input({ required: true }) actividades: IActividad[]
}
