import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, ViewChild, OnInit } from '@angular/core'
import { AulaBancoPreguntasComponent } from '../aula-banco-preguntas/aula-banco-preguntas.component'
import { CommonModule } from '@angular/common'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { Subject, takeUntil } from 'rxjs'
import { GeneralService } from '@/app/servicios/general.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ToolbarPrimengComponent } from '../../../../../shared/toolbar-primeng/toolbar-primeng.component'
import { AulaBancoPreguntasService } from '../aula-banco-preguntas/aula-banco-.preguntas.service'

@Component({
    selector: 'app-aula-banco-pregunta-page',
    standalone: true,
    imports: [
        PrimengModule,
        CommonModule,
        AulaBancoPreguntasComponent,
        ToolbarPrimengComponent,
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

    grados = []

    params = {
        iCursoId: 0,
        iDocenteId: null,
        iCurrContId: null,
        iNivelCicloId: null,
        iYearId: 0, // Nuevo parámetro para el año
        iSeccionId: 0, // Nuevo parámetro para la sección
        busqueda: '',
        iTipoPregId: 0,
        iEvaluacionId: 0,
        iGradoId: 0,
    }

    private _constantesService = inject(ConstantesService)
    private unsubscribe$ = new Subject<boolean>()
    private _generalService = inject(GeneralService)
    private _store = inject(LocalStoreService)
    menuAgregacionPreguntas: any
    filtros: any

    ngOnInit() {
        const year = this._store.getItem('dremoYear')
        this.getCursosDocente(year)
        this.obtenerGrados()
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

    obtenerGrados() {
        const params = {
            petition: 'post',
            group: 'acad',
            prefix: 'grados',
            ruta: 'handleCrudOperation', //'getDocentesCursos',
            data: {
                opcion: 'CONSULTAR',
                iCredId: this._constantesService.iCredId,
            },
        }
        this._generalService.getGralPrefix(params).subscribe({
            next: (response) => {
                this.grados = [
                    {
                        iGradoId: 0,
                        cGrado: 'Todos',
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
    obtenerCursos(params) {
        this._generalService
            .getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response) => {
                    const cursos = response.data

                    const cursosUnicos = cursos.filter(
                        (curso, index, self) =>
                            index ===
                            self.findIndex((c) => c.iCursoId === curso.iCursoId)
                    )
                    this.cursos = [
                        {
                            iCursoId: 0,
                            cCursoNombre: 'Todos',
                        },
                        ...cursosUnicos,
                    ]
                    console.log(response.data)
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
    public years = [
        { iYearId: 0, cYearNombre: 'Todos' },
        { iYearId: 2023, cYearNombre: '2023' },
        { iYearId: 2024, cYearNombre: '2024' },
    ]

    public secciones = [
        { iSeccionId: 0, cSeccionNombre: 'Todas' },
        { iSeccionId: 1, cSeccionNombre: 'A' },
        { iSeccionId: 2, cSeccionNombre: 'B' },
        { iSeccionId: 3, cSeccionNombre: 'C' },
    ]
}
