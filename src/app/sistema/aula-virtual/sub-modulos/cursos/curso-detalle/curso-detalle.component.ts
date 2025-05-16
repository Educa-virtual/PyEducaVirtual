import {
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnInit,
    AfterViewChecked,
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ICurso } from '../interfaces/curso.interface'
import { IEstudiante } from '@/app/sistema/aula-virtual/interfaces/estudiantes.interface'
import { TabContenidoComponent } from './tabs/tab-contenido/tab-contenido.component'
import { TabResultadosComponent } from './tabs/tab-resultados/tab-resultados.component'
import { TabInicioComponent } from './tabs/tab-inicio/tab-inicio.component'
import { PrimengModule } from '@/app/primeng.module'
import { ToolbarPrimengComponent } from '../../../../../shared/toolbar-primeng/toolbar-primeng.component'
import { TabsPrimengComponent } from '../../../../../shared/tabs-primeng/tabs-primeng.component'

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
    curso: ICurso | undefined
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
    selectTab: number = 0

    public estudiantes: IEstudiante[] = []

    ngOnInit() {
        this.listenParams()
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
        }
    }
    updateTab(tab): void {
        console.log(tab)
        this.selectTab = tab
    }

    ngAfterViewChecked() {
        this._ChangeDetectorRef.detectChanges()
    }
}
