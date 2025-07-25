import {
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnInit,
    AfterViewChecked,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ICurso } from '../interfaces/curso.interface'
import { IEstudiante } from '@/app/sistema/aula-virtual/interfaces/estudiantes.interface'
import { TabContenidoComponent } from './tabs/tab-contenido/tab-contenido.component'
import { TabResultadosComponent } from './tabs/tab-resultados/tab-resultados.component'
import { TabInicioComponent } from './tabs/tab-inicio/tab-inicio.component'
import { PrimengModule } from '@/app/primeng.module'
import { ToolbarPrimengComponent } from '../../../../../shared/toolbar-primeng/toolbar-primeng.component'
import { TabsPrimengComponent } from '../../../../../shared/tabs-primeng/tabs-primeng.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { DOCENTE, ESTUDIANTE } from '@/app/servicios/perfilesConstantes'

@Component({
    selector: 'app-curso-detalle',
    standalone: true,
    imports: [
        TabContenidoComponent,
        TabResultadosComponent,
        TabInicioComponent,
        PrimengModule,
        ToolbarPrimengComponent,
        TabsPrimengComponent,
    ],
    templateUrl: './curso-detalle.component.html',
    styleUrl: './curso-detalle.component.scss',
})
export class CursoDetalleComponent implements OnInit, AfterViewChecked {
    @Input() iSilaboId: string
    private _activatedRoute = inject(ActivatedRoute)
    private _ChangeDetectorRef = inject(ChangeDetectorRef)
    private _constantesService = inject(ConstantesService)

    public DOCENTE = DOCENTE
    public ESTUDIANTE = ESTUDIANTE

    curso: ICurso | undefined
    selectTab: number = 0
    iPerfilId: number

    tabs = [
        {
            title: 'Inicio',
            icon: 'pi pi-home',
            tab: 'inicio',
        },
        {
            title: 'Contenido',
            icon: 'pi pi-book',
            tab: 'contenido',
        },
        {
            title: 'Resultado',
            icon: 'pi pi-users',
            tab: 'resultados',
        },
    ]

    public estudiantes: IEstudiante[] = []

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        // const storedTab = localStorage.getItem('selectedTab')
        // if (storedTab !== null) {
        //     this.selectTab = Number(storedTab)
        // }
        this.route.queryParams.subscribe((params) => {
            if (params['tab'] !== undefined) {
                this.selectTab = Number(params['tab'])
            }
        })
        this.listenParams()
        this.iPerfilId = Number(this._constantesService.iPerfilId)
    }

    // obtiene el parametro y actualiza el tab
    listenParams() {
        const cCursoNombre =
            this._activatedRoute.snapshot.queryParams['cCursoNombre']
        const cNivelNombreCursos =
            this._activatedRoute.snapshot.queryParams['cNivelNombreCursos']
        const cNivelTipoNombre =
            this._activatedRoute.snapshot.queryParams['cNivelTipoNombre']
        const cGradoAbreviacion =
            this._activatedRoute.snapshot.queryParams['cGradoAbreviacion']
        const cSeccionNombre =
            this._activatedRoute.snapshot.queryParams['cSeccionNombre']
        const cCicloRomanos =
            this._activatedRoute.snapshot.queryParams['cCicloRomanos']
        const idDocCursoId =
            this._activatedRoute.snapshot.queryParams['idDocCursoId']
        const iCursoId = this._activatedRoute.snapshot.queryParams['iCursoId']
        const iNivelCicloId =
            this._activatedRoute.snapshot.queryParams['iNivelCicloId']
        const iIeCursoId =
            this._activatedRoute.snapshot.queryParams['iIeCursoId']
        const iSeccionId =
            this._activatedRoute.snapshot.queryParams['iSeccionId']
        const iNivelGradoId =
            this._activatedRoute.snapshot.queryParams['iNivelGradoId']
        const cantidad = this._activatedRoute.snapshot.queryParams['cantidad']
        this.curso = {
            cCursoNombre,
            iCursoId,
            iSilaboId: this.iSilaboId,
            cNivelNombreCursos,
            cNivelTipoNombre,
            cGradoAbreviacion,
            cSeccionNombre,
            cCicloRomanos,
            idDocCursoId,
            iNivelCicloId,
            iIeCursoId,
            iSeccionId,
            iNivelGradoId,
            cantidad,
        }
    }
    //función para recorrer el tabs para que filtre segun el perfil
    updateTab(tab): void {
        console.log('hola', tab)
        this.router.navigate([], {
            queryParams: { tab: tab },
            queryParamsHandling: 'merge',
        })

        // this.selectTab = tab
        // localStorage.setItem('selectedTab', tab.toString()) // mostrar la misma pagina al recargar
    }

    ngAfterViewChecked() {
        this._ChangeDetectorRef.detectChanges()
    }
}
