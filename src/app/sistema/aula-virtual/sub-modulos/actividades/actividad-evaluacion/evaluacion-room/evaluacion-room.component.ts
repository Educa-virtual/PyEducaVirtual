import { IconComponent } from '@/app/shared/icon/icon.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { TabViewModule } from 'primeng/tabview'
import { LeyendaTareasComponent } from '../../components/leyenda-tareas/leyenda-tareas.component'
import { provideIcons } from '@ng-icons/core'
import {
    matAccessTime,
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
} from '@ng-icons/material-icons/baseline'
import { ActivatedRoute } from '@angular/router'
import { tipoActividadesKeys } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { Subject, takeUntil } from 'rxjs'
import { EvaluacionFormPreguntasComponent } from '../evaluacion-form/evaluacion-form-preguntas/evaluacion-form-preguntas.component'

@Component({
    selector: 'app-evaluacion-room',
    standalone: true,
    imports: [
        CommonModule,
        IconComponent,
        TabViewModule,
        ButtonModule,
        TablePrimengComponent,
        LeyendaTareasComponent,
        EvaluacionFormPreguntasComponent,
    ],
    templateUrl: './evaluacion-room.component.html',
    styleUrl: './evaluacion-room.component.scss',
    providers: [
        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,
        }),
    ],
})
export class EvaluacionRoomComponent implements OnInit {
    @Input() ixActivadadId: string
    @Input() iActTopId: tipoActividadesKeys
    private _route = inject(ActivatedRoute)
    private _aulaService = inject(ApiAulaService)
    private unsbscribe$ = new Subject<boolean>()
    public iPerfilId = 1
    public evaluacion

    ngOnInit() {
        this.obtenerEvaluacion()
    }

    obtenerEvaluacion() {
        this._aulaService
            .obtenerActividad({
                iActTipoId: this.iActTopId,
                ixActivadadId: this.ixActivadadId,
            })
            .pipe(takeUntil(this.unsbscribe$))
            .subscribe({
                next: (resp) => {
                    this.evaluacion = resp
                },
            })
    }
}
