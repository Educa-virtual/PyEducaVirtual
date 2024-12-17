import { EvaluacionFinalizadaComponent } from './../evaluacion-finalizada/evaluacion-finalizada.component'
import { ApiEvaluacionesService } from '@/app/sistema/aula-virtual/services/api-evaluaciones.service'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core'
import { provideIcons } from '@ng-icons/core'
import {
    matAccessTime,
    matCalendarMonth,
    matHideSource,
    matListAlt,
    matMessage,
    matRule,
    matStar,
    matFactCheck,
    matQuiz,
    matAssignment,
    matDescription,
    matForum,
    matVideocam,
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
import { ActividadListaComponent } from '../../components/actividad-lista/actividad-lista.component'
import { RubricaEvaluacionComponent } from '@/app/sistema/aula-virtual/features/rubricas/components/rubrica-evaluacion/rubrica-evaluacion.component'
import { RubricaCalificarComponent } from '@/app/sistema/aula-virtual/features/rubricas/components/rubrica-calificar/rubrica-calificar.component'
import { ToolbarPrimengComponent } from '../../../../../../shared/toolbar-primeng/toolbar-primeng.component'
@Component({
    selector: 'app-evaluacion-room',
    standalone: true,
    imports: [
        CommonModule,
        RubricaEvaluacionComponent,
        RubricasComponent,
        IconComponent,
        PrimengModule,
        EvaluacionFormPreguntasComponent,
        EvaluacionRoomCalificacionComponent,
        EditorOnlyViewDirective,
        RecursosListaComponent,
        EmptySectionComponent,
        EvaluacionEstudiantesComponent,
        EvaluacionFinalizadaComponent,
        ActividadListaComponent,
        RubricaCalificarComponent,
        ToolbarPrimengComponent,
    ],
    templateUrl: './evaluacion-room.component.html',
    styleUrl: './evaluacion-room.component.scss',
    providers: [
        ApiEvaluacionesService,

        provideIcons({
            matHideSource,
            matCalendarMonth,
            matMessage,
            matStar,
            matRule,
            matListAlt,
            matAccessTime,

            matFactCheck,
            matQuiz,
            matAssignment,
            matDescription,
            matForum,
            matVideocam,
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

    actividad = {
        iContenidoSemId: 1,
        iProgActId: 57,
        cProgActTituloLeccion: 'Exmaen de recuperación final',
        iActTipoId: 3,
        iPragActEstado: 1,
        cActTipoNombre: 'Evaluación Formativa',
        idDocCursoId: 1,
        ixActivadadId: 'kVap2xygkeWrXR7q5mdBKjl6dNOzYAQ4oMGEZ31v09JbLDNw8N',
        dtProgActInicio: '2024-10-19T14:00:00',
        dtProgActFin: '2024-10-19T15:00:00',
        dtProgActPublicacion: '2024-10-10T20:12:00',
        iEstado: 2,
        iEvaluacionId: 17,
        cTareaTitulo: null,
        iForoId: null,
        iEstadoActividad: 0,
    }
    params = {
        iCursoId: 0,
        iDocenteId: 0,
        idDocCursoId: 0,
        iEvaluacionId: null,
    }

    rubricas = [
        {
            iInstrumentoId: 0,
            cInstrumentoNombre: 'Sin instrumento de evaluación',
        },
    ]

    constructor(
        private _evaluacionService: ApiEvaluacionesService,
        private _constantesService: ConstantesService,

        private _activeRoute: ActivatedRoute
    ) {}

    handleActions(action) {
        console.log(action)
    }

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

    dialogRubricaInfo = {
        visible: false,
        header: undefined,
    }

    showRubrica(data) {
        this.dialogRubricaInfo.visible = true
        this.dialogRubricaInfo.header = data
    }

    private unsbscribe$ = new Subject<boolean>()
    public iPerfilId: number
    public evaluacion
    public cEvaluacionInstrucciones

    ngOnInit() {
        this.params.iDocenteId = this._constantesService.iDocenteId

        this._activeRoute.queryParams.subscribe((params) => {
            this.params.iCursoId = params['iCursoId'] ?? null
            this.params.idDocCursoId = params['idDocCursoId'] ?? null
            this.params.iEvaluacionId = params['iEvaluacionId'] ?? null
        })

        console.log('params')
        console.log(this.params)

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
