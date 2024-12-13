import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, ViewChild, OnInit } from '@angular/core'
import { AulaBancoPreguntasComponent } from '../aula-banco-preguntas/aula-banco-preguntas.component'
import { CommonModule } from '@angular/common'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { Subject, takeUntil } from 'rxjs'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ToolbarPrimengComponent } from '../../../../../shared/toolbar-primeng/toolbar-primeng.component'
import { EvaluacionButtonAgregarPreguntasComponent } from '../../actividades/actividad-evaluacion/evaluacion-button-agregar-preguntas/evaluacion-button-agregar-preguntas.component'
import { AulaBancoPreguntasService } from '../aula-banco-preguntas/aula-banco-.preguntas.service'

@Component({
    selector: 'app-aula-banco-pregunta-page',
    standalone: true,
    imports: [
        PrimengModule,
        CommonModule,
        AulaBancoPreguntasComponent,
        ToolbarPrimengComponent,
        EvaluacionButtonAgregarPreguntasComponent,
    ],
    templateUrl: './aula-banco-pregunta-page.component.html',
    styleUrl: './aula-banco-pregunta-page.component.scss',
    providers: [AulaBancoPreguntasService],
})
export class AulaBancoPreguntaPageComponent implements OnInit {
    @ViewChild(AulaBancoPreguntasComponent)
    bancoPreguntasComponent!: AulaBancoPreguntasComponent

    public cursos = [
        {
            iCursoId: 0,
            cCursoNombre: 'Todos',
        },
    ]

    params = {
        iCursoId: 0,
        iDocenteId: null,
        iCurrContId: null,
        iNivelCicloId: null,
        busqueda: '',
        iTipoPregId: 0,
        iEvaluacionId: 0,
    }
    tipoPreguntas = [
        {
            iTipoPregId: 0,
            cTipoPregDescripcion: 'Todos',
        },
        {
            iTipoPregId: 1,
            cTipoPregDescripcion: 'Opción única',
        },
        {
            iTipoPregId: 2,
            cTipoPregDescripcion: 'Opción múltiple',
        },
        {
            iTipoPregId: 3,
            cTipoPregDescripcion: 'Opción libre',
        },
    ]

    private _constantesService = inject(ConstantesService)
    private unsubscribe$ = new Subject<boolean>()
    private _generalService = inject(GeneralService)
    private _store = inject(LocalStoreService)
    menuAgregacionPreguntas: any

    ngOnInit() {
        const year = this._store.getItem('dremoYear')
        this.getCursosDocente(year)
    }

    obtenerBancoPreguntas() {
        this.bancoPreguntasComponent.obtenerBancoPreguntas()
    }

    getCursosDocente(year) {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'docente-cursos',
            ruta: 'list', //'getDocentesCursos',
            data: {
                opcion: 'CONSULTARxiPersIdxiYearId',
                iCredId: this._constantesService.iCredId,
                valorBusqueda: year, //iYearId
                iSemAcadId: null,
                iIieeId: null,
            },
            params: { skipSuccessMessage: true },
        }
        this.obtenerCursos(params)
    }

    obtenerCursos(params) {
        this._generalService
            .getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response) => {
                    this.cursos = [
                        {
                            iCursoId: 0,
                            cCursoNombre: 'Todos',
                        },
                        ...response.data,
                    ]
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
    }

    private _aulaBancoPreguntasService = inject(AulaBancoPreguntasService)
    agregarPreguntas() {
        this.agregarEditarPregunta({
            iPreguntaId: 0,
            preguntas: [],
            iEncabPregId: -1,
        })
    }
    agregarEditarPregunta(pregunta) {
        const refModal = this._aulaBancoPreguntasService.openPreguntaModal({
            pregunta,
            iCursoId: this.params.iCursoId,
            tipoPreguntas: [],
            iEvaluacionId: null,
            padreComponente: 'AULA-VIRTUAL',
        })
        refModal.onClose.subscribe((result) => {
            if (result) {
                // const pregunta = this.mapLocalPregunta(result)
                // this.preguntas.push(pregunta)
                // this.preguntasSeleccionadasChange.emit(this.preguntas)
            }
        })
    }
}
