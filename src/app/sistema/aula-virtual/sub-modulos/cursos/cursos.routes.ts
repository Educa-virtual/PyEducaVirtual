import { Routes } from '@angular/router'
import { CursoDetalleComponent } from './curso-detalle/curso-detalle.component'
import { CursosComponent } from './cursos/cursos.component'
import { ActividadComponent } from './actividad/actividad.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CursosComponent,
    },
    {
        path: ':id',
        component: CursoDetalleComponent,
    },
    {
        path: 'actividad/:actividadId/:iActTopId',
        component: ActividadComponent,
    },
]

export default routes
