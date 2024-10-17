import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { CommonModule } from '@angular/common'
import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { CardModule } from 'primeng/card'
import { DataViewModule, DataView } from 'primeng/dataview'
import { TableModule } from 'primeng/table'
import { TablePrimengComponent } from '../../../../../shared/table-primeng/table-primeng.component'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { CursoCardComponent } from '../components/curso-card/curso-card.component'
import { ICurso } from '../interfaces/curso.interface'
import { DropdownModule } from 'primeng/dropdown'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { Subject, takeUntil } from 'rxjs'
import { ButtonModule } from 'primeng/button'
import { AreasEstudiosComponent } from '../../../../docente/areas-estudios/areas-estudios.component'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { PrimengModule } from '@/app/primeng.module'

export type Layout = 'list' | 'grid'
@Component({
    selector: 'app-cursos',
    standalone: true,
    imports: [
        CommonModule,
        ContainerPageComponent,
        CardModule,
        DataViewModule,
        TableModule,
        TablePrimengComponent,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        CursoCardComponent,
        DropdownModule,
        ButtonModule,
        AreasEstudiosComponent,
        ButtonModule,
        PrimengModule,
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

    constructor() {}

    ngOnInit(): void {
        const profile = this._store.getItem('dremoPerfil')
        switch (profile.iProfile) {
            case 2:
                this.layout = 'list'
                break
            case 1:
                this.layout = 'grid'
                break
            default:
                break
        }
        this.getCursos()
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

    getCursos() {
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'docente-cursos',
            ruta: 'list', //'getDocentesCursos',
            data: {
                opcion: 'CONSULTARxiPersId',
                iCredId: this._constantesService.iCredId,
                cYearNombre: null,
                iSemAcadId: null,
                iIieeId: null,
            },
            params: { skipSuccessMessage: true },
        }
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
