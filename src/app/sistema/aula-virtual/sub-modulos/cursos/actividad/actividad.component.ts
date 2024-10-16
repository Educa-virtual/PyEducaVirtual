import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { provideIcons } from '@ng-icons/core'
import { matCalendarMonth } from '@ng-icons/material-icons/baseline'
import { TareaRoomComponent } from '../../actividades/actividad-tarea/tarea-room/tarea-room.component'
import { EvaluacionRoomComponent } from '../../actividades/actividad-evaluacion/evaluacion-room/evaluacion-room.component'
import { tipoActividadesKeys } from '../../../interfaces/actividad.interface'

@Component({
    selector: 'app-actividad',
    standalone: true,
    imports: [CommonModule, TareaRoomComponent, EvaluacionRoomComponent],
    templateUrl: './actividad.component.html',
    styleUrl: './actividad.component.scss',
    providers: [provideIcons({ matCalendarMonth })],
})
export class ActividadComponent implements OnInit {
    public iActTopId: tipoActividadesKeys

    private _router = inject(Router)
    private readonly _activatedRoute = inject(ActivatedRoute)

    ngOnInit() {
        const keyTab = this._activatedRoute.snapshot.params['iActTopId']
        this.iActTopId = keyTab as tipoActividadesKeys
        console.log(keyTab, this.iActTopId)
    }
}
