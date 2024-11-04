import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import {
    Component,
    OnInit,
    OnDestroy,
    inject,
    Input,
    OnChanges,
    ViewChild,
} from '@angular/core'
import { TablePrimengComponent } from '../../../shared/table-primeng/table-primeng.component'
import { RecursosDidacticosComponent } from './components/recursos-didacticos/recursos-didacticos.component'
import { Router } from '@angular/router'
import { Table } from 'primeng/table'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { Subject, takeUntil } from 'rxjs'
import { LocalStoreService } from '@/app/servicios/local-store.service'
interface Data {
    accessToken: string
    refreshToken: string
    expires_in: number
    msg?
    data?
    validated?: boolean
    code?: number
}
@Component({
    selector: 'app-areas-estudios',
    standalone: true,
    imports: [
        ContainerPageComponent,
        PrimengModule,
        TablePrimengComponent,
        RecursosDidacticosComponent,
    ],
    templateUrl: './areas-estudios.component.html',
    styleUrl: './areas-estudios.component.scss',
    providers: [MessageService],
})
export class AreasEstudiosComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild('dv') dv!: Table

    @Input() data = []
    @Input() searchText: Event
    private unsubscribe$ = new Subject<boolean>()
    private _constantesService = inject(ConstantesService)
    private _generalService = inject(GeneralService)

    constructor(
        private router: Router,
        private MessageService: MessageService,
        private store: LocalStoreService
    ) {}

    selectedData = []
    items = []
    // data = []
    messages = [
        {
            severity: 'info',
            detail: 'En esta sección podrá visualizar las áreas curriculares asignadas para el periodo seleccionado, así como la institución educativa a la que pertenece.',
        },
    ]
    iPerfilId: number
    ngOnInit() {
        this.iPerfilId = this._constantesService.iPerfilId
        this.items = [
            {
                label: 'Fichas de Aprendizaje',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.goSection('ficha-aprendizaje')
                },
            },
            {
                label: 'Programación curricular',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.goSection('silabo')
                },
            },

            {
                label: 'Sesiones de Aprendizaje',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.goSection('sesion-aprendizaje')
                },
            },
            {
                label: 'Registro de evaluación',
                icon: 'pi pi-angle-right',
                command: () => {},
            },
            {
                label: 'Material Educativo',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.goSection('material-educativo')
                },
            },
            {
                label: 'Cuaderno de campo',
                icon: 'pi pi-angle-right',
                command: () => {},
            },
            {
                label: 'Instrumentos de Evaluación',
                icon: 'pi pi-angle-right',
                command: () => {},
            },
            {
                label: 'Plan de trabajo',
                icon: 'pi pi-angle-right',
                command: () => {},
            },
            {
                label: 'Asistencia',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.goSection('asistencia')
                },
            },
        ]
    }
    ngOnChanges(changes) {
        if (changes.data?.currentValue) {
            this.data = changes.data.currentValue
        }

        if (changes.searchText?.currentValue) {
            this.searchText = changes.searchText.currentValue
            this.onGlobalFilter(this.dv, this.searchText)
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        if (!table) return
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    goSection(section) {
        switch (section) {
            case 'silabo':
                this.router.navigateByUrl(
                    'docente/gestionar-programacion-curricular/' +
                        this.selectedData['idDocCursoId'] +
                        '/' +
                        this.selectedData['cCursoNombre'].replace(
                            /[\^*@!"#$%&/()=?¡!¿':\\]/gi,
                            ''
                        ) +
                        '/' +
                        this.selectedData['iAvanceSilabo']
                )
                break
            case 'sesion-aprendizaje':
                this.router.navigateByUrl('docente/sesion-aprendizaje')
                break
            case 'asistencia':
                this.router.navigateByUrl(
                    'docente/asistencia/' +
                        this.selectedData['iCursoId'] +
                        '/' +
                        this.selectedData['cCursoNombre'].replace(
                            /[\^*@!"#$%&/()=?¡!¿':\\]/gi,
                            ''
                        ) +
                        '/' +
                        this.selectedData['iNivelGradoId'] +
                        '/' +
                        this.selectedData['iSeccionId']
                )
                break
            case 'material-educativo':
                this.router.navigateByUrl(
                    'docente/material-educativo/' +
                        this.selectedData['idDocCursoId'] +
                        '/' +
                        this.selectedData['cCursoNombre'].replace(
                            /[\^*@!"#$%&/()=?¡!¿':\\]/gi,
                            ''
                        )
                )
                break
        }
    }
    getCursos() {
        const year = this.store.getItem('dremoYear')

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
        this._generalService
            .getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Data) => {
                    this.data = []
                    this.data = response.data
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
    }

    getSilaboPdf(iSilaboId) {
        if (!iSilaboId) return
        const params = {
            petition: 'get',
            group: 'docente',
            prefix: 'silabus_reporte',
            ruta: 'report',
            iSilaboId: iSilaboId,
            params: { skipSuccessMessage: true },
        }
        this._generalService.getGralReporte(params)
    }
    ngOnDestroy() {
        this.unsubscribe$.next(true)
    }
}
