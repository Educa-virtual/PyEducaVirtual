import { IconComponent } from '@/app/shared/icon/icon.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core'
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
import { EvaluacionRoomCalificacionComponent } from './evaluacion-room-calificacion/evaluacion-room-calificacion.component'
import { PrimengModule } from '@/app/primeng.module'
import { EditorNoToolbarDirective } from '@/app/shared/directives/editor-no-toolbar.directive'

@Component({
    selector: 'app-evaluacion-room',
    standalone: true,
    imports: [
        CommonModule,
        IconComponent,
        TablePrimengComponent,
        PrimengModule,
        LeyendaTareasComponent,
        EvaluacionFormPreguntasComponent,
        EvaluacionRoomCalificacionComponent,
        EditorNoToolbarDirective,
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
export class EvaluacionRoomComponent implements OnInit, OnDestroy {
    @Input() ixActivadadId: string
    @Input() iActTopId: tipoActividadesKeys

    // injeccion de dependencias
    private _route = inject(ActivatedRoute)
    private _aulaService = inject(ApiAulaService)

    private unsbscribe$ = new Subject<boolean>()
    public iPerfilId = 1
    public evaluacion
    public cEvaluacionInstrucciones

    ngOnInit() {
        this.obtenerEvaluacion()
    }

    // obtiene la evalución
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
                    this.cEvaluacionInstrucciones =
                        this.evaluacion.cEvaluacionDescripcion
                },
            })
    }

    // desuscribe los observables al eliminarse el componente
    ngOnDestroy() {
        this.unsbscribe$.next(true)
        this.unsbscribe$.complete()
    }
}
