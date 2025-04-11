import { PrimengModule } from '@/app/primeng.module'
// import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import {
    Component,
    OnInit,
    OnDestroy,
    inject,
    Input,
    OnChanges,
    ViewChild,
} from '@angular/core'
// import { TablePrimengComponent } from '../../../shared/table-primeng/table-primeng.component'
// import { RecursosDidacticosComponent } from './components/recursos-didacticos/recursos-didacticos.component'
import { Router } from '@angular/router'
import { Table } from 'primeng/table'
import { GeneralService } from '@/app/servicios/general.service'
import { MessageService } from 'primeng/api'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { Subject, takeUntil } from 'rxjs'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes'
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
        // ContainerPageComponent,
        PrimengModule,
        // TablePrimengComponent,
        // RecursosDidacticosComponent,
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

    opcionCurso = []
    idDocenteCurso: number
    seleccionarCurso: any = ''
    cursoSilabos = []
    visible = false
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
    public DOCENTE = DOCENTE
    public ESTUDIANTE = ESTUDIANTE
    ngOnInit() {
        this.iPerfilId = this._constantesService.iPerfilId
        this.items = [
            // {
            //     label: 'Fichas de Aprendizaje',
            //     icon: 'pi pi-angle-right',
            //     command: () => {
            //         this.goSection('ficha-aprendizaje')
            //     },
            // },
            {
                label: 'Programación curricular',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.goSection('silabo')
                },
            },

            // {
            //     label: 'Sesiones de Aprendizaje',
            //     icon: 'pi pi-angle-right',
            //     command: () => {
            //         this.goSection('sesion-aprendizaje')
            //     },
            // },
            // {
            //     label: 'Registro de evaluación',
            //     icon: 'pi pi-angle-right',
            //     command: () => {},
            // },
            {
                label: 'Material Educativo',
                icon: 'pi pi-angle-right',
                command: () => {
                    this.goSection('material-educativo')
                },
            },
            // {
            //     label: 'Cuaderno de campo',
            //     icon: 'pi pi-angle-right',
            //     command: () => {},
            // },
            // {
            //     label: 'Instrumentos de Evaluación',
            //     icon: 'pi pi-angle-right',
            //     command: () => {},
            // },
            // {
            //     label: 'Plan de trabajo',
            //     icon: 'pi pi-angle-right',
            //     command: () => {},
            // },
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
                        this.selectedData['iSeccionId'] +
                        '/' +
                        this.selectedData['iDocenteId'] +
                        '/' +
                        this.selectedData['iYAcadId'] +
                        '/' +
                        this.selectedData['iGradoId'] +
                        '/' +
                        this.selectedData['cNivelTipoNombre'].replace(
                            /[\^*@!"#$%&/()=?¡!¿':\\]/gi,
                            ''
                        ) +
                        '/' +
                        this.selectedData['cGradoAbreviacion'].replace(
                            /[\^*@!"#$%&/()=?¡!¿':\\]/gi,
                            ''
                        ) +
                        '/' +
                        this.selectedData['cSeccion'].replace(
                            /[\^*@!"#$%&/()=?¡!¿':\\]/gi,
                            ''
                        ) +
                        '/' +
                        this.selectedData['cCicloRomanos'].replace(
                            /[\^*@!"#$%&/()=?¡!¿':\\]/gi,
                            ''
                        ) +
                        '/' +
                        this.selectedData['cNivelNombreCursos'].replace(
                            /[\^*@!"#$%&/()=?¡!¿':\\]/gi,
                            ''
                        ) +
                        '/' +
                        this.selectedData['nombrecompleto'].replace(
                            /[\^*@!"#$%&/()=?¡!¿':\\]/gi,
                            ''
                        )
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
            // case 'calendario':
            //     this.router.navigateByUrl(
            //         'docente/calendario/' +
            //             this.selectedData['idDocCursoId'] +
            //             '/' +
            //             this.selectedData['iYAcadId'] +
            //             '/' +
            //             this.selectedData['iCursoId'] +
            //             '/' +
            //             this.selectedData['iSeccionId']
            //     )
            //     break
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
    descripcion: string
    // importammos los silabos de los cursos dispnibles para la etiqueta modal
    importarSilabos(docentecurso: string[]) {
        this.descripcion =
            docentecurso['cCursoNombre'] +
            ' ' +
            docentecurso['cGradoAbreviacion'] +
            ' ' +
            docentecurso['cSeccionNombre']
        this.cursoSilabos = docentecurso
        // filtra los cursos que tienen un silabos
        const cursoId = docentecurso['iCursoId']
        this.idDocenteCurso = docentecurso['idDocCursoId']
        const cursos = this.data
            .filter(
                (item) => item.iSilaboId !== null && item.iCursoId == cursoId
            )
            .map((item) => ({
                idDocCursoId: item.idDocCursoId,
                iSilaboId: item.iSilaboId,
                curso:
                    item.cCursoNombre +
                    ' ' +
                    item.cGradoAbreviacion +
                    ' ' +
                    item.cSeccionNombre,
            }))
        this.opcionCurso = cursos
        this.visible = true
    }

    guardarImportacion() {
        const seleccionado = this.opcionCurso.filter(
            (item) => item.idDocCursoId == this.seleccionarCurso
        )

        const params = {
            petition: 'post',
            group: 'acad',
            prefix: 'docente',
            ruta: 'importar_silabos',
            data: {
                idDocCursoId: this.idDocenteCurso,
                iSilaboId: seleccionado[0]['iSilaboId'],
            },
        }

        this._generalService
            .getGralPrefix(params)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: (response: Data) => {
                    console.log(response.data)
                    this.cursoSilabos['iSilaboId'] = response.data[0]
                    this.MessageService.add({
                        severity: 'success',
                        summary: '¡Genial!',
                        detail: 'Importacion Exitosa',
                    })
                },
                complete: () => {},
                error: (error) => {
                    console.log(error)
                },
            })
        this.visible = false
    }
    getSilaboPdf(curso: string, grado: string, seccion: string, iSilaboId) {
        if (!iSilaboId) return
        const params = {
            petition: 'post',
            group: 'docente',
            prefix: 'silabus_reporte',
            ruta: 'report',
            data: {
                iSilaboId: iSilaboId,
            },
        }
        const fechas = new Date()
        const dia = fechas.getDate()
        const mes =
            fechas.getMonth().toString().length > 1
                ? fechas.getMonth()
                : '0' + fechas.getMonth() // Se cambia el formato del mes cuando sea 1 digito se le aumentara un 0 adelante
        const years = fechas.getFullYear()
        this._generalService.generarPdf(params).subscribe({
            next: (response) => {
                const blob = new Blob([response], { type: 'application/pdf' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download =
                    'silabo_' +
                    curso.toLowerCase() +
                    '_' +
                    grado.toLowerCase() +
                    '_' +
                    seccion.toLowerCase() +
                    '_' +
                    dia +
                    '_' +
                    mes +
                    '_' +
                    years +
                    '.pdf'
                a.click()
                window.URL.revokeObjectURL(url)
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
