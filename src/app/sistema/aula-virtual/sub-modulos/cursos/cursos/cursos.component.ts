import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { DataView } from 'primeng/dataview'
import { CursoCardComponent } from '../components/curso-card/curso-card.component'
import { ICurso } from '../interfaces/curso.interface'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { Subject, takeUntil } from 'rxjs'
import { AreasEstudiosComponent } from '../../../../docente/areas-estudios/areas-estudios.component'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { PrimengModule } from '@/app/primeng.module'
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'

export type Layout = 'list' | 'grid'
@Component({
    selector: 'app-cursos',
    standalone: true,
    imports: [
        ContainerPageComponent,
        CursoCardComponent,
        AreasEstudiosComponent,
        PrimengModule,
        ToolbarPrimengComponent,
    ],
    templateUrl: './cursos.component.html',
    styleUrl: './cursos.component.scss',
})
export class CursosComponent implements OnDestroy, OnInit {
    public cursos: ICurso[] = []
    public data: ICurso[] = []

    public sortField: string = ''
    public sortOrder: number = 0
    public layout: Layout = 'list'
    options = ['list', 'grid']
    public searchText: Event
    public text: string = ''

    private unsubscribe$ = new Subject<boolean>()
    private _constantesService = inject(ConstantesService)
    private _generalService = inject(GeneralService)
    private _store = inject(LocalStoreService)

    constructor(private store: LocalStoreService) {}

    ngOnInit(): void {
        const modulo = this._store.getItem('dremoModulo')
        switch (Number(modulo.iModuloId)) {
            case 1:
                this.layout = 'grid'
                break
            case 2:
                this.layout = 'list'
                break
            default:
                break
        }

        this.obtenerPerfil()
    }

    public onFilter(dv: DataView, event: Event) {
        const text = (event.target as HTMLInputElement).value
        this.cursos = this.data
        dv.value = this.data
        if (text.length > 1) {
            dv.filter(text)
            this.cursos = dv.filteredValue
        }
        if (this.layout === 'list') {
            this.searchText = event
        }
    }

    obtenerPerfil() {
        const year = this.store.getItem('dremoYear')
        const perfil = this.store.getItem('dremoPerfil')
        switch (Number(perfil.iPerfilId)) {
            case DOCENTE:
                this.getCursosDocente()
                break
            case ESTUDIANTE:
                this.getCursosEstudiante(year)
                break
        }
    }

    // muestra en la area curriculares los cursos del docente,grado y seccion
    getCursosDocente() {
        const params = {
            petition: 'post',
            group: 'acad',
            prefix: 'docente',
            ruta: 'docente_curso',
            data: {
                opcion: 2,
                iDocenteId: this._constantesService.iDocenteId,
                iYearId: this._constantesService.iYAcadId,
                iSedeId: this._constantesService.iSedeId,
                iIieeId: this._constantesService.iIieeId,
            },
            params: { skipSuccessMessage: true },
        }
        this.obtenerCursos(params)
    }

    // getCursosDocente(year) {
    //     const params = {
    //         petition: 'post',
    //         group: 'acad',
    //         prefix: 'docente',
    //         ruta: 'docente_curso',
    //         data: {
    //             opcion: 'CONSULTARxiPersIdxiYearId',
    //             iCredId: this._constantesService.iCredId,
    //             valorBusqueda: year, //iYearId
    //             iSemAcadId: null,
    //             iIieeId: null,
    //         },
    //         params: { skipSuccessMessage: true },
    //     }
    //     this.obtenerCursos(params)
    // }
    getCursosEstudiante(year) {
        const params = {
            petition: 'post',
            group: 'acad',
            prefix: 'estudiantes',
            ruta: 'obtenerCursosXEstudianteAnioSemestre',
            data: {
                iEstudianteId: this._constantesService.iEstudianteId,
                iYearId: year,
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
                    this.cursos = response.data.map((curso) => ({
                        iCursoId: curso.idDocCursoId,
                        ...curso,
                    }))
                    this.data = this.cursos
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true)
    }
}
