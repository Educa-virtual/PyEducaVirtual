import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { provideIcons } from '@ng-icons/core'
import { matCalendarMonth } from '@ng-icons/material-icons/baseline'
import { TareaRoomComponent } from '../../actividades/actividad-tarea/tarea-room/tarea-room.component'
import { EvaluacionRoomComponent } from '../../actividades/actividad-evaluacion/evaluacion-room/evaluacion-room.component'
import { tipoActividadesKeys } from '../../../interfaces/actividad.interface'
import { ForoRoomComponent } from '../../actividades/actividad-foro/foro-room/foro-room.component'
import { VideoconferenciaFormContainerComponent } from '../../actividades/actividad-videoconferencia/videoconferencia-form-container/videoconferencia-form-container.component'

@Component({
    selector: 'app-actividad',
    standalone: true,
    imports: [
        CommonModule,
        TareaRoomComponent,
        EvaluacionRoomComponent,
        ForoRoomComponent,
        VideoconferenciaFormContainerComponent,
    ],
    templateUrl: './actividad.component.html',
    styleUrl: './actividad.component.scss',
    providers: [provideIcons({ matCalendarMonth })],
})
export class ActividadComponent implements OnInit {
    @Input() ixActivadadId: string
    @Input() iProgActId: string
    public iActTopId: tipoActividadesKeys

    private _router = inject(Router)
    private readonly _activatedRoute = inject(ActivatedRoute)

    ngOnInit() {
        const keyTab = this._activatedRoute.snapshot.params['iActTopId']
        const tab = parseInt(keyTab)
        this.iActTopId = tab as tipoActividadesKeys
    }
}
