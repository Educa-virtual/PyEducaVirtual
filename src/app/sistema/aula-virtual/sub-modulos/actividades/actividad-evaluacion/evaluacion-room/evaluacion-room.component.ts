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
import { EditorOnlyViewDirective } from '@/app/shared/directives/editor-only-view.directive'
import { RecursosListaComponent } from '@/app/shared/components/recursos-lista/recursos-lista.component'
import { EmptySectionComponent } from '@/app/shared/components/empty-section/empty-section.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { EvaluacionEstudiantesComponent } from '../evaluacion-estudiantes/evaluacion-estudiantes.component'
import { RubricasComponent } from '@/app/sistema/aula-virtual/features/rubricas/rubricas.component'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'

@Component({
    selector: 'app-evaluacion-room',
    standalone: true,
    imports: [
        CommonModule,
        RubricasComponent,
        IconComponent,
        TablePrimengComponent,
        PrimengModule,
        LeyendaTareasComponent,
        EvaluacionFormPreguntasComponent,
        EvaluacionRoomCalificacionComponent,
        EditorOnlyViewDirective,
        RecursosListaComponent,
        EmptySectionComponent,
        EvaluacionEstudiantesComponent,
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
    private _ConstantesService = inject(ConstantesService)

    items = [
        {
            label: 'Seleccione una opción',
            items: [
                {
                    label: 'Agregar rúbrica',
                    icon: 'pi pi-plus',
                },
                {
                    label: 'Agregar lista de cotejo',
                    icon: 'pi pi-plus',
                },
            ],
        },
    ]

    params = {
        iCursoId: 1,
        iDocenteId: 1,
        idDocCursoId: 1,
    }

    rubricas = [
        {
            iInstrumentoId: 0,
            cInstrumentoNombre: 'Sin instrumento de evaluación',
        },
    ]

    constructor(
        private _evaluacionService: ApiEvaluacionesService,
        private _constantesService: ConstantesService
    ) {}

    obtenerRubricas() {
        const params = {
            iDocenteId: this._ConstantesService.iDocenteId,
        }
        this._evaluacionService.obtenerRubricas(params).subscribe({
            next: (data) => {
                data.forEach((element) => {
                    this.rubricas.push(element)
                })
            },
        })
    }

    accionRubrica(elemento): void {
        if (!elemento) return
        this.obtenerRubricas()
    }

    private unsbscribe$ = new Subject<boolean>()
    public iPerfilId: number
    public evaluacion
    public cEvaluacionInstrucciones

    ngOnInit() {
        this.params.iDocenteId = this._constantesService.iDocenteId

        this.obtenerEvaluacion()
        this.iPerfilId = Number(this._ConstantesService.iPerfilId)
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
