import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { provideIcons } from '@ng-icons/core'
import { matCalendarMonth } from '@ng-icons/material-icons/baseline'
import { TareaRoomComponent } from '../../actividades/actividad-tarea/tarea-room/tarea-room.component'
import { EvaluacionRoomComponent } from '../../actividades/actividad-evaluacion/evaluacion-room/evaluacion-room.component'

@Component({
    selector: 'app-actividad',
    standalone: true,
    imports: [CommonModule, TareaRoomComponent, EvaluacionRoomComponent],
    templateUrl: './actividad.component.html',
    styleUrl: './actividad.component.scss',
    providers: [provideIcons({ matCalendarMonth })],
})
export class ActividadComponent implements OnInit {
    public iActTopId = 0

    private _router = inject(Router)
    private readonly _activatedRoute = inject(ActivatedRoute)

    ngOnInit() {
        this.iActTopId = parseInt(
            this._activatedRoute.snapshot.params['iActTopId']
        )
    }
}
