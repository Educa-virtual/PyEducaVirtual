import { Component } from '@angular/core'
import { FullCalendarComponent } from '@/app/shared/full-calendar/full-calendar.component'
import { PrimengModule } from '@/app/primeng.module'
import { Message } from 'primeng/api'

@Component({
    selector: 'app-actividades-no-lectivas',
    standalone: true,
    imports: [FullCalendarComponent, PrimengModule],
    templateUrl: './actividades-no-lectivas.component.html',
    styleUrl: './actividades-no-lectivas.component.scss',
})
export class ActividadesNoLectivasComponent {
    mensaje: Message[] = [
        {
            severity: 'info',
            detail: 'En esta sección podrá visualizar sus actividades no lectivas como también gestionar y subir evidencias, con un resumen en el calenario',
        },
    ]
}
