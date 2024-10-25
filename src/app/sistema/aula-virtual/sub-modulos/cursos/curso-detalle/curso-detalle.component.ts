import { CommonModule } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { TabMenuModule } from 'primeng/tabmenu'
import { TabViewModule } from 'primeng/tabview'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { PanelModule } from 'primeng/panel'
import { isValidTabKey, TabsKeys } from './tabs/tab.interface'
import { TabEvaluacionesComponent } from './tabs/tab-evaluaciones/tab-evaluaciones.component'
import { MenuModule } from 'primeng/menu'
import { ProfesorAvatarComponent } from '../components/profesor-avatar/profesor-avatar.component'
import { ICurso } from '../interfaces/curso.interface'
import { IEstudiante } from '@/app/sistema/aula-virtual/interfaces/estudiantes.interface'
import { CursoDetalleNavigationComponent } from './curso-detalle-navigation/curso-detalle-navigation.component'
import { TabContenidoComponent } from './tabs/tab-contenido/tab-contenido.component'
import { TabEstudiantesComponent } from './tabs/tab-estudiantes/tab-estudiantes.component'
import { TabResultadosComponent } from './tabs/tab-resultados/tab-resultados.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'
import { TabInicioComponent } from './tabs/tab-inicio/tab-inicio.component'

@Component({
    selector: 'app-curso-detalle',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbModule,
        TabMenuModule,
        TabViewModule,
        CursoDetalleNavigationComponent,
        PanelModule,
        TabEvaluacionesComponent,
        ProfesorAvatarComponent,
        MenuModule,
        TabContenidoComponent,
        TabEstudiantesComponent,
        TabResultadosComponent,
        TabInicioComponent,
    ],
    templateUrl: './curso-detalle.component.html',
    styleUrl: './curso-detalle.component.scss',
})
export class CursoDetalleComponent implements OnInit {
    @Input() iSilaboId: string
    private _activatedRoute = inject(ActivatedRoute)
    private _router = inject(Router)
    private _constantesService = inject(ConstantesService)
    private _generalService = inject(GeneralService)

    curso: ICurso | undefined
    tab: TabsKeys

    items: MenuItem[] | undefined

    home: MenuItem | undefined

    rangeDates: Date[] | undefined

    public estudiantes: IEstudiante[] = []

    ngOnInit() {
        console.log(this.iSilaboId)
        this.getData()

        this.listenParams()

        this.items = [
            { icon: 'pi pi-home', route: '/aula-virtual' },
            { label: 'Cursos', route: '/aula-virtual/cursos' },
            { label: 'Matemática I', route: '/aula-virtual/cursos/0' },
        ]

        this.estudiantes = [
            {
                id: '1',
                nombre: 'Estudiante',
                apellidos: '1',
                email: '1',
                numeroOrden: 1,
            },
            {
                id: '2',
                nombre: 'Estudiante',
                apellidos: '2',
                email: '2',
                numeroOrden: 2,
            },
        ]
    }

    getData() {}

    // obtiene el parametro y actualiza el tab
    listenParams() {
        const tab = this._activatedRoute.snapshot.queryParams['tab']
        const cCursoNombre =
            this._activatedRoute.snapshot.queryParams['cCursoNombre']

        this.curso = {
            cCursoNombre,
            iCursoId: '1',
            iSilaboId: this.iSilaboId,
        }
        if (isValidTabKey(tab)) {
            this.updateTab(tab)
        }
    }

    // verifica el paramatero y coloca el tab
    setNewTabQueryParam(tab: TabsKeys) {
        const queryParams: Params = { tab: tab }

        this._router.navigate([], {
            relativeTo: this._activatedRoute,
            queryParams,
            queryParamsHandling: 'merge',
        })
    }

    // actualiza los tabs basado en el parametro
    updateTab(tab: TabsKeys) {
        this.tab = tab
        this.setNewTabQueryParam(this.tab)
    }
}
