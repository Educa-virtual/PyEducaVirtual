import { Routes } from '@angular/router'
import { CursosComponent } from './cursos/cursos.component'
import { ActividadComponent } from './actividad/actividad.component'
import { CursoDetalleComponent } from './cursos/curso-detalle/curso-detalle.component'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CursosComponent,
    },
    {
        path: ':iSilaboId',
        component: CursoDetalleComponent,
    },
    {
        path: 'actividad/:actividadId/:iActTopId',
        component: ActividadComponent,
    },
]

export default routes
