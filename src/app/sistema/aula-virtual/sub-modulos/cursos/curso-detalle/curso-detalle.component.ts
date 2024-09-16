import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { BreadcrumbModule } from 'primeng/breadcrumb'
import { TabMenuModule } from 'primeng/tabmenu'
import { TabViewModule } from 'primeng/tabview'
import { CursoDetalleNavigationComponent } from './curso-detalle-navigation/curso-detalle-navigation.component'
import { RouterOutlet } from '@angular/router'
import { PanelModule } from 'primeng/panel'
import { TabContenidoComponent } from './tabs/tab-contenido/tab-contenido.component'
import { TabsKeys } from './tabs/tab.interface'
import { TabEstudiantesComponent } from './tabs/tab-estudiantes/tab-estudiantes.component'
import { TabInicioComponent } from './tabs/tab-inicio/tab-inicio.component'
import { TabEvaluacionesComponent } from './tabs/tab-evaluaciones/tab-evaluaciones.component'
import { MenuModule } from 'primeng/menu'
import { ProfesorAvatarComponent } from '../components/profesor-avatar/profesor-avatar.component'
import { IEstudiante } from '../../../interfaces/estudiantes.interface'
import { ICurso } from '../interfaces/curso.interface'

@Component({
    selector: 'app-curso-detalle',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbModule,
        TabMenuModule,
        TabViewModule,
        TabContenidoComponent,
        CursoDetalleNavigationComponent,
        RouterOutlet,
        PanelModule,
        TabEstudiantesComponent,
        TabInicioComponent,
        TabEvaluacionesComponent,
        ProfesorAvatarComponent,
        MenuModule,
    ],
    templateUrl: './curso-detalle.component.html',
    styleUrl: './curso-detalle.component.scss',
})
export class CursoDetalleComponent implements OnInit {
    curso: ICurso | undefined
    tab: TabsKeys = 'inicio'

    items: MenuItem[] | undefined

    home: MenuItem | undefined

    rangeDates: Date[] | undefined

    public estudiantes: IEstudiante[] = []

    ngOnInit() {
        this.curso = {
            id: 1,
            nombre: 'Matemática I',
            descripcion: 'Matemática I Un curso espectacular',
            totalEstudiantes: 20,
            grado: '1°',
            seccion: 'A',
        }
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

    updateTab(tab: TabsKeys) {
        this.tab = tab
    }
}
