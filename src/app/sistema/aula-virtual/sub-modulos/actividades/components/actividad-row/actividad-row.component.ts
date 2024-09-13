import { ColorByNumberPipe } from '@/app/shared/pipes/color-by-number/color-by-number.pipe'
import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { AccordionModule } from 'primeng/accordion'
import { MenuModule } from 'primeng/menu'
import { PanelModule } from 'primeng/panel'

@Component({
    selector: 'app-actividad-row',
    standalone: true,
    imports: [
        CommonModule,
        AccordionModule,
        MenuModule,
        PanelModule,
        ColorByNumberPipe,
    ],
    templateUrl: './actividad-row.component.html',
    styleUrl: './actividad-row.component.scss',
})
export class ActividadRowComponent {
    @Input({ required: true }) actividad: IActividad
}
